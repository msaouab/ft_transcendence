import { useEffect, useState } from "react";
import instance from "../../api/axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import verifyImg from "../../assets/verified.png";
import CustomInput from "../../components/common/CustomInput";

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
      .put(`/user/${Cookies.get("userid")}/2fa/verify`, { number })
      .then((response) => {
        if (response.status == 200) {
          navigate("/profile");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className=" text-cyan-800  h-screen flex justify-center items-center flex-col gap-10 text-white/90">
      <h1 className="text-4xl font-bold leading-10">Two Factor Auth </h1>
      <img src={verifyImg} alt="verify" width={200} />
      <p>Please Enter the 6 digit code on your 2fa app </p>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
        <CustomInput
          type="number"
          placeHolder="Enter 6 digit code"
          onChange={(e:any)=>setFormData(e.target.value)}
        />
        <button
          className="bg-cyan-800 py-2 px-4 mt-4 shadow-md shadow-white/10 hover:scale-105 transition-all ease-in-out duration-200 rounded-md text-blue-gray-50 text-lg max-w-[100px]"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default VerifyPage;
