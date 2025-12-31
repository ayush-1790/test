import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "../controllers/blog.controller.js";
import { verifyUser } from "../middlewares/verifyUser.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

router.post("/", verifyUser, authorize("blog:create"), createBlog);
router.put("/:id", verifyUser, authorize("blog:update"), updateBlog);
router.delete("/:id", verifyUser, authorize("blog:delete"), deleteBlog);

export default router;
