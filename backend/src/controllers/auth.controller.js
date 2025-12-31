import AsyncWrapper from "../utils/AsyncWrapper.js";
import ExpressError from "../utils/ExpressError.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import {
  sendUserCredentialEmail,
  sendUserPasswordResetEmail,
} from "../utils/Nodemailer.js";
import crypto from "crypto";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = async (user) => {
  const populatedUser = await User.findById(user._id).populate({
    path: "role",
    populate: {
      path: "permissions",
      select: "key",
    },
  });

  const roleName = populatedUser.role ? populatedUser.role.name : null;
  const permissions = populatedUser.role
    ? populatedUser.role.permissions.map((p) => p.key)
    : [];

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: roleName,
      permissions: permissions,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
};

const handleEmailLogin = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Invalid email or password", status: 401 };
  }

  if (!user.is_active) {
    return { error: "Your account is deactivated", status: 403 };
  }

  const token = await generateToken(user);
  return {
    message: "Login successful",
    token,
    success: true,
  };
};

const handleGoogleLogin = async (authToken) => {
  const ticket = await client.verifyIdToken({
    idToken: authToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const googleId = payload.sub;
  const email = payload.email;

  const user = await User.findOne({
    $or: [{ google_id: googleId }, { email }],
  });

  if (!user) {
    return { error: "User not found", status: 401 };
  }

  if (!user.is_active) {
    return { error: "Your account is deactivated", status: 403 };
  }

  const jwtToken = await generateToken(user);

  return {
    message: "Login successful",
    token: jwtToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role ? user.role.name : null,
      is_active: user.is_active,
    },
    success: true,
  };
};

export const signIn = AsyncWrapper(async (req, res) => {
  const { email, password, authToken } = req.body;

  let result;

  if (authToken) {
    result = await handleGoogleLogin(authToken);
  } else if (email && password) {
    result = await handleEmailLogin(email, password);
  } else {
    throw new ExpressError(400, "Missing credentials", false);
  }

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(200).json(result);
});

export const signUp = AsyncWrapper(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new ExpressError(400, "All fields are required", false);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ExpressError(400, "Email already in use", false);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const createdById = req.user?.id || null;

  const roleName = "user";
  const roleDoc = await Role.findOne({ name: roleName });

  if (!roleDoc) {
    throw new ExpressError(400, "Invalid role", false);
  }

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: roleDoc._id,
    createdBy: createdById,
    updatedBy: createdById,
  });

  await sendUserCredentialEmail(user, password);

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: roleDoc.name,
      is_active: user.is_active,
      createdAt: user.createdAt,
    },
  });
});

export const getAllUsers = AsyncWrapper(async (_req, res) => {
  const users = await User.find()
    .select("-password")
    .populate("createdBy", "email")
    .populate("updatedBy", "email")
    .populate("role", "name")
    .sort({ createdAt: -1 });

  const formattedUsers = users.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role ? user.role.name : null,
    is_active: user.is_active,
    createdBy: user.createdBy,
    createdAt: user.createdAt,
  }));

  res.status(200).json({
    message: "Users retrieved successfully",
    success: true,
    users: formattedUsers,
    count: formattedUsers.length,
  });
});

export const updateUser = AsyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, is_active, is_verified } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new ExpressError(404, "User not found", false);
  }

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (typeof is_active === "boolean") user.is_active = is_active;
  if (typeof is_verified === "boolean") user.is_verified = is_verified;

  if (role) {
    let roleDoc;
    // Check if role is an ObjectId
    if (role.match(/^[0-9a-fA-F]{24}$/)) {
      roleDoc = await Role.findById(role);
    } else {
      roleDoc = await Role.findOne({ name: role });
    }

    if (!roleDoc) {
      throw new ExpressError(400, "Invalid role", false);
    }
    user.role = roleDoc._id;
  }

  if (password) {
    user.password = await bcrypt.hash(password, 12);
  }

  user.updatedBy = req.user?.id || null;
  await user.save();

  const populatedUser = await user.populate("role", "name");

  res.status(200).json({
    message: "User updated successfully",
    success: true,
    user: {
      id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      role: populatedUser.role ? populatedUser.role.name : null,
      is_active: populatedUser.is_active,
      is_verified: populatedUser.is_verified,
    },
  });
});

export const createMultipleUsers = AsyncWrapper(async (req, res) => {
  const { users } = req.body;

  if (!Array.isArray(users) || users.length === 0) {
    throw new ExpressError(400, "Users array is required", false);
  }

  const createdById = req.user?.id || null;
  const createdUsers = [];

  for (const userData of users) {
    const { name, email, password, role } = userData;

    if (!name || !email || !password) {
      throw new ExpressError(
        400,
        "Each user must have name, email, and password",
        false
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn(`Email already exists: ${email}, skipping...`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ Resolve role
    const roleName = role || "user";
    const roleDoc = await Role.findOne({ name: roleName });

    if (!roleDoc) {
      console.warn(`Invalid role: ${roleName}, skipping user ${email}`);
      continue;
    }

    // ✅ Create user with direct role reference
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: roleDoc._id,
      createdBy: createdById,
      updatedBy: createdById,
    });

    createdUsers.push({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: roleName,
      is_active: newUser.is_active,
      createdBy: newUser.createdBy,
      createdAt: newUser.createdAt,
    });

    await sendUserCredentialEmail(newUser, password);
  }

  res.status(201).json({
    message: "Users created successfully",
    success: true,
    count: createdUsers.length,
    users: createdUsers,
  });
});

export const forgotPassword = AsyncWrapper(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ExpressError(400, "Email is required", false);
  }

  const user = await User.findOne({ email });
  if (!user) {
    // Security: do not reveal user existence
    return res.status(200).json({
      message: "If the email exists, a reset link has been sent",
      success: true,
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token before saving
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendUserPasswordResetEmail(user, resetUrl);

  res.status(200).json({
    message: "Password reset link sent to email",
    success: true,
  });
});

export const resetPassword = AsyncWrapper(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    throw new ExpressError(
      400,
      "Password must be at least 6 characters",
      false
    );
  }

  // Hash token to compare with DB
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ExpressError(400, "Reset token is invalid or has expired", false);
  }

  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.updatedBy = user._id;

  await user.save();

  res.status(200).json({
    message: "Password reset successful",
    success: true,
  });
});

export const adminResetUserPassword = AsyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    throw new ExpressError(
      400,
      "Password must be at least 6 characters long",
      false
    );
  }

  if (req.user?.role !== "admin") {
    throw new ExpressError(
      403,
      "You are not authorized to perform this action",
      false
    );
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ExpressError(404, "User not found", false);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  user.updatedBy = req.user?.id || null;

  await user.save();

  try {
    await sendUserPasswordResetEmail(user, newPassword);
  } catch (err) {
    console.error("Failed to send password reset email:", err.message);
  }

  res.status(200).json({
    message: `Password for ${user.email} has been reset successfully`,
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      updatedBy: user.updatedBy,
      updatedAt: user.updatedAt,
    },
  });
});

export const deleteUser = AsyncWrapper(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new ExpressError(404, "User not found", false);
  }

  res.status(200).json({
    message: "User deleted successfully",
    success: true,
  });
});
export const getUserPermissions = AsyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id)
    .populate({
      path: "role",
      select: "name permissions",
      populate: {
        path: "permissions",
        select: "key",
      },
    })
    .select("role");

  if (!user) {
    throw new ExpressError(404, "User not found");
  }

  const permissions = user.role ? user.role.permissions.map((p) => p.key) : [];

  res.status(200).json({
    success: true,
    data: {
      role: user.role ? user.role.name : null,
      permissions: permissions,
    },
  });
});

