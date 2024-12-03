'use client'
import { Transition, Dialog } from '@headlessui/react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FC, Fragment, useEffect, useState } from 'react'
import { Icons } from './icons'
import SignOutButton from './SignOutButton'
import Button from './ui/Button'
import FriendRequestSiderBarOption from './FriendRequestSiderBarOption'
import SideBarChatList from './SideBarChatList'
import { Session } from 'next-auth'
import { usePathname } from 'next/navigation'
import { DialogPanel, TransitionChild } from '@headlessui/react'
import { SideBarOption } from '@/types/typings'
import { IoArrowBackSharp } from "react-icons/io5";
import ThemeToggle from "@/components/ThemeToggle"


interface MobileChatLayoutProps {
  friends: User[]
  session: Session
  sidebarOptions: SideBarOption[]
  unseenRequestCount: number
}

const MobileChatLayout: FC<MobileChatLayoutProps> = ({ friends, session, unseenRequestCount, sidebarOptions }) => {
  const [open, setOpen] = useState<boolean>(false)

  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className='fixed bg-[--bg-primary] top-0 inset-x-0 py-2 px-4'>
      <div className='w-full flex justify-between items-center'>
        <div className='flex items-center justify-center space-x-5'>
          <div>
            <Link
              href='/dashboard'
              className="dark:hover:bg-black" >
              {/* <Icons.Logo className='h-6 w-auto text-indigo-600' /> */}
              <IoArrowBackSharp className="h-4 w-auto dark:text-white text-black" />
            </Link>
          </div>

          <div>
            <ThemeToggle />
          </div>

        </div>
        <Button onClick={() => setOpen(true)} className='bg-[--bg-primary] hover:bg-gray-200 dark:hover:bg-[--bg-secondary]'>
          <Menu className='h-6 w-6 text-[--text-primary]' />
        </Button>

      </div>
      <Transition show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setOpen}>
          <div className='fixed inset-0' />

          <div className='fixed inset-0 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10'>
                <TransitionChild
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500 sm:duration-700'
                  enterFrom='-translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500 sm:duration-700'
                  leaveFrom='translate-x-0'
                  leaveTo='-translate-x-full'>
                  <DialogPanel className='pointer-events-auto w-screen max-w-md'>
                    <div className='flex h-full flex-col overflow-hidden shadow-xl bg-[--bg-secondary]'>
                      <div className='px-4 sm:px-6'>
                        <div className='flex justify-end'>
                          {/* <DialogTitle className='text-base font-semibold leading-6 text-[--text-primary] poppins-bold'>
                            Dashboard
                          </DialogTitle> */}
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className='rounded-md text-gray-400 hover:text-gray-500 mt-6'
                              onClick={() => setOpen(false)}>
                              <span className='sr-only'>Close panel</span>
                              <X className='h-6 w-6' aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                        {/* Content */}


                        <nav className='flex flex-1 flex-col'>
                          <ul
                            role='list'
                            className='flex flex-1 flex-col gap-y-7'>

                            <li>
                              {/* <div className='text-xs font-semibold leading-6 text-gray-400'>
                                Overview
                              </div> */}
                              <ul role='list' className='-mx-2 space-y-1'>
                                {sidebarOptions.map((option) => {
                                  const Icon = Icons[option.Icon]
                                  return (
                                    <li key={option.name}>
                                      <Link
                                        href={option.href}
                                        className="text-[--text-primary] hover:bg-gray-200 dark:hover:bg-black group flex gap-3 rounded-md p-2 text-sm leading-6 poppins-semibold tracking-wide">
                                        <span className="text-[--text-primary] dark:group-hover:text-[--text-primary] flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] bg-[--bg-secondary] group-hover:bg-gray-200 dark:group-hover:bg-black">
                                          <Icon className='h-4 w-4' />
                                        </span>
                                        <span className='truncate'>
                                          {option.name}
                                        </span>
                                      </Link>
                                    </li>
                                  )
                                })}
                                <li>
                                  <FriendRequestSiderBarOption
                                    initialUnseenRequestCount={
                                      unseenRequestCount
                                    }
                                    sessionId={session.user.id}
                                  />
                                </li>
                              </ul>
                            </li>

                            <li>

                              {friends.length > 0 ? (
                                <div className='text-xs poppins-medium tracking-wide leading-6 text-gray-400'>
                                  Your chats
                                </div>
                              ) : null}

                              <SideBarChatList
                                friends={friends}
                                sessionId={session.user.id}
                              />
                            </li>

                            <li className='-ml-6 mt-auto flex items-center'>
                              <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                                <div className='relative h-8 w-8'>
                                  <Image
                                    fill
                                    referrerPolicy='no-referrer'
                                    className='rounded-full'
                                    src={session.user.image || ''}
                                    alt='Your profile picture'
                                  />
                                </div>

                                <span className='sr-only'>Your profile</span>
                                <div className='flex flex-col'>
                                  <span aria-hidden='true' className='poppins-bold text-[--text-primary]'>
                                    {session.user.name}
                                  </span>
                                  <span
                                    className='text-xs text-[--text-secondary] poppins-regular'
                                    aria-hidden='true'>
                                    {session.user.email}
                                  </span>
                                </div>
                              </div>
                              <SignOutButton className='h-full aspect-square text-[--text-primary] hover:text-[--text-primary] dark:hover:bg-black' />
                            </li>
                          </ul>
                        </nav>

                        {/* content end */}
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default MobileChatLayout