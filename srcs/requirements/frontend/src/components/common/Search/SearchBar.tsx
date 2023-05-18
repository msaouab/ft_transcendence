import styled from 'styled-components';
import { CiSearch, CiFaceMeh, CiLollipop, CiChat2, CiCircleRemove } from 'react-icons/ci';
import { useState, useRef, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import cmdKeyIcon from '../../../assets/cmdkey.png'
import kKeyIcon from '../../../assets/kkey.png'
import { Link, useNavigate } from 'react-router-dom';
import SearchBarFull from './SearchBarFull';
import TmpChatBox from './TmpChatBox';
import Cookies from 'js-cookie';
// import {use}
export const SearchBarStyle = styled.div`
    background:  rgba(217, 217, 217, 0.3);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 45px;
    max-height: 45px;
    padding: 10px;
    width: ${(props) => props.$width}%;
    margin: 0 auto;
    color: #fff;
    input {
    background-color: transparent;
    border: none;
    flex: 1;
    margin-left: 10px;
}
input:focus {
    outline: none;
}
.search-icon {
    // width: 30px;
    align-self: center;
    color: #ffff;
    cursor: pointer;
    opacity: 0.5;
    min-width: 30px;
}

.shortcuts-icons {
    display: flex;
    justify-content: center;

    align-self: center;
    color: #ffff;
    cursor: pointer;
    margin-left: 10px;
    width: auto;
        img.cmdkey-icon {
        width: 23px;
        height: 23px;
    }

    img.kkey-icon {
        width: 20px;
        height: 20px;
    }
    opacity: 0.5;
}

    @media (max-width: 768px) {

        width: 40px;
        height: 40px;
        margin-left: 0;
        padding: 0;
        background-color: white;
        font-weight: bold;
        input {

    

            width: 100%;
            &::placeholder {
                opacity: 0;
            }
        }
        .search-icon {
            display: flex;
            justify-content: center;
            align-self: center;
            color: #000;
            cursor: pointer;
            margin: 0 auto;
            margin-left: 10px;
        }
        
        .shortcuts-icons {
            display: none;
        }


    }



`;


const InlineDropdownSeachStyle = styled.div`
background: rgba(217, 217, 217, 0.3);
border-radius: 10px;

position: absolute;
z-index: 2;
top: calc(50% + 30px);
display: flex;
align-self: center;
height: 300px;
max-height: 300px;
padding: 10px;
width: ${(props) => props.$width}%;
max-width: 600px;
color: #fff;
transition: all 0.5s ease-in-out;
/* Add these properties for the glassy effect */
background-color: rgba(255, 255, 255, 0.15); /* Adjust the opacity as needed */
backdrop-filter: blur(5px); /* You may need vendor prefixes for some browsers */
box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1); /* Add some shadow for depth */
`;



const SearchResultsStyle = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // border: 1px solid #fff;
    width: 100%;   
    height: 100%;
    overflow-y: scroll;


    @media (max-width: 768px) {
        display: none;
    }
`;



const SearchBar = () => {
    const [search, setSearch] = useState<string>('');
    const [dropdown, setDropdown] = useState<boolean>(false);
    const searchBarRef = useRef<HTMLDivElement>(null);
    const [fullScreenDropdown, setFullScreenDropdown] = useState<boolean>(false);
    let [searchConnected, setSearchConnected] = useState<boolean>(false);
    let [searchResults, setSearchResults] = useState<any[]>([]);
    const [tmpChatData, setTmpChatData] = useState({});
    const [showTempChat, setShowTempChat] = useState<boolean>(false);

    const handleTempChat = (user: any) => {
        setShowTempChat(true);
        setTmpChatData(user);
    }


    // connection to websocket
    let socket = useRef<any>(null);

    useEffect(() => {
        if (socket.current) {
            socket.current.on('disconnect', () => {
                setSearchConnected(false);
            }
            );
        }


        if ((dropdown || fullScreenDropdown) && !searchConnected) {
            socket.current = io('http://localhost:3000/search');

            socket.current.on('connect', () => {
                setSearchConnected(true);
                // console.log("connected");
            });
        }
    }, [dropdown, fullScreenDropdown]);

    // shortcut handler
    const handleKeyPress = useCallback((event: any) => {
        // check if the user pressed Ctrl + S
        if (event.key === "k" && event.metaKey) {
            setFullScreenDropdown(true);
            setDropdown(false);
        }
        if (event.key === "Escape") {
            setShowTempChat(false);
            setFullScreenDropdown(false);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
            // disconnect from websocket
            if (searchConnected) {
                socket.current.disconnect();
                setSearchConnected(false);
            }

        }

    }, []);

    useEffect(() => {
        // attach the event listener to the document
        document.addEventListener("keydown", handleKeyPress);
        // remove the event listener when the component is unmounted
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);


    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setDropdown(false);
                setFullScreenDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchBarRef]);


    const handleSearch = (searchProp: string) => {
        console.log("Handle search")
        if (!searchConnected) {
            console.log("not connected");
            return null;
        }
        socket.current.on('searchInfo', (data: any) => {
            setSearchResults(data);
        }
        );
        setSearch(searchProp);
        socket.current.emit("search", { search: searchProp, limit: 3 });        // console.log("search", searchProp });
    };
    const handleDropdown = () => {
        setDropdown(!dropdown);
    };


    const navigate = useNavigate();
    return (
        <div>
            <div className="flex flex-col justify-center items-center gap-4 w-full max-w-3xl relative ">
                <SearchBarStyle $width={90} className="search-bar" ref={searchBarRef}>

                    <CiSearch className="search-icon" size={30}
                        onClick={() => window.innerWidth < 768 ? setFullScreenDropdown(true) : setDropdown(true)}
                    />
                    <form className="flex flex-row justify-between w-full" onSubmit={(e) => {
                        e.preventDefault();
                        navigate(`/search?entity=all&keyword=${search}`);

                    }}>
                        <input type="text" placeholder="Search messages" onChange={(e) => handleSearch(e.target.value)} onClick={handleDropdown} />
                    </form>
                    {
                        dropdown && (
                            <InlineDropdownSeachStyle $width={90} className="dropdown-search" ref={searchBarRef}>
                                <SearchResultsStyle >
                                    {
                                        !searchResults['users'] && !searchResults['channels'] && (
                                            <div className="search-results-none-message flex flex-col mt-5 items-center w-ful h-full">
                                                <h1 className="text-2xl font-bold text-black-500 w-9/12 text-center">type something it doesn't have to make sense.
                                                </h1>
                                                <CiLollipop className="search-icon" size={50} color='#ffff' opacity={1} />
                                            </div>
                                        )
                                    }
                                    {
                                        searchResults['users'] && searchResults['users'].length === 0 &&
                                            searchResults['channels'] && searchResults['channels'].length === 0 ? (
                                            <div className="search-results-none-message flex flex-col mt-5 items-center w-ful h-full">
                                                <h1
                                                    className="text-2xl font-bold text-black-500 w-9/12 text-center"
                                                > Nope, can't find it. Did you check under the couch. </h1>
                                                <CiFaceMeh className="face-meh-icon" size={50} />

                                            </div>
                                        ) : null
                                    }

                                    <div className="search-results">
                                        {
                                            searchResults['users'] && searchResults['users'].length > 0 ? (
                                                <div className="search-results-header flex flex-row items-center w-full">
                                                    <h1 className="text-base font-bold text-zinc-800 w-9/12 text-left justify-between" > People</h1>
                                                    <div className="search-see-more flex flex-row flex-end gap-2 cursor-pointer hover:text-zinc-900">
                                                        <a className="text-sm font-bold text-zinc-800 text-left w-full hover:text-zinc-900 underline ml-4" >See more</a>
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
                                                                        <h1 className="text-xl font-bold ">{user.login}</h1>
                                                                        <p className="text-zinc-900" >{user.firstName} {user.lastName}</p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                        { user.id === Cookies.get('id') ? null :
                                                        <div className="chat-button flex justify-center items-center mr-1">
                                                            <a className="chat-button drop-shadow-2xl rounded-full p-2 hover:bg-[#27272a] hover:text-white" onClick={(e) => {
                                                                e.preventDefault();
                                                                handleTempChat(user);
                                                            }}>
                                                                <CiChat2 className="chat-icon " size={30} />
                                                            </a>
                                                        </div>
                                            }

                                                    </div>
                                                )
                                            })
                                        }
                                        {
                                            searchResults['channels'] && searchResults['channels'].length > 0 ? (
                                                <div className="search-results-header mt-3 flex flex-row items-center w-ful justify-between">
                                                    <h1 className='text-base font-bold text-zinc-800 w-9/12 text-left' >Channels</h1>

                                                    <div className="search-see-more flex flex-row flex-end gap-2 cursor-pointer hover:text-zinc-900">
                                                        <Link to={`/search?entity=channels&keyword=${search}`} className="text-sm font-bold text-zinc-800 text-left w-full hover:text-zinc-900 underline ml-4" >See more</Link>
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
                                                                    <h1 className="text-xl font-bold ">{channel.name}</h1>
                                                                    <p className="text-zinc-900" > {channel.chann_type}</p>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </SearchResultsStyle>
                            </InlineDropdownSeachStyle>
                        )
                    }
                    <div className='shortcuts-icons'>
                        <img src={cmdKeyIcon} alt="cmd" className="cmdkey-icon" />
                        <img src={kKeyIcon} alt="k" className="kkey-icon" />
                    </div>
                </SearchBarStyle >
            </div >

            {
                fullScreenDropdown &&
                <SearchBarFull fullScreenDropdown={fullScreenDropdown} searchBarRef={searchBarRef} key={search} handleTempChat={handleTempChat} />
            }


            {/* there should be  */}
            {showTempChat == true &&

                <TmpChatBox showTempChat={showTempChat} setShowTempChat={setShowTempChat} user={tmpChatData} key={tmpChatData} />
            }


        </div >
    );
};


export default SearchBar;
