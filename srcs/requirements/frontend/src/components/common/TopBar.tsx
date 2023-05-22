
import styled from "styled-components";

import SearchBar from "./Search/SearchBar";
import { MdOutlineNotifications } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { useState } from "react";
import { Link } from "react-router-dom";

const TopBarStyle = styled.div`
    display: flex;
    width: 100vw;
    height: 100%;
    border: 1px solid red;



`;

const TopBar = () => {
    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
    const handelOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    };
    return (
        // <div className="main-content">
        <div className="header flex justify-end  gap-8 items-center  h-[10%]">
            <div className="search">
                {/* <CustomInput
              placeHolder="Search"
              type="text"
              onChange={handelOnchange}
              icon={<BiSearch className="text-[#1E1D19]" />}
            /> */}
                <SearchBar />
            </div>

            <div className="notification relative">
                <div className="notif-count absolute z-10 text-white bg-red-500 rounded-[50%] w-[15px] h-[15px] text-xs p-0 m-0 flex justify-center items-center top-0 right-0">
                    1
                </div>
                <MdOutlineNotifications className="text-4xl text-white font-bold" />
            </div>
            <div className="user flex justify-center items-center  relative">
                <FaUserCircle className="text-4xl text-white font-bold mr-1" />
                <BsChevronDown
                    className="text-xl text-[#A6A6A6] font-bold cursor-pointer"
                    onClick={() => setIsDropDownOpen(!isDropDownOpen)}
                />
                <div
                    className={`settings bg-slate-50 h-[8rem] flex flex-col gap-2 absolute bottom-0   p-4 font-bold text-gray-700 ${isDropDownOpen ? "block" : "hidden"
                        } transition-all duration-200 absolute top-12 right-0 z-10`}
                >
                    <div className="setting-item">Profile</div>
                    <div className="setting-item">Logout</div>
                    <div className="setting-item">Status</div>
                </div>
            </div>
        </div>

    )
}

export default TopBar;

