import { SetStateAction, createContext } from "react";

export type Chat = {
  sessionId: string;
  title: string;
  updatedAt: Date;
};

interface ChatContextType {
  chats: Chat[];
  loading: boolean;
  setChats: React.Dispatch<SetStateAction<Chat[]>>;
  addOrUpdateChat: (chat: Chat) => void;
  refreshChats: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);
export default ChatContext;