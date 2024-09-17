interface User {
    name: string, 
    email: string,
    image: string,
    id: string
}

interface Message {
    id: string,
    senderId: string,
    receiverId: string,
    text: string,
    timeStamp: number
}

interface chat {
    id: string,
    messages: Message[]
}

interface FriendRequest {
    id: string,
    senderId: string,
    receiverId: string
}