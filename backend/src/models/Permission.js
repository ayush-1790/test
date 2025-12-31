import mongoose from "mongoose";
const PermissionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: { type: String },
    module: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Permission || mongoose.model("Permission", PermissionSchema);
