import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import User from "./src/models/User.js";
import Role from "./src/models/Role.js";
import Permission from "./src/models/Permission.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "kumar.ayush@adaan.com";
    const adminPassword = "Ayush@1790";

    // 1️⃣ Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    // 2️⃣ Create admin role if not exists
    let adminRole = await Role.findOne({ name: "admin" });

    if (!adminRole) {
      const permissionKeys = [
        "user:manage",
        "user.assignRole",
        "user.revokeRole",
        "role:manage",
        "role.create",
        "role.read",
        "role.assignPermission",
        "permission:manage",
        "permission.create",
        "permission.read",
        "permission.delete",
        "blog:create",
        "blog:read",
        "blog:update",
        "blog:delete",
      ];

      const permissionIds = [];
      for (const key of permissionKeys) {
        let perm = await Permission.findOne({ key });
        if (!perm) {
          perm = await Permission.create({
            key,
            description: `Auto-generated permission for ${key}`,
            module: key.split(":")[0].split(".")[0],
          });
          console.log(`✨ Created missing permission: ${key}`);
        }
        permissionIds.push(perm._id);
      }

      adminRole = await Role.create({
        name: "admin",
        description: "Administrator role",
        permissions: permissionIds,
        isActive: true,
      });

      console.log("✅ Admin role created");
    } else {
      console.log("ℹ️ Admin role already exists");
    }

    // 3️⃣ Create admin user with role assigned
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = await User.create({
      name: "Ayush Kumar",
      email: adminEmail,
      password: hashedPassword,
      role: adminRole._id, // ✅ DIRECT ROLE ASSIGNMENT
      is_active: true,
      is_verified: true,
      createdBy: null, // First user, no creator
      updatedBy: null,
    });

    console.log("✅ Admin user created");
    console.log("✅ Admin role assigned to user");

    console.log("\n🚀 Admin seeding completed successfully");
    console.log("🔑 Login credentials:");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin();
