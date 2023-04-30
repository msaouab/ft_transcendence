import { Outlet } from "react-router-dom";
import CustomInput from "../../components/common/CustomInput";
// import { ReactComponent as SearchIcon } from '../../assets/icons/searchIcon.svg'
import styled from "styled-components";
import { BiSearch } from "react-icons/bi";
import { MdOutlineNotifications } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";

const index = () => {
  const LayoutStyle = styled.div`
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-columns: 1fr 11fr;
    padding: 1rem 2rem;
  `;

  const handelOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <LayoutStyle>
      <div className="side-bar"></div>
      <div className="main-content">
        <div className="header flex justify-end debug gap-8 items-center debug h-[10%]">
          <div className="search">
            <CustomInput
              placeHolder="Search"
              type="text"
              onChange={handelOnchange}
              icon={<BiSearch />}
            />
          </div>
          <div className="notification relative">
            <div className="notif-count absolute z-10 text-white bg-red-500 rounded-[50%] w-[15px] h-[15px] text-xs p-0 m-0 flex justify-center items-center top-0 right-0">
              1
            </div>
            <MdOutlineNotifications className="text-4xl text-white font-bold" />
          </div>
          <div className="user flex justify-center items-center">
            <FaUserCircle className="text-4xl text-white font-bold" />
            <BsChevronDown className="text-xl text-white font-bold" />
          </div>
        </div>
        <div className="content debug h-[90%]">
          <Outlet />
          {console.log("outlet", <Outlet />)}
        </div>
      </div>
    </LayoutStyle>
  );
};

export default index;
