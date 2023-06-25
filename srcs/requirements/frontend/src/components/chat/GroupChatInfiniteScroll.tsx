import InfiniteScroll from "react-infinite-scroll-component";
import Message from "./Message/GroupMessage";
import Cookies from 'js-cookie';


interface GroupChatInfiniteScrollProps {
    messages: any;
    hasMore: any;
    next: any;
}

const GroupChatInfiniteScroll = ({ messages, hasMore,next}: GroupChatInfiniteScrollProps) => {
    return (
        <div
            className="flex flex-col-reverse overflow-y-auto gap-2 mt-2 w-full h-full max-h-[100%]"
            id="scrollableDiv"
        >
            <InfiniteScroll
                className=" "
                scrollableTarget="scrollableDiv"
                dataLength={messages.length} //This is important field to render the next data
                next={next}
                hasMore={hasMore}
                inverse={true}
                loader={<h4 className="hidden">Loading...</h4>}
            >
                {messages
                    .slice() // make a copy of the array
                    .reverse() // reverse the order of the array
                    .map((message: any) => {
                        const sender = message.sender_id === message.group_id ? "Server" :
                            message.sender_id === Cookies.get('id') ? "User" : "Friend";
                        const avatar = "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200";
                        const role = message.role;
                        return (
                            <Message key={message.id} message={message} sender={sender} avatar={avatar} role={role} />
                        );
                    })}
            </InfiniteScroll>
        </div>
    );
};

export default GroupChatInfiniteScroll;
