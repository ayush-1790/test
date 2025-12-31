import express from "express";
import multer from "multer";
import emailController from "../controllers/email.controller.js";
import { verifyUser } from "../middlewares/verifyUser.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", emailController.renderForm);
router.get("/history", emailController.renderHistory);
router.post(
  "/send-emails",
  upload.single("emailCsv"),
  emailController.handleSendEmails
);


export default router;
