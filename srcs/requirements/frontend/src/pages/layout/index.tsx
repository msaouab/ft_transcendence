import { Outlet } from "react-router-dom";
import CustomInput from "../../components/common/CustomInput";
// import { ReactComponent as SearchIcon } from '../../assets/icons/searchIcon.svg'
import styled from "styled-components";
import { BiSearch } from "react-icons/bi";
import SideBar from "../../components/common/SideBar";
import DropDownMenu from "../../components/DropDownMenu";
import Notifications from "../../components/Notifications";

const index = () => {
  const LayoutStyle = styled.div`
    display: flex;
    height: 100vh;
    /* @media (max-width: 1200px) {
      height: 100%;
    } */
  `;

  const handelOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <LayoutStyle>
      {/* {JSON.stringify(userAvatar)} */}
      <div className="md:w-[5rem] ">
        <SideBar />
      </div>
      <div className="main-content  w-full px-4  flex  flex-col ">
        <div className="header py-4 flex justify-end  gap-8 items-center ">
          <div className="search hidden md:block">
            <CustomInput
              placeHolder="Search"
              type="text"
              onChange={handelOnchange}
              icon={<BiSearch className="text-[#1E1D19]" />}
            />
          </div>
          <Notifications />
          <div className="user flex justify-center items-center  relative">
            <DropDownMenu />
          </div>
        </div>
        <div className="content  flex-1">
          <Outlet />
        </div>
      </div>
    </LayoutStyle>
  );
};

export default index;
