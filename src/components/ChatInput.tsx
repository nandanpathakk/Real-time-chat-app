'use client'
import { FC, useRef, useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import Button from "./ui/Button";
import axios from "axios";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import { EmojiClickData } from "emoji-picker-react";
import { VscSend } from "react-icons/vsc";
import { MdOutlineEmojiEmotions } from "react-icons/md";

interface ChatInputProps {
    chatPartner: User
    chatId: string
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    const [input, setInput] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showPicker, setShowPicker] = useState(false)

    const sendMessage = async () => {
        if (!input) return              // for senerio where no message is wittern in input box and user is trying to send message
        setIsLoading(true)
        try {
            await axios.post("/api/message/send", {
                text: input,
                chatId
            })
            setInput("")
            textAreaRef.current?.focus()   // to make the input again into foucs after sending a message
        } catch (error) {
            toast.error("Something Went wrong. Please Send again")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEmoji = (emojiData: EmojiClickData) => {
        setInput((prev) => prev + emojiData.emoji);
        console.log("type is " + typeof (emojiData))
        setShowPicker(false)
    }


    return <div className="px-10 pt-4 mb-4 sm:mb-0">
        <div className="relative p-2 bg-[--bg-input] rounded-full shadow-sm focus-within:ring-1 focus-within:ring-gray-500 dark:focus-within:ring-[--text-secondary]">
            <TextareaAutosize ref={textAreaRef} onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                }
            }}
                rows={1}
                value={input}
                onChange={(e) => { setInput(e.target.value) }}
                placeholder={`Message ${chatPartner.name}`}
                className="block w-full resize-none border-0 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6" />

            <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                <button
                    onClick={() => setShowPicker((prev) => !prev)}
                    className="text-gray-600 hover:text-gray-800"
                ><MdOutlineEmojiEmotions className="w-6 h-auto text-[#171717] dark:text-gray-400 cursor-pointer" />
                </button>

                {showPicker && (
                    <div
                        className="absolute bottom-full right-0 mb-2 z-50 bg-white shadow-lg rounded-lg"
                    >
                        <EmojiPicker onEmojiClick={handleEmoji} />
                    </div>
                )}

                <Button
                    onClick={sendMessage}
                    type="submit"
                    className="border-none rounded-full focus:ring-0 focus:ring-offset-0 dark:hover:bg-black"
                    variant='ghost'
                    isLoading={isLoading}
                > <VscSend className="w-5 h-auto dark:text-gray-400" />
                </Button>
            </div>
        </div>
    </div>
}
export default ChatInput;