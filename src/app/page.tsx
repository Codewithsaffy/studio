import { ChatView } from "@/components/grok/ChatView";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session?.user.id);
  return <ChatView />;
}
