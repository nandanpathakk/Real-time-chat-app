'use client'
import Button from "@/components/ui/Button"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import DotPattern from "@/components/magicui/dot-pattern"
import { cn } from "@/lib/utils"


const Login = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false)

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

    return <div className="flex md:flex-row flex-col min-h-[100dvh]">

        <div className="flex-[1.5] bg-[#925FE2] flex flex-col bg-[url('/images/object.svg')] bg-center px-10 md:px-20 w-full">
            <div className="flex flex-col pt-20 md:pt-24 space-y-2">
                <p className="text-5xl sm:text-5xl text-white poppins-bold">Welcome</p>
                <TypingAnimation className="flex text-5xl sm:text-6xl text-white poppins-regular"
                    text="to the ChatBox."
                    duration={100}
                />
                {/* <p className="text-4xl sm:text-6xl text-white poppins-regular">to the ChatBox</p> */}
                <p className="text-white poppins-regular">Login to access you account</p>
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
                <p className="text-gray-400 poppins-regular">Secure authentication using Google</p>
                
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
            <DotPattern className={cn("[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",)}/>
        </div>
    </div>
}
export default Login;