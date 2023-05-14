
import { createHash } from 'crypto';

const getRoomId = async (senderId: string, receiverId: string) => {
    const roomName = [senderId, receiverId].sort().join('-');
    const secretKey = "secret";
    // hash the room name using md5
    const hash = createHash('md5');
    const hashedRoomName = hash.update(roomName + secretKey).digest('hex');
    return hashedRoomName;
}