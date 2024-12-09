'use client'
import Button from "@/components/ui/Button"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import DotPattern from "@/components/magicui/dot-pattern"
import { cn } from "@/lib/utils"
import { IoClose } from "react-icons/io5";


const Login = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false)

    async function loginWithGoogle() {
        setIsLoading(true)
        try {
            await signIn('google')
        } catch (error) {
            toast.error("Something went wrong with your login.")
        } finally {
            setIsLoading(false)
        }
    }

    function handleOpenVideo() {
        setIsVideoOpen(true);
    }

    function handleCloseVideo() {
        setIsVideoOpen(false);
    }

    return <div className="flex md:flex-row flex-col min-h-[100dvh]">

        <div className="flex-[1.5] bg-[#925FE2] flex flex-col bg-[url('/images/object.svg')] bg-center px-10 md:px-20 w-full">
            <div className="flex flex-col pt-20 md:pt-24 space-y-2">
                <p className="text-5xl sm:text-5xl text-white poppins-bold">Welcome</p>
                <TypingAnimation className="flex text-5xl sm:text-6xl text-white poppins-regular"
                    text="to the ChatBox."
                    duration={100}
                />
                {/* <p className="text-4xl sm:text-6xl text-white poppins-regular">to the ChatBox</p> */}
                <p className="text-white poppins-regular">Create account to get started</p>
            </div>
            <div className="md:flex hidden justify-end pr-20">
                <Image
                    src="/images/hero-image.png"
                    alt="hero-login-image-icon"
                    width={450}
                    height={450}
                />
            </div>
        </div>

        <div className="relative overflow-hidden flex-1 bg-[rgb(28,29,33)] flex flex-col justify-center items-center space-y-5">
            <div className="flex flex-col items-center z-10 ">
                <h1 className="text-gray-300 text-3xl poppins-bold">Login</h1>
                <p className="text-gray-400 poppins-regular ">Secure authentication using Google</p>

            </div>
            <Button isLoading={isLoading} type="button"
                className="max-w-mg mx-auto bg-white text-black hover:bg-gray-300 px-20 z-10"
                onClick={loginWithGoogle}>
                {isLoading ? null : <Image src="/icon/google-icon.svg" alt="google-icon" width={16} height={16} />
                }
                <span className="pl-2 poppins-regular">
                    Google
                </span>
            </Button>
            {/* &apos it ' in the don't as when when directly was giving an lint error   */}
            {/* <div className="absolute bottom-4 text-gray-400 poppins-regular opacity-50">Don&apos;t want to login? */}
            <div className="text-sm absolute bottom-2 text-gray-400 poppins-regular opacity-50">{`Don't want to login?`} 
                <span 
                onClick={handleOpenVideo}   
                className="text-blue-300 cursor-pointer"> See how ChatBox works</span>
            </div>
            <DotPattern className={cn("[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",)} />
        </div>

        {/* video modal */}
        {isVideoOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-2xl">
                        <button
                            onClick={handleCloseVideo}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 flex"
                        >
                            <IoClose className="w-5 h-5" />
                        </button>
                        <div className="w-full">
                            <h2 className="text-xl font-bold poppins-bold mb-4">
                                See How ChatBox Works
                            </h2>
                            <video
                                className="w-full rounded-md"
                                controls
                                poster="/images/demo_thumbnail.png"
                            >
                                <source src="/videos/demo.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            )}
    </div>
}
export default Login;