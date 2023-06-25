import styled from "styled-components";
import { useEffect, useState } from "react";
import { CiImport } from "react-icons/ci";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ChannelTypes from "./ChannelTypes";
import { HOSTNAME, PostChannelAvatar } from "../../../api/axios";
import Cookies from "js-cookie";

const ModelStyle = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: ${(props: { show: any }) => (props.show === true ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 100;
  .new-chat {
    width: 500px;
    background: #6e6a6a;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 10px 10px 10px #0000003b;
    position: relative;
    .close-btn {
      position: absolute;
      margin-bottom: 1rem;
      top: 1rem;
      left: 2rem;
      font-size: 2.6rem;
      cursor: pointer;
      color: #e9d990;
      &:hover {
        scale: 1.2;
        transition: scale 1s ease-in-out;
      }
    }
  }
  input {
    overflow: visible;
  }
  .avatar-label {
    margin-left: auto;
    margin-right: auto;
    width: 7.5rem;
    height: 7.5rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6e6a6a;
    background-color: rgb(233, 217, 144);
    border-radius: 50%;
    font-size: 3rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    outline: none;
  }

  .avatar input {
    display: none;
  }

  .inputBox {
    position: relative;
    margin-bottom: 1.5rem;

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
  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

interface ModelProps {
  show: boolean;
  setShow?: any;
  setSelectedGroupChat?: any;
  socket?: any;
  connected: boolean;
}
const Model = (props: ModelProps) => {
  const initialChannel = {
    avatar: "",
    name: "",
    description: "",
    password: "",
  };

  const [channel, setChannel] = useState(initialChannel);
  const [type, setType] = useState("Public");
  const [exeption, setExeption] = useState(false);

  const handelChange = (e: any) => {
    e.preventDefault();
    setChannel({ ...channel, [e.target.name]: e.target.value });
  };

  const handelFile = (e: any) => {
    PostChannelAvatar(e.target.files[0]).then(() => {
      const url = `http://${HOSTNAME}:3000/${e.target.files[0].name}`
      setChannel({ ...channel, avatar: url });
      e.target.value = "";
    }).catch(() => {
      console.log("file not uploaded");
    });
  };

  const createChannel = async (e: any) => {
    e.preventDefault();
    if (props.connected) {
      props.socket.current.emit("createChannel", {
        name: channel.name,
        status: type,
        password: channel.password,
        limitUsers: 0,
        description: channel.description,
        avatar: channel.avatar || `http://${HOSTNAME}:3000/default.png`,
        owner: Cookies.get("id"),
      });
    }
  };

  useEffect(() => {
    if (props.connected) {
      props.socket.current.on("channelCreated", (data: any) => {
        props.setShow(false);
      });
      props.socket.current.on("errorExistChannel", (data: any) => {
        setExeption(true);
      });
    }

    return () => {
      if (props.connected) {
        props.socket.current.off("channelCreated");
        props.socket.current.off("errorExistChannel");
      }
    }
  }, [props.connected]);

  return (
    <ModelStyle show={props.show}>
      <form className="new-chat" onSubmit={createChannel}>
        <AiOutlineCloseCircle
          className="close-btn"
          onClick={() => {
            setChannel(initialChannel);
            setType("Public");
            setExeption(false);
            props.setShow(false);
          }}
        />
        <div className="avatar">
          <label
            role="button"
            title="Set Profile Photo"
            className="avatar-label"
          >
            <input
              type="file"
              accept="image/png, image/jpeg"
              name="avatar"
              onChange={handelFile}
            />

            {channel.avatar !== "" ? (
              <img src={channel.avatar} alt="avatar" className="avatar-img" />
            ) : (
              <CiImport />
            )}
          </label>
        </div>
        <div className="inputBox">
          <input
            type="text"
            id="Channel name"
            placeholder="Channel name"
            required
            value={channel.name}
            onChange={handelChange}
            name="name"
          />
          <label htmlFor="Channel name">Channel name</label>
          {exeption && (
            <p
              style={{
                color: "rgb(233, 217, 144)",
                fontSize: "0.8rem",
                left: "0.75rem",
                top: "3.5rem",
                position: "absolute",
              }}
            >
              * This name is already taken
            </p>
          )}
        </div>
        <ChannelTypes channelType={type} setChannelType={setType} />
        {type === "Secret" && (
          <div className="inputBox">
            <input
              type="password"
              id="Password"
              {...(type === "Secret" && { required: true })}
              placeholder="Password"
              value={channel.password}
              onChange={handelChange}
              name="password"
            />
            <label htmlFor="Password">Password</label>
          </div>
        )}
        <div className="inputBox">
          <input
            type="text"
            id="Description"
            placeholder="Description"
            value={channel.description}
            onChange={handelChange}
            name="description"
          />
          <label htmlFor="Description">Description</label>
        </div>
        <button type="submit" className="btn">
          Create Channel
        </button>
      </form>
    </ModelStyle>
  );
};

export default Model;
