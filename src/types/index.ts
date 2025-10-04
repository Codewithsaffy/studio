export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: string; // ISO 8601 timestamp
  messages: Message[];

};
