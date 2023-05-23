
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BsChevronDown } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Checkbox, Dialog, Radio } from "@material-tailwind/react";
import { useGlobalContext } from "../provider/AppContext";
import Padel from "../assets/padel.png";
import axios from "axios";


type Props = {
  notifySocket: any;
  connected: boolean;
};
const DropDownMenu = ({notifySocket, connected} : Props) => {
  const { userStatus, setUserStatus } = useGlobalContext();
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);

  const handelDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

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
    console.log("connected to the server notify");
      console.log("current: ", notifySocket);
      if (notifySocket) {
        console.log("we're emmiting the event status");
      notifySocket.emit("realStatus", {
        id: Cookies.get("id"),
        userStatus: true,
      });
      setUserStatus("Online");
    }
    }
    else if (!connected) {
      console.log("we're emmiting the event status");
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
        <BsChevronDown
          className="text-2xl text-[#ececec] font-bold cursor-pointer ml-2"
          onClick={handelDropDown}
        />
      <div
        className={`settings bg-slate-50  bg-[#ffffff26] backdrop-blur-sm	 flex  duration-300 ease-in-out  top-12 right-0 z-10 flex-col gap-2 absolute bottom-0   p-4 font-bold text-white h-[8rem] rounded-md transition-all ${
          isDropDownOpen ? "block transition-all" : "hidden transition-all"
        } `}
      >
          <Link to="/profile" className="setting-item">
            Profile
          </Link>
          <div className="setting-item">Logout</div>
          <div className="setting-item cursor-pointer" onClick={handelOpen}>
            Status
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropDownMenu;
