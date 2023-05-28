

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
    // blocked is an arr of boolean
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

