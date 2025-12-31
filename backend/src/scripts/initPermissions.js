import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Permission from "../models/Permission.js";
import Role from "../models/Role.js";
import User from "../models/User.js";

dotenv.config();

const permissionsList = [
  { key: "blog:create", description: "Create a new blog", module: "Blog" },
  { key: "blog:read", description: "Read blogs", module: "Blog" },
  { key: "blog:update", description: "Update a blog", module: "Blog" },
  { key: "blog:delete", description: "Delete a blog", module: "Blog" },

  { key: "user:read", description: "Read users", module: "User" },
  { key: "user:update", description: "Update users", module: "User" },
  { key: "user:delete", description: "Delete users", module: "User" },
];

const initPermissions = async () => {
  try {
    await connectDB();

    console.log("Seeding Permissions...");
    const permissionDocs = [];
    for (const perm of permissionsList) {
      const p = await Permission.findOneAndUpdate({ key: perm.key }, perm, {
        upsert: true,
        new: true,
      });
      permissionDocs.push(p);
    }

    const allPermissionIds = permissionDocs.map((p) => p._id);
    const readPermissionIds = permissionDocs
      .filter((p) => p.key.includes(":read"))
      .map((p) => p._id);

    console.log("Seeding Roles...");

    // Admin Role - All Permissions
    await Role.findOneAndUpdate(
      { name: "admin" },
      {
        name: "admin",
        description: "Administrator with full access",
        permissions: allPermissionIds,
        isActive: true,
      },
      { upsert: true }
    );

    // Manager Role - Read Only (as per request)
    await Role.findOneAndUpdate(
      { name: "manager" },
      {
        name: "manager",
        description: "Manager with read access",
        permissions: readPermissionIds,
        isActive: true,
      },
      { upsert: true }
    );

    // User Role - Read Only
    await Role.findOneAndUpdate(
      { name: "user" },
      {
        name: "user",
        description: "Standard user",
        permissions: readPermissionIds,
        isActive: true,
      },
      { upsert: true }
    );

    console.log("Permissions and Roles synced successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding permissions:", error);
    process.exit(1);
  }
};

initPermissions();
