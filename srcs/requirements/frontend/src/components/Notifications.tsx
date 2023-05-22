import React from "react";
import { MdOutlineNotifications } from "react-icons/md";
import { Link } from "react-router-dom";

const Notifications = () => {
  const [isDropDownOpen, setIsDropDownOpen] = React.useState(false);
  const handelDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  return (
    <div className="notification relative">
      <div className="notif-count absolute z-10 text-white bg-red-500 rounded-[50%] w-[15px] h-[15px] text-xs p-0 m-0 flex justify-center items-center top-0 right-0">
        1
      </div>
      <MdOutlineNotifications
        className="text-4xl text-white font-bold"
        onClick={handelDropDown}
      />
      <div
        className={`settings bg-slate-50  bg-[#ffffff26] backdrop-blur-sm	 flex  duration-300 ease-in-out  top-12 right-0 z-10 flex-col gap-2 absolute bottom-0   p-4 font-bold text-white min-h-[8rem] h-fit rounded-md transition-all ${
          isDropDownOpen ? "block transition-all" : "hidden transition-all"
        } `}
      >
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi iure delectus, nam recusandae veritatis, deserunt quos alias deleniti voluptates molestias autem quidem corrupti voluptatem est aperiam provident. Est, fuga iusto?
      </div>
    </div>
  );
};

export default Notifications;
