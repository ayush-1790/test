import express from "express";
import {
  createRole,
  listRoles,
  updateRole,
  deleteRole,
} from "../controllers/role.controller.js";
import { authorize } from "../middlewares/permission.middlewares.js";

import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/", verifyUser, authorize("role.create"), createRole);
router.get("/", verifyUser, authorize("role.read"), listRoles);
router.put("/:id", verifyUser, authorize("role.update"), updateRole);
router.delete("/:id", verifyUser, authorize("role.delete"), deleteRole);

export default router;
