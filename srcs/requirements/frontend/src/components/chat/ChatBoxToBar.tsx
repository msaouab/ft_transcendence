
import styled from 'styled-components';
import { CiCircleMore } from 'react-icons/ci'
import { Link, useNavigate } from 'react-router-dom';
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

const ChatBoxTopBar = (props: { login: string, profileImage: string, status: string, id: string }) => {
    // console.log("id is: ", props.id);
    // if (!props.id) useNavigate().push('/login');
    const navigate = useNavigate();
    // if (!props.id) navigate('/login');
    return (
        <ChatBoxTopBarStyle>
            <div className="flex flex-row ">
                <div className="">
                    {/* uncomment later */}
                    {/* <img src={props.profileImage} alt="profile" className="rounded-full" /> */}
                    <img src="https://picsum.photos/200" alt="profile" className="rounded-full w-10 h-10" />
                </div>
                <div className="flex flex-col  ml-2 font-black ">
                    <div className="chat-box-top-bar__info__name font-black 

                    ">
                        <Link to={`/user/${props.id}`} className="hover:underline">

                            {props.login}

                        </Link>
                    </div>
                    <div className="chat-box-top-bar__info__status text-xs font-thin opacity-50 text-[#E9D990] ">
                        {props.status}
                    </div>
                </div>
            </div >
            <div className="close-chat-button flex justify-center items-center 
                    top-0 right-0 w-10 h-10 rounded-full 
                    hover:bg-[#27272a] hover:text-white
                    transition-all duration-300 ease-in-out cursor-pointer
                    ">
                <CiCircleMore size={30} />
            </div>
        </ChatBoxTopBarStyle >
    );
};

export default ChatBoxTopBar;