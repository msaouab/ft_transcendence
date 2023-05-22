import { Outlet } from "react-router-dom";
import styled from "styled-components";
import SideBar from "../../components/common/SideBar";
import DropDownMenu from "../../components/DropDownMenu";
import Notifications from "../../components/Notifications";
import SearchBar from "../../components/common/Search/SearchBar";

import { useEffect, useRef, useState } from "react";
import {io} from "socket.io-client";
import Cookies from "js-cookie";
import { useGlobalContext } from "../../provider/AppContext";
const index = () => {



const LayoutStyle = styled.div`
display: flex;
height: 100vh;
    /* height: 100vh;
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
  

    } */

  `;


  const notifySocket = useRef<any>(null);
  const [connected, setConnected] = useState(false);
  // const {setUserStatus} = useGlobalContext();

  useEffect(() => {
    if (!connected) {
      notifySocket.current = io("http://localhost:3000");
      setConnected(true);
      console.log("connected to the server notify");
    }
  
    notifySocket.current.on("disconnect", () => {
      notifySocket.current.emit('status', {id: Cookies.get('id'), userStatus: 'Offline'});
      console.log("disconnected from the server notify");
    });

  
  }, []);




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
            <DropDownMenu notifySocket={notifySocket} connected={connected} />
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
