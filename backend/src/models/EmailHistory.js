import mongoose from "mongoose";

const emailHistorySchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    recipients: [
      {
        email: String,
        status: String,
        error: String,
      },
    ],
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.EmailHistory || mongoose.model("EmailHistory", emailHistorySchema);
