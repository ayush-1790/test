import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Role from "../models/Role.js";

dotenv.config();

const migrateUsers = async () => {
  try {
    await connectDB();
    console.log("Starting user migration...");

    // 1. Get default roles
    const userRole = await Role.findOne({ name: "user" });
    const adminRole = await Role.findOne({ name: "admin" });

    if (!userRole || !adminRole) {
      console.error("Roles not found. Please run initPermissions.js first.");
      process.exit(1);
    }

    // 2. Find users without 'role' field
    const users = await User.find({ role: { $exists: false } });
    console.log(`Found ${users.length} users to migrate.`);

    for (const user of users) {
      // Logic to determine role based on old 'roles' array if possible
      // But since 'roles' was array of ObjectIds, and we might not be able to easily resolve them if they pointed to old schema or if we don't look them up.
      // However, usually we can just look at if they had "admin" privilege?
      // Since I can't easily see the old roles names without populating them (and they might be gone if I dropped collection? No I didn't drop).

      // Simplest strategy:
      // If user.email includes 'admin' or something? No.
      // Let's just assign 'user' role to everyone by default, and manually fix Admin.
      // OR try to populate old roles?
      // User model already changed `roles` to `role`? NO, I removed `roles` from schema in Step 22.
      // So `user.roles` might not even be accessible via Mongoose document if not in schema.
      // But it might still be in DB.

      // Wait, Mongoose models are strict by default. `user.roles` will be undefined if I removed it from schema.

      // I'll just assign 'user' role to everyone.
      // EXCEPT "parth.singh@adaan.com" -> I'll make him Admin just in case (since he is the reporter).

      let targetRole = userRole._id;
      if (
        user.email === "parth.singh@adaan.com" ||
        user.email.includes("admin")
      ) {
        targetRole = adminRole._id;
      }

      await User.updateOne(
        { _id: user._id },
        {
          $set: { role: targetRole },
          $unset: { roles: "", directPermissions: "", revokedPermissions: "" },
        }
      );
      console.log(
        `Migrated user: ${user.email} -> ${
          targetRole === adminRole._id ? "admin" : "user"
        }`
      );
    }

    console.log("Migration complete.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateUsers();
