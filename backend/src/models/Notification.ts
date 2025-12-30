import mongoose, { InferSchemaType } from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type NotificationDoc = InferSchemaType<typeof notificationSchema>;

export default mongoose.model("Notification", notificationSchema);
