import React, { useEffect } from "react";
import { MdOutlineNotifications } from "react-icons/md";
import styled, { keyframes } from "styled-components";
import { useGlobalContext } from "../provider/AppContext";
import { getNotifications, handelFriendInvite } from "../api/axios";

import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { TiUserDeleteOutline } from "react-icons/ti";

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const AnimatedComponent = styled.div`
  animation: ${fadeInAnimation} 1s ease-in;
`;

interface NotifProps {
  notifSocket: any;
  conected: boolean;
}

const Notifications = (props: NotifProps) => {
  const { notifications, setNotifications, userId } = useGlobalContext();
  const [isDropDownOpen, setIsDropDownOpen] = React.useState(false);
  const handelDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const { notifSocket, conected } = props;

  useEffect(() => {
    getNotif();
  }, []);

  const getNotif = async () => {
    const notifArr = await getNotifications();
    setNotifications([...notifArr]);
  };

  useEffect(() => {
    if (conected) {
      notifSocket.current.on("invite", (data: any) => {
        getNotif();
      });
    }
  }, [conected]);

  // close dropdown when click outside
  useEffect(() => {
    const closeDropDown = (e: any) => {
      if (
        e.target.classList.contains("notifBlock") === false &&
        e.target.classList.contains("notification") === false &&
        e.target.classList.contains("notif-count") === false
      ) {
        setIsDropDownOpen(false);
      }
    };
    window.addEventListener("click", closeDropDown);
    return () => {
      window.removeEventListener("click", closeDropDown);
    };
  }, []);

  const acceptFriendInvite = async (notif: any, status: string) => {
    await handelFriendInvite(
      notif.sender_id,
      userId,
      status,
      notif.notification_id
    );
    getNotif();
  };

  return (
    <AnimatedComponent className="notification relative font-['Oxanium'] ">
      <div className="notif-count absolute z-10 text-white bg-red-500 rounded-[50%] w-[15px] h-[15px] text-xs p-0 m-0 flex justify-center items-center top-0 right-0 ">
        {notifications.length}
      </div>
      <MdOutlineNotifications
        className="notification text-4xl text-white font-bold cursor-pointer"
        onClick={handelDropDown}
      />
      <div
        className={`notifBlock bg-slate-50  bg-[#434242]  shadow-xl shadow-white/10 border z-50 	 flex  duration-300 ease-in-out  top-12 right-0  flex-col gap-2 absolute bottom-0 w-[15rem]  p-4 font-bold text-white min-h-[8rem] h-fit rounded-md transition-all ${
          isDropDownOpen ? "block transition-all" : "hidden transition-all"
        } `}
      >
        {notifications.length === 0 ? (
          <div className="flex h-full w-full  justify-center items-center">
            <h1 className="text-white">No notifications</h1>
          </div>
        ) : (
          notifications.map((notif: any, index: number) => {
            return (
              <div
                key={index}
                className="flex flex-col gap-1 items-center  text-center text-sm   pb-2"
                style={{
                  borderBottom: "1px solid #ffffff85",
                }}
              >
                <span className="text-[12px] font-[400] flex gap-1">
                  Friend request from 
                  <span className="text-blue-600 text-md font-semibold">   {notif.sender_name}</span>
                </span>
                <div className=" flex justify-between items-center   w-full">
                  <button
                    className="flex items-center gap-1 hover:scale-105 transition-all"
                    onClick={() => acceptFriendInvite(notif, "Accepted")}
                  >
                    <IoCheckmarkDoneSharp className="text-green-500 text-xl" />{" "}
                    Accept
                  </button>
                  <button
                    className="flex items-center gap-1 hover:scale-105 transition-all"
                    onClick={() => acceptFriendInvite(notif, "Rejected")}
                  >
                    <TiUserDeleteOutline className="text-red-400 text-xl" />{" "}
                    Reject
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </AnimatedComponent>
  );
};

export default Notifications;
