import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { fetchRedis } from "@/helpers/redis";
import { maessageArrayValidator } from "@/lib/validations/message";
import Image from "next/image";
import Messages from "@/components/Messages";
import ChatInput from "@/components/ChatInput";

interface pageProps {
    params: {
        chatId: string
    }
}

async function getChatMessages(chatId: string) {
    try {
        const messageResults: string[] = await fetchRedis(
            'zrange', 
            `chat:${chatId}:messages`,
            0,
            -1                           // meaning fetching every message
        ) 

        const dbMessage = messageResults.map((message) => JSON.parse(message) as Message)   // parsing to convert it from json string to javascript object

        const reverseDbMessages = dbMessage.reverse()

        const messages = maessageArrayValidator.parse(reverseDbMessages)     // checking or converting to the desired format

        return messages;

    } catch (error){
        notFound()
    }
} 

const page = async ({ params }: pageProps) => {

    const { chatId } = params;

    const session = await getServerSession(authOptions);
    if(!session) notFound();

    const { user } = session;

    const [userId1, userId2] = chatId.split('--')    // one of the id should be of the current user to view the chat

    if(user.id !== userId1 && user.id !== userId2) {  
        notFound()
    }

    const chatPartnerId = user.id === userId1 ? (userId2) : (userId1)
    const chatPartnerRaw = await fetchRedis('get', `user:${chatPartnerId}`) as string 
    const chatPartner = JSON.parse(chatPartnerRaw) as User
    const initialMessages = await getChatMessages(chatId)
    console.log(chatPartner.image)

    return <div className="flex-1 justify-between flex flex-col h-full m-h-[calc(100dvh - 6rem)]">
        <div className="flex sm:items-center justify-between pb-3 border-b border-gray-200 dark:border-[--text-secondary] px-10">
            <div className="relative flex items-center space-x-4">
                <div className="relative">
                    <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                        <Image 
                        fill
                        referrerPolicy="no-referrer"
                        src={chatPartner.image}
                        alt={`${chatPartner.name} profile picture`}
                        className="rounded-full" />
                    </div>
                </div>
                <div className="flex flex-col leading-tight ">
                    <div className="text-xl felx items-center">
                        <span className="text-gray-700 dark:text-[--text-primary] mr-3 font-semibold poppins-semibold">
                            {chatPartner.name}
                        </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-[--text-secondary] poppins-regular">
                        {chatPartner.email}
                    </span>
                </div>
            </div>
        </div>
        <Messages chatId={chatId} initialMessages={initialMessages} sessionId={session.user.id} sessionImg={session.user.image} chatPartner={chatPartner} />
        <ChatInput chatPartner={chatPartner} chatId={chatId} />
    </div>
}
export default page;