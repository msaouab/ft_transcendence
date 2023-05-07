



import styled from "styled-components";
import { CiSearch, CiCircleRemove, CiLollipop, CiFaceMeh, CiChat2 } from "react-icons/ci";
import { Link } from "react-router-dom";

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
const DropdownSeachStyle = styled.div`
    background: rgba(217, 217, 217, 0.3);
    border-radius: 10px;
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-self: center;
    height: 300px;
    max-height: 300px;
    padding: 10px;
    width: 100%;
    max-width: 600px;
    color: #fff;
    transition: all 0.5 ease-in-out;
    background-color: rgba(255, 255, 255, 0.15); /* Adjust the opacity as needed */
    backdrop-filter: blur(5px); /* You may need vendor prefixes for some browsers */
    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1); /* Add some shadow for depth */
    flex-direction: column;
    // should be scrollable
    overflow-y: scroll;
    overflow-x: hidden;


`;

import { SearchBarStyle } from "./SearchBar";

const SearchBarFull = ({ fullScreenDropdown, searchBarRef }: { fullScreenDropdown: boolean, searchBarRef: any }) => {

    // console.log(searchResults);
    const [search, setSearch] = useState<string>('');
    // const [dropdown, setDropdown] = useState<boolean>(false);
    // const searchBarRef = useRef<HTMLDivElement>(null);
    // const [fullScreenDropdown, setFullScreenDropdown] = useState<boolean>(false);
    let [searchConnected, setSearchConnected] = useState<boolean>(false);
    let [searchResults, setSearchResults] = useState<any[]>([]);


    // connection to websocket
    let socket = useRef<any>(null);
    useEffect(() => {
        if (socket.current) {
            socket.current.on('disconnect', () => {
                setSearchConnected(false);
                console.log("disconnected");
                // console.log("searchResults", searchResults);
                // console.log("users:", searchResults['channels']);
                // console.log("messages:", searchResults['users']);
            }
            );
        }


        if (!fullScreenDropdown && searchConnected) {
            // console.log("disconnecting");
            socket.current.disconnect();
            setSearchConnected(false);
            // reset search results
            setSearchResults([]);
            setSearch('');
        }
        if ((fullScreenDropdown) && !searchConnected) {
            console.log("connecting");
            socket.current = io('http://localhost:3000/search');
            socket.current.on('connect', () => {
                setSearchConnected(true);

                console.log("connected");
            });
        }
    }, [fullScreenDropdown]);



    const handleSearch = (searchProp: string) => {
        console.log("Handle search")
        if (!searchConnected) {
            console.log("not connected");
            return null;
        }
        socket.current.on('searchInfo', (data: any) => {
            // console.log("searchInfo", data);
            setSearchResults(data);
        }
        );
        setSearch(searchProp);
        socket.current.emit("search", { search: searchProp, limit: 3 });        // console.log("search", searchProp });
    };
    const navigate = useNavigate();



    // const 
    return (

        // {
        fullScreenDropdown && (
            <DropdownSeachStyle className="full-screen-dropdown-search" ref={searchBarRef}>
                <SearchBarStyle className="full-screen-search-bar w-full">
                    <div className="search-bar-container flex flex-row items-center gap-4 w-full border-zinc-900">
                        <div className="search-bar-icon">
                        </div>
                        <div className="search-bar-input flex flex-row items-center gap-4 w-full">
                            <div className="search-bar-search-icon">
                                <CiSearch
                                    className="search-icon"
                                    size={30}
                                // onClick={() => setFullScreenDropdown(false)}
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="Search"
                                className="text-base font-bold text-zinc-800 text-left outline-none "
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <div className="search-bar-search-icon">
                            <CiCircleRemove
                                className="close-icon"
                                size={30}
                                onClick={() => setSearch('')}
                            />


                        </div>
                    </div>

                </SearchBarStyle>
                <div className="mt-5 w-full h-full">

                    {
                        !searchResults['users'] && !searchResults['channels'] && (
                            <div className="search-results-none-message flex flex-col mt-5 items-center w-ful h-full">
                                <h1
                                    className="text-2xl font-bold text-black-500 w-9/12 text-center" > type something it doesn't have to make sense.
                                </h1>
                                <CiLollipop className="search-icon" size={50} color='#ffff' opacity={1} />

                            </div>
                        )
                    }
                    {
                        searchResults['users'] && searchResults['users'].length === 0 &&
                            searchResults['channels'] && searchResults['channels'].length === 0 ? (
                            <div className="search-results-none-message flex flex-col mt-5 items-center w-ful h-full">
                                <h1 className="text-2xl font-bold text-black-500 w-9/12 text-center" > Nope, can't find it. Did you check under the couch. </h1>
                                <CiFaceMeh className="face-meh-icon" size={50} />

                            </div>
                        ) : null
                    }


                    <div className="search-results">
                        {
                            searchResults['users'] && searchResults['users'].length > 0 ? (
                                <div className="search-results-header flex flex-row items-center w-full justify-between">
                                    <h1 className="text-base font-bold text-zinc-800 w-9/12 text-left">People</h1>
                                    <div className="search-see-more  gap-2 cursor-pointer hover:text-zinc-900 self-end">
                                        <Link
                                            to={`/search?entity=users&keyword=${search}`}
                                            className="text-sm font-bold text-zinc-800 text-left w-full hover:text-zinc-900 underline ml-4"
                                        >See more</Link>
    
                                    </div>
                                </div>

                            ) : null
                        }
                        {

                            searchResults['users'] && searchResults['users'].map((user: any) => {
                                return (

                                    <div className="search-result flex flex-row jusotfy-between items-center gap-4 py-0.5 w-full rounded-lg">
                                        <div className="search-result-avatar w-full rounded-lg transition duration-200 ease-in-out hover:bg-[rgba(0,0,0,0.1)] cursor-pointer py-2">
                                            <Link to={`/user/${user.id}`} className="flex flex-row justify-between items-center gap-4 w-full ">
                                                {/* change later */}
                                                {/* <img src={user.avatar} alt="avatar" /> */}
                                                <div className="flex flex-row flex-start items-center gap-4 w-full">

                                                    <img src="https://www.w3schools.com/howto/img_avatar.png" alt="avatar" className="rounded-full w-10 h-10 ml-3" />
                                                    {/* </div> */}
                                                    <div className="search-result-info ">
                                                        <h1
                                                            className="text-xl font-bold "
                                                        >{user.login}</h1>
                                                        <p
                                                            className="text-zinc-900"
                                                        >{user.firstName} {user.lastName}</p>
                                                    </div>
                                                </div>
                                                <div className="chat-button flex justify-center items-center mr-1">
                                                    <a href={`/chat/${user.id}`} className="chat-button drop-shadow-2xl rounded-full p-2 hover:bg-[#27272a] hover:text-white">
                                                        <CiChat2 className="chat-icon " size={30} />
                                                    </a>

                                                </div>

                                            </Link>
                                        </div>
                                    </div>
                                )
                            })


                        }

                        {
                            searchResults['channels'] && searchResults['channels'].length > 0 ? (

                                <div className="search-results-header mt-3 flex flex-row items-center w-ful justify-between" >
                                    <h1

                                        className='text-base font-bold text-zinc-800 w-9/12 text-left'
                                    >Channels</h1>

                                    <div className="search-see-more flex flex-row flex-end gap-2 cursor-pointer hover:text-zinc-900">
                                        <Link
                                            to={`/search?entity=channels&keyword=${search}`}
                                            className="text-sm font-bold text-zinc-800 text-left w-full hover:text-zinc-900 underline ml-4"
                                        >See more</Link>
                                    </div>
                                </div>
                            ) : null
                        }
                        {
                            searchResults['channels'] && searchResults['channels'].map((channel: any) => {
                                return (

                                    <div className="search-result flex flex-row jusotfy-between items-center gap-4 py-0.5 w-full rounded-lg">
                                        <div className="search-result-avatar w-full rounded-lg transition duration-200 ease-in-out hover:bg-[rgba(0,0,0,0.1)] cursor-pointer py-2">
                                            <Link to={`/user/${channel.id}`} className="flex flex-row flex-start items-center gap-4 w-full">
                                                <div className="search-result-avatar">
                                                    {/* change later */}
                                                    {/* <img src={channel.avatar} alt="avatar" className="rounded-full w-10 h-10" /> */}
                                                    <img src="https://www.w3schools.com/howto/img_avatar.png" alt="avatar" className="rounded-full w-10 h-10 ml-3" />
                                                </div>
                                                <div className="search-result-info">
                                                    <h1
                                                        className="text-xl font-bold "
                                                    >{channel.name}</h1>
                                                    <p
                                                        className="text-zinc-900"
                                                    > {channel.chann_type}</p>
                                                </div>

                                            </Link>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

            </DropdownSeachStyle>
        )
    )
}


export default SearchBarFull;