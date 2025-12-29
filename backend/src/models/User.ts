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
    wilaya: { type: String, trim: true },
    city: { type: String, trim: true },
    address: { type: String, trim: true },
    lat: { type: Number },
    lng: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
