import express from "express";
import {
  createPermission,
  listPermissions,
  deletePermission,
  updatePermission,
} from "../controllers/permission.controller.js";
import { authorize } from "../middlewares/permission.middlewares.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/", verifyUser, authorize("permission.create"), createPermission);
router.get("/", verifyUser, authorize("permission.read"), listPermissions);
router.put(
  "/:id",
  verifyUser,
  authorize("permission.update"),
  updatePermission
);
router.delete(
  "/:id",
  verifyUser,
  authorize("permission.delete"),
  deletePermission
);

export default router;
