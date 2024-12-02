import { FC } from "react";
import AddFriendButton from "@/components/AddFriendButton";

const Add: FC = async () => {
    return <main className="pt-8 px-10">
        <h1 className="font-bold text-5xl mb-8 text-[--text-primary]">Add a friend</h1>
        <AddFriendButton />
    </main>
}
export default Add;