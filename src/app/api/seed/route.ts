import dbConnect from "@/lib/database/dbConnection";
import { Vendor } from "@/lib/database/models/Vendor";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const vendors = await Vendor.find();
    return NextResponse.json(vendors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}
