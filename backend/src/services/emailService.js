import { createTransporter } from "../config/emailConfig.js";
import EmailHistory from "../models/EmailHistory.js";

export const sendBulkEmails = async (emailList, subject, message) => {
  const transporter = createTransporter();
  const results = [];

  for (const email of emailList) {
    const namePart = email.split("@")[0];
    const name = namePart
      .split(/[._-]/)
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

    try {
      await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || "Bulk Sender"}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject.replace(/{{name}}/g, name),
        text: message
          .replace(/{{name}}/g, name)
          .replace(/{{email}}/g, email),
      });

      results.push({ email, status: "Sent" });

    } catch (error) {
      console.log("email error",error);
      
      results.push({
        email,
        status: "Failed",
        error: error.message,
      });
    }
  }

  // ✅ SAVE FULL CAMPAIGN HISTORY
  await EmailHistory.create({
    subject,
    message,
    recipients: results,
  });

  return results;
};
