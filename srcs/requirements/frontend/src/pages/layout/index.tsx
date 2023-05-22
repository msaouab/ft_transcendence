import { Outlet } from "react-router-dom";
import CustomInput from "../../components/common/CustomInput";
// import { ReactComponent as SearchIcon } from '../../assets/icons/searchIcon.svg'
import styled from "styled-components";
import { BiSearch } from "react-icons/bi";
import { MdOutlineNotifications } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import SideBar from "../../components/common/SideBar";
import { useState } from "react";
import SearchBar from "../../components/common/Search/SearchBar";

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
  // const { userImg } = useGlobalContext();
  const LayoutStyle = styled.div`
    height: 100vh;
    width: 100vw;
    max-height: 100vh;
    width: 100vw; 
    display: grid;
    // display: flex;
    grid-template-columns: 1fr 11fr;
    padding: 1rem 2rem;

    @media (max-width: 500px) {
      
      padding: 0;
      padding-right: 1rem;
      padding-bottom: 1rem;
    }


    @media (max-width: 768px) {
      
      padding: 0; 
      .header {
        margin-right: 0;
        margin-top: 0;
    }
  

    }

  `;

  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const handelDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  // const handelOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.target.value);
  // };

  return (
    <LayoutStyle>
      {/* {JSON.stringify(userAvatar)} */}
      <div className="w-[5rem]">
        <div className="side-bar absolute top-0 left-0  ">
          <SideBar />
        </div>
      </div>
      <div className="main-content w-full ">
        <div className="header flex justify-end  gap-8 items-center  h-[10%]  max-h-[80px]
        ">
          <div className="search">
            <SearchBar />
          </div>
          <div className="notification relative">
            <div className="notif-count absolute z-10 text-white bg-red-500 rounded-[50%] w-[15px] h-[15px] text-xs p-0 m-0 flex justify-center items-center top-0 right-0">
              1
            </div>
            <MdOutlineNotifications className="text-4xl text-white font-bold" />
          </div>
          <div className="user flex justify-center items-center  relative">
            {/* {userImg && (
              <img
                src={userImg}
                alt="user"
                className="w-[40px] h-[40px] rounded-[50%]"
              />
            )} */}
            <BsChevronDown
              className="text-xl text-[#A6A6A6] font-bold cursor-pointer"
              onClick={handelDropDown}
            />
          
            <div
              className={`settings bg-slate-50 h-[8rem] flex flex-col gap-2 absolute bottom-0   p-4 font-bold text-gray-700 ${isDropDownOpen ? "block" : "hidden"
                } transition-all duration-200 absolute top-12 right-0 z-10`}
            >
              {/* <div className="setting-item">Profile</div>
              <div className="setting-item">Logout</div>
              <div className="setting-item">Status</div> */}
            </div>
          </div>
        </div>
        <div className="content max-h-[90%] h-[100%]">
          <Outlet />
        </div>
      </div>
    </LayoutStyle>
  );
};

export default index;
