import { useEffect, useState } from "react";
import instance from "../../api/axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function VerifyPage() {
    const [formData, setFormData] = useState({
        code: "",
    });

    const navigate = useNavigate();

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    console.log(formData);
    const number = formData.toString();
    instance
    .put(`/user/${Cookies.get("userid")}/2fa/verify`, {number})
    .then((response) => {
        if (response.status == 200) {
            navigate("/profile");
        }
    })
    .catch((error) => {
        console.log(error);
    }
    );
};

  
  return (
    <div className=" text-cyan-800">
        <h1>Verify Page</h1>
        <p>Please Enter the 6 digit code on your 2fa app </p>
        <form onSubmit={handleSubmit}>
        <input type="number" placeholder="Enter 6 digit code" onChange={(e:any)=>setFormData(e.target.value)}/>
        <button type="submit" >
            Submit
        </button>
        </form>
    </div>
  );
};

export default VerifyPage;
