import express from "express";

import {
  adminResetUserPassword,
  createMultipleUsers,
  deleteUser,
  forgotPassword,
  getAllUsers,
  resetPassword,
  signIn,
  signUp,
  updateUser,
  getUserPermissions,
} from "../controllers/auth.controller.js";
import { verifyUser } from "../middlewares/verifyUser.js";
import authorize from "../middlewares/authorize.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/forgot-password", forgotPassword);

router.get("/all-users", verifyUser, authorize("user:manage"), getAllUsers);
router.put(
  "/update-user/:id",
  verifyUser,
  authorize("user:manage"),
  updateUser
);
router.delete(
  "/delete-user/:id",
  verifyUser,
  authorize("user:manage"),
  deleteUser
);

router.get(
  "/users/:id/permissions",
  verifyUser,
  authorize("user:manage"),
  getUserPermissions
);

router.post("/signin", signIn);

router.post(
  "/create-multiple-users",
  verifyUser,
  authorize("user:manage"),
  createMultipleUsers
);

router.put(
  "/reset-password/user/:id",
  verifyUser,
  authorize("user:manage"),
  adminResetUserPassword
);
router.post("/reset-password/:token", resetPassword);

export default router;
