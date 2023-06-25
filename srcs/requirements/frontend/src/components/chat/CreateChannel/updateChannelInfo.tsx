

import { AiOutlineCloseCircle } from "react-icons/ai";
import { useState } from "react";
import { Button, Dialog } from "@material-tailwind/react";
import "./style.scss";
import { MdDeleteOutline } from "react-icons/md";

const UpdateChannelInfo = () => {
  const [password, setPassword] = useState<string>("");
  return (
    <Dialog className="bg-[#6e6a6a] min-h-[15rem] flex flex-col" open handler={() => {
      console.log("hello");
    }}>
      <AiOutlineCloseCircle
        className="close-btn"
      />
      <div className="inputBox px-[2rem] flex justify-center items-center">
        <MdDeleteOutline className="text-4xl mr-[1rem] hover:text-red-500" />
        <input
          type="password"
          id="Channel name"
          placeholder="Channel name"
          required
          name="name"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /></div>
      <div className="px-[2rem] flex justify-center items-center">

        <Button className="btn !mx-[2rem]" disabled={password.length == 0}>update password</Button>
      </div>
    </Dialog>
  );
};

export default UpdateChannelInfo;
