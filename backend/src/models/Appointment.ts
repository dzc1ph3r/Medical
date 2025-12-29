import mongoose, { InferSchemaType } from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "CANCELLED"],
      default: "PENDING",
      required: true,
    },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

export type AppointmentDoc = InferSchemaType<typeof appointmentSchema>;

export default mongoose.model("Appointment", appointmentSchema);
