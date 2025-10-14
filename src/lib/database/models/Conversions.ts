// models/conversation.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

/**
 * Part (subdocument) interface
 */
export interface IPart {
  type: string; // e.g. "text" | "tool" | "reasoning" | "file"
  text?: string;
  state?: string;
  toolCallId?: string;
  input?: any;
  output?: any;
  callProviderMetadata?: any;
}

/**
 * Message (subdocument) interface
 * Note: subdocuments are stored inside Conversation.messages
 */
export interface IMessage {
  id: string;
  type?: string;
  role: 'user' | 'assistant' | 'system';
  parts: IPart[];
  createdAt?: Date;
}

/**
 * Conversation document interface (top-level model)
 * Extends mongoose.Document so you get _id, save(), etc.
 */
export interface IConversation extends Document {
  type?: string;
  sessionId: string;
  userId: string;
  title?: string;
  messages: Types.DocumentArray<IMessage & Document>; // typed subdocument array
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

/* ------------------ SCHEMAS ------------------ */

// Part schema - matches your actual message structure
const PartSchema = new Schema<IPart>(
  {
    type: { type: String, required: true },
    text: String,
    state: String,
    toolCallId: String,
    input: Schema.Types.Mixed,
    output: Schema.Types.Mixed,
    callProviderMetadata: Schema.Types.Mixed,
  },
  { _id: false }
);

// Message schema - matches your actual structure
const MessageSchema = new Schema<IMessage>(
  {
    id: { type: String, required: true },
    type: { type: String }, // optional
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    parts: { type: [PartSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Conversation schema
const ConversationSchema = new Schema<IConversation>(
  {
    type: { type: String, default: 'conversation' },
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New conversation',
    },
    messages: { type: [MessageSchema], default: [] },
    metadata: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

// Compound indexes
ConversationSchema.index({ userId: 1, updatedAt: -1 });
ConversationSchema.index({ sessionId: 1, userId: 1 });

/**
 * Export typed model
 *
 * Note: the cast on mongoose.models.Conversation ensures TypeScript knows the model type
 */
export const Conversation =
  (mongoose.models.Conversation as mongoose.Model<IConversation>) ||
  mongoose.model<IConversation>('Conversation', ConversationSchema);
