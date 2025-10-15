import { authOptions } from '@/lib/auth';
import { getConversationHistory } from '@/lib/database/chatHistory';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const userId = await getServerSession(authOptions)

    const { sessionId } = await params;
    
    const history = await getConversationHistory(sessionId, userId?.user.id as string);
    return Response.json(history);
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}