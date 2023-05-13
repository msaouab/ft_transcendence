import { Outlet } from "react-router-dom";
import CustomInput from "../../components/common/CustomInput";
// import { ReactComponent as SearchIcon } from '../../assets/icons/searchIcon.svg'
import styled from "styled-components";
import { BiSearch } from "react-icons/bi";
import { MdOutlineNotifications } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import SideBar from "../../components/common/SideBar";
import { useEffect, useState } from "react";
import { GetAvatar } from "../../api/axios";
import { useGlobalContext } from "../../provider/AppContext";

const DropDown = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #fff;
  width: 200px;
  height: 200px;
  border-radius: 5px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.75);
  z-index: 10;
`;

const index = () => {
  const { userImg } = useGlobalContext();
  const LayoutStyle = styled.div`
    height: 100vh;
    /* width: 100vw; */
    display: grid;
    grid-template-columns: 1fr 11fr;
    padding: 1rem 2rem;
  `;

  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const handelDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const handelOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <LayoutStyle>
      {/* {JSON.stringify(userAvatar)} */}
      <div className="side-bar ">
        <SideBar />
      </div>
      <div className="main-content">
        <div className="header flex justify-end  gap-8 items-center  h-[10%]">
          <div className="search">
            <CustomInput
              placeHolder="Search"
              type="text"
              onChange={handelOnchange}
              icon={<BiSearch className="text-[#1E1D19]" />}
            />
          </div>
          <div className="notification relative">
            <div className="notif-count absolute z-10 text-white bg-red-500 rounded-[50%] w-[15px] h-[15px] text-xs p-0 m-0 flex justify-center items-center top-0 right-0">
              1
            </div>
            <MdOutlineNotifications className="text-4xl text-white font-bold" />
          </div>
          <div className="user flex justify-center items-center  relative">
            {userImg && (
              <img
                src={userImg}
                alt="user"
                className="w-[40px] h-[40px] rounded-[50%]"
              />
            )}
            <BsChevronDown
              className="text-xl text-[#A6A6A6] font-bold cursor-pointer"
              onClick={handelDropDown}
            />
            <div
              className={`settings bg-slate-50  bg-white flex transition duration-300 ease-in-out  top-12 right-0 z-10 flex-col gap-2 absolute bottom-0   p-4 font-bold text-gray-700 ${
                isDropDownOpen ? "h-[8rem]" : "h-0"
              } `}
            >
              {/* <div className="setting-item">Profile</div>
              <div className="setting-item">Logout</div>
              <div className="setting-item">Status</div> */}
            </div>
          </div>
        </div>
        <div className="content  h-[90%]">
          <Outlet />
        </div>
      </div>
    </LayoutStyle>
  );
};

export default index;
