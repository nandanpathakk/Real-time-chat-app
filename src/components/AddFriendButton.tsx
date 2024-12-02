'use client'
import { addFriendvalidator } from "@/lib/validations/add-friend";
import Button from "./ui/Button";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import zod  from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// converting/overriding FormData as addFriendvalidator custom typescritp type
type FormData = zod.infer<typeof addFriendvalidator>

const AddFriendButton = () => {

    const [showSuccessStatus, setShowSuccessStatus] = useState<boolean>(false)

    // shows and handle what exactly is wroing with the input after zod validation
    
    const { register, handleSubmit, setError, formState:{ errors } } = useForm<FormData>({
        resolver: zodResolver(addFriendvalidator)
    })

    const addFriend = async (email: string) => {
        try {
            const validatedEmail = addFriendvalidator.parse({ email });

            await axios.post("/api/friends/add", {
                email: validatedEmail,
            })
            setShowSuccessStatus(true)

        }catch(error) {
            if(error instanceof zod.ZodError) {
                setError('email', { message: error.message})  // we know error.message eist as it a zod.zodError type error
                return 
            }

            if(error instanceof AxiosError) {
                setError('email', { message: error.response?.data})
                return
            }

            // message for an unexpected error which is not from zod or axios
            setError('email', {message: 'Something went wrong'})
        }
    }

    const onSubmit = (data: FormData) => {
        addFriend(data.email)
    }

    return <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
        <label 
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-[--text-secondary]">
        Add friend by E-mail
        </label>
        <div className="mt-2 flex gap-4">
            <input
            {...register('email')} 
            type="text" className="block w-full rounded-md border-0 py-1.5 bg-[--bg-input] text-gray-900 dark:text-white shadow-sm placeholder:text-gray-400 dark:placeholder:text-[--text-secondary] focus:ring-1 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-[--text-secondary] sm:text-sm sm:leading-6"
            placeholder="you@example.com" />
            <Button className="dark:bg-white dark:text-black">Add</Button>
        </div>
        <div className="'mt-1 text-sm text-red-600">{errors.email?.message}</div>
        {showSuccessStatus ? (
            <div className="'mt-1 text-sm text-green-600">Friend Request Sent</div>
        ) : null }
    </form>
}
export default AddFriendButton;