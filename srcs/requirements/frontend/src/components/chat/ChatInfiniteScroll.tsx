

import InfiniteScroll from "react-infinite-scroll-component";
import Message from "./Message/Message";


const ChatInfiniteScroll = ({ messages, next, hasMore, setState }: { messages: any, next: any, hasMore: any, setState: any }) => {
    console.log("im rendering cause a new message was sent");
    // when
    console.log("messages:", messages);
    return (
        <div className="flex flex-col-reverse overflow-y-auto gap-2 mt-2 w-full h-full max-h-[100%]
    
        " id="scrollableDiv">
            <InfiniteScroll className=" "
                scrollableTarget="scrollableDiv"
                dataLength={messages.length} //This is important field to render the next data
                next={next}
                hasMore={hasMore}
                inverse={true}
                loader={<h4
                    className="hidden"
                >Loading...</h4>}
            >
              
                {messages
                    .slice() // make a copy of the array
                    .reverse() // reverse the order of the array
                    .map((message: any) => {
                        console.log("message:", message);
                        const prevMessage = messages[messages.indexOf(message) - 1];
                        return <Message 
                        key={message.id}
                        message={message} prevMessage={prevMessage} setState={setState} />;
                    })}
            </InfiniteScroll>

            {/* <SendMessageBox selectedChat={selectedChat} setState={setState} /> */}
        </div>


    )
}

export default ChatInfiniteScroll;