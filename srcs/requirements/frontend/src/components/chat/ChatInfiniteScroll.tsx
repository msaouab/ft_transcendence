

import InfiniteScroll from "react-infinite-scroll-component";
import Message from "./Message/Message";

const ChatInfiniteScroll = ({ messages, next, hasMore }: { messages: any, next: any, hasMore: any }) => {

    
    return (
        <div>

            <InfiniteScroll
                // key={selectedChat.chatRoomid}
                scrollableTarget="scrollableDiv"
                dataLength={messages.length} //This is important field to render the next data
                next={next}
                hasMore={hasMore}
                inverse={true}
                loader={<h4>Loading...</h4>}
            >
                {messages
                    .slice() // make a copy of the array
                    .reverse() // reverse the order of the array
                    .map((message: any) => {
                        const prevMessage = messages[messages.indexOf(message) - 1];
                        return <Message key={message.id} message={message} prevMessage={prevMessage} />;
                    })}

            </InfiniteScroll>

            {/* <SendMessageBox selectedChat={selectedChat} setState={setState} /> */}
        </div>


    )
}

export default ChatInfiniteScroll;