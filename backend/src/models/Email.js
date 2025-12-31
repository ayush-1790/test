import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    emailAddress: {
      type: String,
      required: [true, "Email address is required."],
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Please provide a valid email address",
      ],
    },

    name: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["subscribed", "unsubscribed", "bounced", "complained"],
      default: "subscribed",
      index: true,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    source: {
      type: String,
      enum: ["manual", "csv-upload", "form-signup"],
      default: "manual",
    },

    lastSentAt: {
      type: Date,
    },

    // Optional analytics fields
    bounceReason: {
      type: String,
    },

    unsubscribedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

emailSchema.index({ status: 1, lastSentAt: -1 });

export default mongoose.models.Email || mongoose.model("Email", emailSchema);
