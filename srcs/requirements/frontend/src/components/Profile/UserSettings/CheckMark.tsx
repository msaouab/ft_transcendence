import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Switch, Dialog } from "@material-tailwind/react";
import CustomInput from "../../common/CustomInput";

function CheckMark() {
  const [checked, setChecked] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setOpen(true);
  };

  const handleSubmit = () => {
    const data = {
      tfa: checked,
    };
    axios
      .put(
        `http://localhost:3000/api/v1/user/` +
          Cookies.get("userid") +
          "/2fa" +
          "?IsActive=" +
          checked,
        sixDigit,
        { withCredentials: true }
      )
      .catch((error) => console.error(error));
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);
  const [sixDigit, setSixDigit] = useState<string>("");
  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSixDigit(e.target.value);
  };

  return (
    <div className=" flex  flex-col gap-5  items-center p-4">
      <Switch color="blue" checked={checked} onChange={handleChange} />
      <br />
      <Dialog
        size="sm"
        open={open}
        handler={handleOpen}
        className="bg-blue-gray-50 flex flex-col justify-center items-center gap-5 p-5"
      >
        <h1 className="text-3xl text-gray-800">Scan the QR code</h1>
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example"
          alt="QR code"
        />
        <CustomInput
          placeHolder="Enter 6 digit"
          type="number"
          lenght={6}
          className="border border-r-gray-600"
          onChange={handelOnChange}
        />
        <button
          onClick={handleSubmit}
          className="bg-cyan-800 py-2 px-4 mt-4 shadow-md shadow-white/10 hover:scale-105 transition-all ease-in-out duration-200 rounded-md text-white"
        >
          Submit
        </button>
      </Dialog>
    </div>
  );
}

export default CheckMark;
