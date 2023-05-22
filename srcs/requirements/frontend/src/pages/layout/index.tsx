import { Outlet } from "react-router-dom";
import styled from "styled-components";
import SideBar from "../../components/common/SideBar";
import DropDownMenu from "../../components/DropDownMenu";
import Notifications from "../../components/Notifications";
import SearchBar from "../../components/common/Search/SearchBar";




const index = () => {



const LayoutStyle = styled.div`
display: flex;
height: 100vh;
  `;



  return (
    <LayoutStyle className=" px-1 md:px-5">
      <div className="md:w-[5rem] ">
        <SideBar />
      </div>
      <div className="main-content w-full ">
        <div className="header flex justify-end  gap-8 items-center  h-[10%]  max-h-[80px]
        ">
          <div className="search">
            <SearchBar />
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
