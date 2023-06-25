import { useEffect, useRef, useState } from 'react'
import { CiLock, CiWarning } from "react-icons/ci";
import { useGlobalContext } from '../../../provider/AppContext';
import { io } from "socket.io-client";
import styled from 'styled-components';
import { HOSTNAME } from '../../../api/axios';



const JoinChannelStyle = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: ${(props: { show: any }) => (props.show === true ? "flex" : "none")};
    justify-content: center;
    align-items: center;
    z-index: 100;
    .join-channel {
        width: 500px;
        background: #6e6a6a;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 10px 10px 10px #0000003b;
        position: relative;
        display: flex;
        flex-direction: column;
        .header {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            gap: 1rem;
            .image {
                padding-right: 6px;
                img {
                    width: 70px;
                    height: 70px;
                    border-radius: 9px;
                }
            }
            .channel_info {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                gap: 0.5rem;
                .channel_name {
                    span {
                        font-size: 1.4rem;
                        font-weight: 600;
                        color: #fff;
                    }
                }
                .channel_type {
                    display: flex;
                    flex-direction: row;
                    font-size: 1rem;
                    .icon {
                        width: 20px;
                        height: 20px;
                        display: inline-block;
                        position: relative;
                        font-size: .8125rem;
                        margin-right: 10px;
                        text-align: left;
                        font-weight: 400;
                    }
                }
            }
        }
        .body {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            gap: 1rem;
            .inputBox {
                position: relative;
                margin-bottom: 1rem;
                width: 100%;
                label {
                display: block;
                padding: 0 0.25rem;
                position: absolute;
                left: 0.75rem;
                top: 0.9375rem;
                background-color: #6e6a6a;
                font-size: 1rem;
                font-weight: 400;
                color: white;
                transition: transform 0.15s ease-out, color 0.15s ease-out;
                cursor: text;
                pointer-events: none;
                transform-origin: left center;
                white-space: nowrap;
                }
                input:focus ~ label,
                input:not(:placeholder-shown) ~ label {
                transform: scale(0.75) translate(-0.5rem, -2.25rem);
                }
                input {
                    --border-width: 1px;
                    width: 100%;
                    height: 3.375rem;
                    padding: calc(0.75rem - var(--border-width))
                        calc(0.9rem - var(--border-width));
                    border: 2px solid #b4b4b460;
                    background: #6e6a6a;
                    border-radius: 5px;
                    outline: none;
                    transition: 0.3s all;
                    word-break: break-word;
                    color: white;
                    font-size: 1rem;
                    line-height: 1.25rem;
                    ::placeholder {
                        color: transparent;
                    }
                    &:focus {
                        border-color: rgb(233, 217, 144);
                        box-shadow: inset 0 0 0 1px rgb(233, 217, 144);
                    }
                    &:hover {
                        border-color: rgb(233, 217, 144);
                    }
                    &:hover ~ label,
                    &:focus ~ label {
                        color: rgb(233, 217, 144);
                    }
                }
            }
            .buttons {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                gap: 2rem;
                width: 100%;
                .btn {
                    width: 100%;
                    height: 3.375rem;
                    border: none;
                    outline: none;
                    background: rgb(233, 217, 144);
                    border-radius: 5px;
                    font-size: 1rem;
                    color: #6e6a6a;
                    cursor: pointer;
                    transition: 0.3s all;
                    &:hover {
                        box-shadow: 0 0 0 2px rgb(233, 217, 144);
                    }
                }
            }
        }
    }
`;

interface JoinChannelProps {
    joinChannel: any,
    setJoinChannel: any,
}

const JoinChannel = ({ joinChannel, setJoinChannel }: JoinChannelProps) => {
    const [show, setShow] = useState(true);
    const { channel, userId } = joinChannel;
    const [password, setPassword] = useState("");
    const { groupChatRooms, setGroupChatRooms } = useGlobalContext();
    const [error, setError] = useState(false);
    const [readyToJoin, setReadyToJoin] = useState(false);
    const [joind, setJoind] = useState(false);

    const socket = useRef(null);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        if (!connected) {
            socket.current = io(`http://${HOSTNAME}:3000/chat`);
            setConnected(true);
        }
        return () => {
            socket.current.disconnect();
            setConnected(false);
        }
    }, []);

    useEffect(() => {
        if (channel.id) {
            socket.current.emit("joinGroupRoom", { group_id: channel.id });
        }
        return () => {
            if (channel.id) {
                socket.current.emit("leaveGroupRoom", { group_id: channel.id });
            }
        };
    }, [channel.id]);

    useEffect(() => {
        if (connected) {
            socket.current.on("newChannelMember", (message: any) => {
                const newMessge = {
                    group_id: channel.id,
                    sender_id: channel.id,
                    name: channel.name,
                    profileImage: channel.avatar,
                    lastMessage: `${message.login} joined the channel`,
                    lastMessageDate: (new Date()).toISOString(),
                    role: "Server",
                };
                setGroupChatRooms([...groupChatRooms, newMessge]);
                socket.current.emit("sendGroupMessage", newMessge);
                setJoinChannel({});
                setShow(false);
            });
            socket.current.on("error", (message: any) => {
                setError(true);
                setReadyToJoin(false);
            });
        }
    }, [connected]);

    useEffect(() => {
        if (connected) {
            if (channel.type === "Public") {
                socket.current.emit("addChannelMember", {
                    channel_id: channel.id,
                    type: channel.type,
                    password: channel.password,
                    user_id: userId,
                });
                setJoind(true);
            }
            else if (readyToJoin === true) {
                socket.current.emit("addChannelMember", {
                    channel_id: channel.id,
                    type: channel.type,
                    password: password,
                    user_id: userId,
                });
                setJoind(true);
            }
        }
    }, [connected, readyToJoin]);

    return (
        <JoinChannelStyle show={show}>
            {
                channel.type === "Secret" && (
                    <div className="join-channel">
                        <header className="header">
                            <div className='image'>
                                <img src={channel.avatar} alt='profile' />
                            </div>
                            <div className="channel_info">
                                <div className="channel_name">
                                    <span>{channel.name}</span>
                                </div>
                                <div className="channel_type">
                                    <CiLock className="icon" />
                                    <span> Group with privacy set to Private </span>
                                </div>
                            </div>
                        </header>
                        <div className="h-px bg-[#B4ABAB] w-[99%] mx-auto mt-1.5 mb-1.5 opacity-60"></div>
                        <form className="body" onSubmit={(e) => {
                            e.preventDefault();
                            setReadyToJoin(true);
                        }}>
                            <div className="password">
                                <span>Enter the password to join this channel</span>
                            </div>
                            <div className="inputBox">
                                <input
                                    type="password"
                                    id="Password"
                                    placeholder="Password"
                                    value={password}
                                    name="password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label htmlFor="Password">Password</label>
                                {error && (
                                    <p
                                        style={{
                                            color: "rgb(233, 217, 144)",
                                            fontSize: "1rem",
                                            left: "0.75rem",
                                            top: "3.5rem",
                                            position: "absolute",
                                            display: "flex",
                                            alignItems: "center",
                                            flexDirection: "row",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        <CiWarning className="icon" />
                                        Incorrect Password
                                    </p>
                                )}
                            </div>
                            <div className="buttons">
                                <button className="cancel btn" type="button" onClick={() => {
                                    setJoinChannel({});
                                    setShow(false);
                                }}>Cancel</button>
                                <button className="join btn" type="submit">Join</button>
                            </div>
                        </form>
                    </div>
                )
            }
        </JoinChannelStyle>
    )
}

export default JoinChannel
