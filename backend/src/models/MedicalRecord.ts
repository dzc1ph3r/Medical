import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    diagnosis: String,
    notes: String,
    file: {
      originalName: String,
      storedName: String,
      mimeType: String,
      size: Number,
      path: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("MedicalRecord", recordSchema);
