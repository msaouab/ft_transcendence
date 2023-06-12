import styled from "styled-components";
import { getDateChat } from '../../common/CommonFunc';



interface MessageContainerProps {
  sender: string;
}

const MessageContainer = styled.div<MessageContainerProps>`
  position: relative;
  display: flex;
  width: 100%;
  margin: 5px 0;
  .message__date {
    font-size: 0.7rem;
    margin: 0;
    align-self: flex-end;
    opacity: 0.5;
    text-align: right;
  }
  .server_msg{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 5px auto;
    margin-top: 0.5rem;
    margin-bottom: 0.75rem;
    background: #6e6a6a;
    padding: 5px 12px 6px;
    border-radius: 5px;
  }
  .imgavatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 0 10px;
  }
  .data-container {
    flex-direction: row;
    color: black;
    position: relative;
    right: 0;
    min-width: 150px;
    max-width: 65%;
    background: #e9d990;
    border-radius: 10px;
    font-size: 1rem;
    .message {
      padding: 10px;
      text-align: left;
    }
    .titlelogin {
      display: flex;
      justify-content: space-between;
      padding-inline: 10px;
    }
    span {
      display: block;
      margin-top: 1px;
      font-size: 0.85rem;
      opacity: 0.5;
      text-align: right;
    }
    &:before {
      content: "";
      position: absolute;
      top: 0;
      right: -12px;
      width: 20px;
      height: 20px;
      background: linear-gradient(
        135deg,
        #e9d990 0%,
        #e9d990 50%,
        transparent 50%,
        transparent
      );
    }
  }
  ${(props) =>
    props.sender === "User"
      ? ` justify-content: flex-end; `
      : `
      justify-content: flex-start;
      .data-container {
        flex-direction: row-reverse;
        background: #fff;
        &:before {
          content: "";
          position: absolute;
          top: 0;
          left: -12px;
          width: 20px;
          height: 20px;
          background: linear-gradient(225deg, #fff 0%, #fff 50%, transparent 50%, transparent);
      }
      .message__date {
        color: #000;
        align-self: flex-start;
      }
    }
`}

`;

interface MessageProps {
  message: any
  sender: string;
  avatar: string;
  role: string;
}

const Message = ({ avatar, role, message, sender }: MessageProps) => {

  const { sender_name, content, dateCreated } = message;

  return (
    <MessageContainer sender={sender}>
      {
        sender === "Server" ? ((
          <div className="server_msg">
            {content}
            <div>
              <p className="mx-4 message__date">{getDateChat(dateCreated)}</p>
            </div>
          </div>
        )) : (<>
          {avatar !== "" && sender === 'Friend' && (
            <img
              className="imgavatar"
              src={avatar}
              alt="user"
            />
          )}
          <div className="data-container">
            <div className="titlelogin">
              {sender_name !== "" && <span>{sender_name}</span>}
              {role !== "" && <span>{role}</span>}
            </div>
            <div className="message">
              {content}
              <br />
              <p className="mx-4 message__date">{getDateChat(dateCreated)}</p>
            </div>
          </div>
            {avatar !== "" && sender === "User" && (
            <img
              className="imgavatar"
              src={avatar}
              alt="user"
            />
          )}
        </>
        )}

    </MessageContainer>
  );
};

export default Message;
