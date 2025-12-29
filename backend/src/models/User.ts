import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["PATIENT", "DOCTOR"],
      required: true,
    },

    specialty: { type: String, trim: true }, // requis côté controller si role=DOCTOR
    city: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
