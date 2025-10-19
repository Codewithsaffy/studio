import { authOptions } from "@/lib/auth";
import { appendMessage, getUserConversations } from "@/lib/database/chatHistory";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await getServerSession(authOptions)
  if (!user?.user) {
    console.log("SESSION NOT FOUND")
    return NextResponse.json({message:"SESSION NOT FOUND"})
  }
  const userId = user?.user.id as string

  const { sessionId, message } = await req.json();

  const data = await appendMessage({sessionId, userId, message});
  return NextResponse.json({ data });
}




export async function GET(req: NextRequest) {
  try {
    // Get userId from your auth system
    const user =await getServerSession(authOptions) // Replace with actual auth
    if (!user?.user) {
      console.log("USER NOT FOUND IN GET CONVERSAITNOS")
    }
    const conversations = await getUserConversations(user?.user.id as string);
    return Response.json({ conversations });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}