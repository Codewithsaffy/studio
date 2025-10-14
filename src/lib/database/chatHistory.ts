import dbConnect from "./dbConnection";
import { Conversation } from "./models/Conversions";

export interface MessageWithParts {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: Array<{
    type: string;
    text?: string;
    state?: string;
    toolCallId?: string;
    input?: any;
    output?: any;
    callProviderMetadata?: any;
  }>;
}

/**
 * Save entire conversation history
 */
export async function saveConversation({
  sessionId,
  userId,
  messages,
  metadata,
}: {
  sessionId: string;
  userId: string;
  messages: MessageWithParts[];
  metadata?: Record<string, any>;
}) {
  await dbConnect();

  try {
    // Generate title from first user message if not set
    let title = 'New conversation';
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (firstUserMessage) {
      const textPart = firstUserMessage.parts.find(p => p.type === 'text');
      if (textPart?.text) {
        title = textPart.text.substring(0, 50) + 
          (textPart.text.length > 50 ? '...' : '');
      }
    }

    // Upsert conversation
    const conversation = await Conversation.findOneAndUpdate(
      { sessionId, userId },
      {
        $set: {
          messages,
          title,
          updatedAt: new Date(),
          ...(metadata && { metadata }),
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return conversation;
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw error;
  }
}

/**
 * Append single message to existing conversation
 */
export async function appendMessage({
  sessionId,
  userId,
  message,
}: {
  sessionId: string;
  userId: string;
  message: MessageWithParts;
}) {
  await dbConnect();

  try {
    const conversation = await Conversation.findOneAndUpdate(
      { sessionId, userId },
      {
        $push: { messages: message },
        $set: { updatedAt: new Date() },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    // Auto-generate title from first user message
    if (conversation.title === 'New conversation' && message.role === 'user') {
      const textPart = message.parts.find(p => p.type === 'text');
      if (textPart?.text) {
        const title = textPart.text.substring(0, 50) + 
          (textPart.text.length > 50 ? '...' : '');
        await Conversation.updateOne(
          { sessionId, userId },
          { $set: { title } }
        );
      }
    }

    return conversation;
  } catch (error) {
    console.error('Error appending message:', error);
    throw error;
  }
}

/**
 * Get conversation history
 */
export async function getConversationHistory(
  sessionId: string,
  userId: string
) {
  await dbConnect();
  try {
    const conversation = await Conversation.findOne({
      sessionId,
      userId
    }).lean();

    if (!conversation) {
      return {
        messages: [],
        metadata: {},
        title: 'New conversation',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return {
      messages: conversation.messages || [],
      metadata: conversation.metadata || {},
      title: conversation.title || 'New conversation',
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
}

/**
 * Get all user conversations (for sidebar)
 */
export async function getUserConversations(userId: string) {
  await dbConnect();
  try {
    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .select('sessionId title updatedAt messages metadata')
      .limit(50)
      .lean();

    return conversations.map((conv) => {
      const lastMessage = conv.messages?.[conv.messages.length - 1];
      let preview = '';
      
      if (lastMessage) {
        const textPart = lastMessage.parts?.find(p => p.type === 'text');
        if (textPart?.text) {
          // Remove [PRODUCTS] tags and clean up
          preview = textPart.text
            .replace(/\[PRODUCTS\]\s*:?\s*\[[^\]]+\]/gi, '')
            .trim()
            .substring(0, 100);
        }
      }

      return {
        sessionId: conv.sessionId,
        title: conv.title,
        updatedAt: conv.updatedAt,
        messageCount: conv.messages?.length || 0,
        preview,
        metadata: conv.metadata,
      };
    });
  } catch (error) {
    console.error('Error getting user conversations:', error);
    throw error;
  }
}
