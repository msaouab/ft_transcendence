
import styled from 'styled-components';
import { CiCircleMore } from 'react-icons/ci'
const ChatBoxTopBarStyle = styled.div`
border: 1 solid #fff;
    background: transparent;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    padding: 10px;

    justify-content: space-between;
    border-radius: 25px;
    & > *:first-child {
        color: #fff;
    }

    & > *:nth-child(2) {
        cursor: pointer;
        color: #fff;
        margin-right: 0;
    }

`;


const ChatBoxTopBar = (props: { login: string, profileImage: string, status: string }) => {
    return (
        <ChatBoxTopBarStyle>
            <div className="flex flex-row">
                <div className="">
                    {/* uncomment later */}
                    {/* <img src={props.profileImage} alt="profile" className="rounded-full" /> */}
                    <img src="https://picsum.photos/200" alt="profile" className="rounded-full w-10 h-10" />
                </div>
                <div className="flex flex-col  ml-2 font-black ">
                    <div className="chat-box-top-bar__info__name font-black ">
                        {props.login}
                    </div>
                    <div className="chat-box-top-bar__info__status text-xs font-thin opacity-50 text-[#E9D990] ">
                        {props.status}
                    </div>
                </div>
            </div>
            <div className="chat-box-top-bar__options">
                <CiCircleMore size={30} />
            </div>
        </ChatBoxTopBarStyle>
    );
};

export default ChatBoxTopBar;