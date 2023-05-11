import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function CheckMark() {
    const [checked, setChecked] = useState<boolean>(false);


 const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
 setChecked(event.target.checked);
 };

 const handleSubmit = () => {
 const data = {
    tfa: checked,
    };
    axios.put('http://localhost:3000/api/v1/user/' + Cookies.get('userid') + '/2fa'+ '?IsActive=' + checked,data,{ withCredentials: true })
    .catch(error => console.error(error));
    };

 return (
 <div>
    <input type="checkbox" checked={checked} onChange={handleChange} />
    <br />
    <button onClick={handleSubmit}>Submit</button>
 </div>
 );
}

export default CheckMark;