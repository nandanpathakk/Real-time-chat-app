import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import SignOutButton from "@/components/SignOutButton"
import FriendRequestSiderBarOption from "@/components/FriendRequestSiderBarOption"
import { fetchRedis } from "@/helpers/redis"
import { getFriendsByUserId } from "@/helpers/getFriendsByuserId"
import SideBarChatList from "@/components/SideBarChatList"
import MobileChatLayout from "@/components/MobileChatLayout"
import { SideBarOption } from "@/types/typings"
import { Icons } from "@/components/icons"
import { IoArrowBackSharp } from "react-icons/io5";


interface LayoutProps {
    children: ReactNode
}

const sideBarOptions: SideBarOption[] = [
    {
        id: 1,
        name: 'Add friend',
        href: '/dashboard/add',
        Icon: 'UserPlus'
    }
]


const Layout = async ({ children }: LayoutProps) => {

    const session = await getServerSession(authOptions);

    if (!session) {
        notFound()
    }  // extra layer after middleware to confirm that the user is authorized for this path


    const friends = await getFriendsByUserId(session.user.id)

    const unseenRequestCount = (
        (await fetchRedis(
            'smembers',
            `user:${session.user.id}:incoming_friend_requests`
        )) as User[]
    ).length   //number of requests of the current user logedin

    return <div className="w-full flex h-screen ">

        <div className="md:hidden">
            <MobileChatLayout friends={friends} session={session} sidebarOptions={sideBarOptions} unseenRequestCount={unseenRequestCount} />
        </div>

        <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <Link href='/dashboard' className="flex h-16 shrink-0 items-center">
                {/* <Icons.Logo className="h-6 w-auto text-indigo-600" /> */}
                <IoArrowBackSharp className="h-4 w-auto" />
            </Link>


            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-5">
                    <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400">
                            overview
                        </div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {
                                sideBarOptions.map((option) => {
                                    const Icon = Icons[option.Icon]
                                    return (
                                        <li key={option.id}>
                                            <Link href={option.href}
                                                className="text-gray-700 hover:text-black hover:bg-gray-100 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold">
                                                <span className="text-gray-400 border-gray-200 group-hover:border-black group-hover:text-black flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] bg-white">
                                                    <Icon className="h-4 w-4 " />
                                                </span>
                                                <span className="truncate">
                                                    {option.name}
                                                </span>
                                            </Link>
                                        </li>
                                    )
                                })
                            }

                            <li>
                                <FriendRequestSiderBarOption initialUnseenRequestCount={unseenRequestCount} sessionId={session.user.id} />
                            </li>
                        </ul>
                    </li>

                    <li>
                        {
                            friends.length > 0 ? (
                                <div className="text-xs font-semibold leading-6 text-gray-400">
                                    Your chats
                                </div>
                            ) : null
                        }
                    </li>
                    <li>
                        <SideBarChatList friends={friends} sessionId={session.user.id} />
                    </li>



                    <li className="-mx-6 mt-auto flex items-center">
                        <div className="flex flex-1 items-center gap-x-4 px-5 py-3 text-sm font-semibold leading-6 text-gray-900">
                            <div className="relative h-8 w-8 bg-gray-50">
                                <Image
                                    fill
                                    referrerPolicy="no-referrer"  // imges from google auth dont show without this option sometimes
                                    className="rounded-full"
                                    src={session.user.image || ""}
                                    alt="Your profile picture"
                                />
                            </div>
                            <span className="sr-only">Your Profile</span>  {/* aria-hidden --->  This is not for the screen to show but for screen readers/ for visually impaired persons */}
                            <div className="flex flex-col">
                                <span aria-hidden='true'>{session.user.name}</span> {/* same as above-- not showing them their names in screen reading */}
                                <span className="text-xs text-zinc-400" aria-hidden='true'>{session.user.email}</span>
                            </div>
                        </div>

                        <SignOutButton className='h-full aspect-square' />

                    </li>
                </ul>
            </nav>
        </div>
        <aside className="max-h-screen container py-16 md:py-12 pb-12 w-full ">
            {children}
        </aside>
    </div>
}

export default Layout;