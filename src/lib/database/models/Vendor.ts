import mongoose, { Schema, models } from "mongoose";

const VendorSchema = new Schema({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  location: String,
  city: String,
  pricePerHead: Number,
  packagePrice: Number,
  rating: Number,
  image: String,
  phone: String,
  bookedDates: [String],
  features: [String],
  capacity: String,
});

export const Vendor = models.Vendor || mongoose.model("Vendor", VendorSchema);
