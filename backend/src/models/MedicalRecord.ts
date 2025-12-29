import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  diagnosis: String,
  notes: String
}, { timestamps: true });

export default mongoose.model("MedicalRecord", recordSchema);
