import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Switch, Dialog } from "@material-tailwind/react";
import CustomInput from "../../common/CustomInput";
import instance from "../../../api/axios";
import { useGlobalContext } from "../../../provider/AppContext";

function CheckMark() {
  const { isTfaEnabled, setIsTfaEnabled } = useGlobalContext();
  const [checked, setChecked] = useState(isTfaEnabled);
  const handleChange = (e:any) => {
    setOpen(true);
    setChecked(e.target.checked);
  };
  const [checkChanged, setCheckChanged] = useState(false);

  useEffect(() => {
  }, [checkChanged]);


  const [sixDigit, setSixDigit] = useState<string>("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const number = sixDigit.toString();
    axios
      .put(
        "http://localhost:3000/api/v1/user/" +
          Cookies.get("userid") +
          "/2fa/verify",
        { number },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.status === 200) {
          console.log("2fa enabled");
          setIsTfaEnabled(checked);
        }
      })
      .catch((error) => console.error(error));
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);
  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSixDigit(e.target.value);
  };

  const [qrCode, setQrCode] = useState("");
  const GetQRCode = async () => {
    await instance
      .get("user/" + Cookies.get("userid") + "/2fa/qrcode", {
        withCredentials: true,
      })
      .then((response) => {
        setQrCode(response.data);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    GetQRCode();
  }, []);


    
    
    return (
      <div className=" flex  flex-col gap-5  items-center p-4">
      
      <Switch color="blue" checked={checked} onChange={handleChange} />
      {/* {ReturnAppropriateSwitch()} */}
      <br />
      <Dialog
        size="sm"
        open={open}
        handler={handleOpen}
        className="bg-blue-gray-50 flex flex-col justify-center items-center gap-5 p-5"
      >
        <form onSubmit={handleSubmit}>
          <h1 className="text-3xl text-gray-800 text-center">
            Scan the QR code
          </h1>
          <div
            className="p-6 bg-white rounded-md mb-3"
            dangerouslySetInnerHTML={{ __html: qrCode }}
          />
          <CustomInput
            name="2fa-code"
            placeHolder="Enter 6 digit"
            type="number"
            lenght={6}
            className="border border-r-gray-600"
            onChange={handelOnChange}
          />
          <button
            type="submit"
            className="bg-cyan-800 py-2 px-4 mt-4 shadow-md shadow-white/10 hover:scale-105 transition-all ease-in-out duration-200 rounded-md text-white m-auto w-full"
          >
            Submit
          </button>
        </form>
      </Dialog>
    </div>
  );
}

export default CheckMark;
