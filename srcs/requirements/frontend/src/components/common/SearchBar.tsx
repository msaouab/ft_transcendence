import styled from 'styled-components';
import { CiSearch } from 'react-icons/ci';
const SearchBarStyle = styled.div`
    background:  rgba(217, 217, 217, 0.3);
    border-radius: 10px; 
    display: flex;
    height: 40px;
    max-height: 40px;
    padding: 10px;
    width: ${(props) => props.$width}%;
    max-width: 600px;
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
    align-self: center;
    color: #ffff;
}
`;

const SearchBar = () => {
    return (

        <SearchBarStyle $width={80} >
            <CiSearch className="search-icon" />
            <input type="text" placeholder="Search messages" />
        </SearchBarStyle >
    );
};


export default SearchBar;
