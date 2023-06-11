

// User interface


export interface PrivateMessage {
    chatRoomid: string;
    messageId: string;
    sender_id: string;
    receiver_id: string;
    login: string;
    profileImage: string;
    lastMessage: string;
    lastMessageDate: string;
    seen: boolean;
    status: any;
    blocked?: boolean;
};


export interface singleMessage {
    chatRoom_id: string,
    content: string,
    dateCreated: string,
    id: string,
    receiver_id: string,
    seen: string,
    sender_id: string
}

export interface GroupMessage {
    group_id: string;
    sender_id: string;
    name: string;
    profileImage: string;
    lastMessage: string;
    lastMessageDate: string;
    role: string;
};