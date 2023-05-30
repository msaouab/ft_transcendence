import styled from "styled-components";
import { useState } from "react";
import { CiLock, CiUnread, CiGlobe } from "react-icons/ci";

const ChannelTypesStyle = styled.div`
  .dropdown {
    position: relative;
    width: 100%;
    height: 3.375rem;
    margin-bottom: 1.5rem;

    &::before {
      content: "";
      position: absolute;
      right: 20px;
      top: 15px;
      z-index: 1000;
      width: 9px;
      height: 9px;
      border: 2px solid rgb(233, 217, 144);
      border-top: 2px solid #6e6a6a;
      border-right: 2px solid #6e6a6a;
      transform: rotate(-45deg);
      transition: 0.5;
      pointer-events: none;
    }
  }

  .textBox:hover,
  .textBox:focus {
    border: 2px solid rgb(233, 217, 144);
    border-radius: 5px;
    outline: none;
  }

  .textBox::placeholder {
    color: white;
    font-size: 1rem;
  }

  input {
    overflow: visible;
  }

  .dropdown input {
    --border-width: 1px;
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 3.375rem;
    cursor: pointer;
    background: #6e6a6a;
    border: none;
    outline: none;
    border: 2px solid #b4b4b460;
    border-radius: 5px;
    padding: calc(0.75rem - var(--border-width))
      calc(0.9rem - var(--border-width));
    color: white;
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .dropdown .option {
    position: absolute;
    top: 70px;
    width: 100%;
    background-color: #6e6a6a;
    border-radius: 5px;
    overflow: hidden;
    z-index: 1000;

    div {
      padding: 12px 20px;
      cursor: pointer;

      &:hover {
        background: rgb(233, 217, 144);
        color: white;
      }
    }
  }

  .item {
    color: white;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
  }

  .icon {
    position: relative;
    font-size: 1.2rem;
    margin-right: 10px;
  }
`;

interface ChannelTypesProps {
  channelType: string;
  setChannelType: any;
}

const ChannelTypes = (props: ChannelTypesProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const { channelType, setChannelType } = props;

  const handleChannelType = (type: string) => {
    setChannelType(type);
    setShowOptions(false);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <ChannelTypesStyle>
      <div className="dropdown">
        <input
          type="text"
          className="textBox"
          placeholder="Public"
          value={channelType}
          readOnly
          onClick={toggleOptions}
        />
        {showOptions && (
          <div className="option">
            <div className="item" onClick={() => handleChannelType("Public")}>
              <CiGlobe className="icon" />
              Public
            </div>
            <div className="item" onClick={() => handleChannelType("Secret")}>
              <CiLock className="icon" />
              Secret
            </div>
            <div className="item" onClick={() => handleChannelType("Private")}>
              <CiUnread className="icon" />
              Private
            </div>
          </div>
        )}
      </div>
    </ChannelTypesStyle>
  );
};

export default ChannelTypes;
