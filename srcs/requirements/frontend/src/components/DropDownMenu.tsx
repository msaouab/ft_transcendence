
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BsChevronDown } from "react-icons/bs";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  Popover,
  PopoverContent,
  PopoverHandler,
  Radio,
} from "@material-tailwind/react";
import { useGlobalContext } from "../provider/AppContext";
import Padel from "../assets/padel.png";
import instance from "../api/axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

type Props = {
  notifySocket: any;
  connected: boolean;
};
const DropDownMenu = ({notifySocket, connected} : Props) => {
  const { userStatus, setUserStatus } = useGlobalContext();
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);

  const handelDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  const navigate = useNavigate();
  const handleLogout = () => {
    async function logout() {
      try {
        await instance.get("/logout").catch((error) => {
          console.log("logout1111");
          console.log("logout");
          window.location.reload();
          if (error.response.status == 401) {
            navigate("/login");
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
    logout();
  };

  const { userStatus, setUserStatus } = useGlobalContext();

  const [open, setOpen] = useState(false);
  const handelOpen = () => {
    setOpen(!open);
  };

  const handleStatusChange = (event: any) => {
    console.log(event.target.value);
    setUserStatus(event.target.value);

    // notifySocket.emit("status", {
    //   id: Cookies.get("id"),
    //   userStatus: event.target.value,
    // });
  };
  
  useEffect(() => {
    // console.log("heeeeeeeeeeeeeee: ", userStatus);
    if (connected) {
    // console.log("connected to the server notify");
      // console.log("current: ", notifySocket);
      if (notifySocket) {
        // console.log("we're emmiting the event status");
      notifySocket.emit("realStatus", {
        id: Cookies.get("id"),
        userStatus: true,
      });
      setUserStatus("Online");
    }
    }
    else if (!connected) {
      // console.log("we're emmiting the event status");
      if (notifySocket) {
      notifySocket.emit("realStatus", {
        id: Cookies.get("id"),
        userStatus: false,
      });
      setUserStatus("Offline");
    }
  }
  }, [connected]);


  // useEffect(() => {
  // console.log("hello im being called to upadate user status");
  // console.log("userStatus: ", userStatus);
  // setUserStatus(userStatus);

  // }, [userStatus] );
  
  // console.log("userStatus", userStatus);
  // const status  = Cookies.get('status')
  // if (userStatus !== '')
  // {
  // console.log("userStatus", userStatus);
  // if (connected) 
  // {
  //   notifySocket && notifySocket.current.on("connect", () => {
  //     console.log("connected to the server notify"); 
  //     // notifySocket.current.emit('status', {id: Cookies.get('id'), userStatus: "Online"});

  //   });
  //   // console.log("im here user status", userStatus);
  // }
// }  

// notifySocket.current.on("connect", () => {
//   console.log("connected to the server notify");
//   notifySocket.current.emit('status', {id: Cookies.get('id'), userStatus: "Online"});
// });
  




  useEffect(() => {
    console.log("heeeeeeeeeeeeeee: ", userStatus);
    if (connected) {
      console.log("connected to the server notify");
      // console.log("current: ", notifySocket);
      if (notifySocket) {
        console.log("we're emmiting the event status");
        notifySocket.emit("realStatus", {
          id: Cookies.get("id"),
          userStatus: true,
        });
        setUserStatus("Online");
      }
    } else if (!connected) {
      // console.log("we're emmiting the event status");
      if (notifySocket) {
        notifySocket.emit("realStatus", {
          id: Cookies.get("id"),
          userStatus: false,
        });
        setUserStatus("Offline");
      }
    }
  }, [connected]);

  const { userImg } = useGlobalContext();

  return (
    <div>
      <Dialog
        // size="xl"
        open={open}
        handler={handelOpen}
        className="flex flex-col gap-4 items-center justify-center p-10 max-w-[100px]"
      >
        <div className="flex flex-col justify-center items-center">
          <img src={Padel} alt="" width={100} />
          <h1 className="text-3xl text-gray-700">Change your status</h1>
        </div>
        <div className="gap-4">
          <Radio
            id="blue"
            name="color"
            color="blue"
            label="In Game"
            value="ingame"
            checked={userStatus === "ingame"}
            onChange={handleStatusChange}
          />
          <Radio
            id="red"
            name="color"
            color="red"
            label="Do Not Disturb"
            value="donotdisturb"
            checked={userStatus === "donotdisturb"}
            onChange={handleStatusChange}
          />
          <Radio
            id="green"
            name="color"
            color="green"
            label="On Line"
            value="online"
            checked={userStatus === "online"}
            onChange={handleStatusChange}
          />
          <Radio
            id="amber"
            name="color"
            color="amber"
            label="Busy"
            value="busy"
            checked={userStatus === "busy"}
            onChange={handleStatusChange}
          />
        </div>
      </Dialog>
      <div className="flex gap-1 justify-center items-center">
        {userImg && (
          <img
            src={userImg}
            alt="user"
            className="w-[40px] h-[40px] rounded-[50%]"
          />
        )}
        {/* <BsChevronDown
          className="text-2xl text-[#ececec] font-bold cursor-pointer ml-2"
          onClick={handelDropDown}
        /> */}
        <Popover placement="bottom-end" offset={10}>
          <PopoverHandler>
            <Button
              className="bg-none p-0 m-0 bg-transparent shadow-transparent "
              ripple={false}
            >
              <BsChevronDown className="text-2xl text-[#ececec] font-bold cursor-pointer ml-2" />
            </Button>
          </PopoverHandler>
          <PopoverContent className="bg-slate-50  bg-[#9343076e] backdrop-blur-sm	px-4 shadow-xs shadow-white text-white border-0 py-1">
            <div className="setting-item  transition-all hover:scale-105 cursor-pointer py-1">
              <Link to="/profile">Profile</Link>
            </div>
            <div
              className="setting-item  transition-all hover:scale-105 cursor-pointer py-1"
              onClick={handelOpen}
            >
              Status
            </div>
            <div
              className="setting-item transition-all hover:scale-105 cursor-pointer py-1"
              onClick={handleLogout}
            >
              Logout
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DropDownMenu;
