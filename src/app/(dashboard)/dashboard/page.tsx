import { getFriendsByUserId } from "@/helpers/getFriendsByuserId";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const friendWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      try {
        // Fetch the last message from Redis
        const [RawlastMessage] =
          (await fetchRedis(
            "zrange",
            `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
            -1,
            -1
          )) as string[] || [];

        if (!RawlastMessage || !RawlastMessage.trim()) {
          // If no message exists, return friend with lastMessage set to null
          return { ...friend, lastMessage: null };
        }

        // Parse the last message JSON
        const lastMessage = JSON.parse(RawlastMessage) as Message;

        return { ...friend, lastMessage };
      } catch (error) {
        console.error(
          `Error fetching or parsing last message for friend ${friend.id}:`,
          error
        );
        return { ...friend, lastMessage: null }; // Handle errors gracefully
      }
    })
  );

  // Render the dashboard UI
  return (
    <div className="container py-12">
      <h1 className="font-bold text-5xl mb-8 text-[--text-primary]">
        Recent chats
      </h1>
      {friendWithLastMessage.length === 0 ||
        friendWithLastMessage.every((friend) => !friend.lastMessage) ? ( // Show fallback if no chats are available
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        friendWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            className="relative bg-zinc-100 dark:bg-[--bg-input] p-3 rounded-md"
          >
            <div className="absolute right-4 inset-y-0 flex items-center">
              <ChevronRight className="h-7 w-7 text-zinc-400" />
            </div>

            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className="relative sm:flex"
            >
              <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-6 w-6">
                  <Image
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold dark:text-white">{friend.name}</h4>
                <p className="mt-1 max-w-md text-[--text-primary]">
                  <span className="text--[--text-primary]">
                    {friend.lastMessage?.senderId === session.user.id
                      ? "You: "
                      : ""}
                  </span>
                  {friend.lastMessage?.text || "No messages yet"}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
