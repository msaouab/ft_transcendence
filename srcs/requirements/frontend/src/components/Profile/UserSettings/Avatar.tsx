import React, { useEffect, useState } from "react";
import axios from "axios";
import { Cookies, useCookies } from "react-cookie";
import JoinFileSvg from "../../../assets/joinFile.svg";
import DeleteSvg from "../../../assets/deleteSvg.svg";
import AvatarImg from "../../../assets/avatar.png";

function Avatar() {
  const cookie = new Cookies();
  const [cookies] = useCookies(["id"]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files) {
      const fileName = event.target.value.split("\\").pop();
      if (fileName) setFileName(fileName);
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    //id

    axios
      .post(
        "http://localhost:3000/api/v1/user/" + cookie.get("userid") + "/avatar",
        formData,
        { withCredentials: true }
      )
      .then((response) => {
        console.log("File uploaded successfully");
      })
      .catch((error) => {
        console.log("Error uploading file:", error);
      });
  };

  console.log(cookies.id);

  return (
    <div className="flex flex-col items-center gap-5">
      <img src={AvatarImg} alt="" width={200} />
      <form onSubmit={handleSubmit} className=" text-center mb-10">
        <label>
          <div className="border  rounded-md overflow-hidden h-[3rem] border-dashed border-gray-500 relative flex items-center bg-slate-300/10">
            <input
              accept="image/*"
              type="file"
              multiple
              className="cursor-pointer relative block opacity-0 w-full h-full  z-50"
              onChange={handleFileChange}
              name="file"
            />
            <div className="text-center   absolute top-0 right-0 left-0 m-auto">
              <div className="flex justify-center items-center ">
                {fileName ? (
                  <div className="flex justify-between items-center bg-[#EFEFEF] p-2 w-full h-[3rem] text-gray-800 ">
                    <p> {fileName}</p>

                    <img
                      className="z-[100] cursor-pointer hover:scale-110 transition-all ease-in-out duration-200"
                      src={DeleteSvg}
                      alt=""
                      onClick={() => setFileName("")}
                    />
                  </div>
                ) : (
                  <div className="flex justify-center gap-2 items-center  p-2 w-full h-[3rem]">
                    <img src={JoinFileSvg} alt="" />
                    <p>Upload your profile picture here</p>
                  </div>
                )}
                <h4> </h4>
              </div>
            </div>
          </div>
          {/* <input type="file" onChange={handleFileChange} accept="image/*" /> */}
        </label>
        <button
          type="submit"
          className="bg-cyan-800 py-2 px-4 mt-4 shadow-md shadow-white/10 hover:scale-105 transition-all ease-in-out duration-200 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Avatar;
