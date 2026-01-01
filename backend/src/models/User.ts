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
      enum: ["PATIENT", "DOCTOR", "ADMIN"],
      required: true,
    },

    specialty: { type: String, trim: true }, // requis côté controller si role=DOCTOR
    consultationFee: { type: Number, min: 0 },
    gender: { type: String, enum: ["MALE", "FEMALE"] },
    city: { type: String, trim: true },
    address: { type: String, trim: true },
    lat: { type: Number },
    lng: { type: Number },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
