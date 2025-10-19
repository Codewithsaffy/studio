import dbConnect from "@/lib/database/dbConnection";
import { Conversation } from "@/lib/database/models/Conversions";
import User from "@/lib/database/models/User";
import { Vendor } from "@/lib/database/models/Vendor";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const data = await User.find({})

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch vendors" },
      { status: 500 }
    );
  }
}
