
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
import instance, { updateUserStatus } from "../api/axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

type Props = {
	notifySocket: any;
	connected: boolean;
};
const DropDownMenu = ({ notifySocket, connected }: Props) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    async function logout() {
      try {
        await instance
          .get("/logout")
          .then((response) => {
          })
          .catch((error) => {
            console.log(error);
            if (error.response.status == 401) {
              navigate("/login");
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
    navigate("/login");
    logout();
  };

  const { userStatus, setUserStatus } = useGlobalContext();

  const [open, setOpen] = useState(false);
  const handelOpen = () => {
    setOpen(!open);
  };

  const {userId} = useGlobalContext();

  const updateStatus = async (status: string) => {
    const res = await updateUserStatus( userId,status);
    if (res) {
      setUserStatus(status);
    }
  };

  const handleStatusChange = (event: any) => {
    setUserStatus(event.target.value);

    updateStatus(event.target.value);

  };
  
  useEffect(() => {
    if (connected) {
      if (notifySocket) {
      notifySocket.emit("realStatus", {
        id: Cookies.get("id"),
        userStatus: true,
      });
      setUserStatus("Online");
    }
    }
    else if (!connected) {
      if (notifySocket) {
      notifySocket.emit("realStatus", {
        id: Cookies.get("id"),
        userStatus: false,
      });
      setUserStatus("Offline");
    }
  }
  }, [connected]);




  useEffect(() => {
    if (connected) {
      if (notifySocket) {
        notifySocket.emit("realStatus", {
          id: Cookies.get("id"),
          userStatus: true,
        });
        setUserStatus("Online");
      }
    } else if (!connected) {
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
            id="red"
            name="color"
            color="red"
            label="Do Not Disturb"
            value="DoNotDisturb"
            checked={userStatus === "DoNotDisturb"}
            onChange={handleStatusChange}
          />
          <Radio
            id="green"
            name="color"
            color="green"
            label="On Line"
            value="Online"
            checked={userStatus === "Online"}
            onChange={handleStatusChange}
          />
          <Radio
            id="amber"
            name="color"
            color="amber"
            label="Idle"
            value="Idle"
            checked={userStatus === "Idle"}
            onChange={handleStatusChange}
          />
        </div>
      </Dialog>
      <div className="flex gap-1 justify-center items-center">
        {userImg && (
          <img
            src={userImg}
            alt="user"
            className="w-[40px] h-[40px] rounded-[50%] border"
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
          <PopoverContent className="bg-slate-50  bg-[#434242]  shadow-xl shadow-white/10 border z-50  text-white py-1">
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
