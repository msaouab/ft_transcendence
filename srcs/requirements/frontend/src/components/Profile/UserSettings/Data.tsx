import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import CustomInput from "../../common/CustomInput";
import { HOSTNAME } from "../../../api/axios";
import toast, { Toaster } from "react-hot-toast";

const notify = (status: string) => {
  if (status === "success")
    toast.success("Profile information updated successfully!");
  else toast.error("Profile information update failed!");
};

interface FormData {
  login: string;
  firstName: string;
  lastName: string;
}

function Form() {
  const [formData, setFormData] = useState<FormData>({
    login: "",
    firstName: "",
    lastName: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const [user, printData] = useState({
    login: "",
    firstName: "",
    lastName: "",
  });
  useEffect(() => {
    const apiUrl = `http://${HOSTNAME}:3000/api/v1/me`;
    async function fetchData() {
      try {
        await axios
          .get(apiUrl, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.statusText) {
              printData(response.data);
            }
          })
          .catch((error) => {
            if (error.response.status == 401) {
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const defaultFormData: FormData = Object.entries(formData).reduce(
      (obj, [key, value]) => {
        if (!value) {
          obj[key as keyof FormData] = user[key as keyof FormData];
        } else {
          obj[key as keyof FormData] = value;
        }
        return obj;
      },
      {} as FormData
    );

    axios
      .put(
        `http://${HOSTNAME}:3000/api/v1/user/` +
          Cookies.get("userid") +
          "/update",
        defaultFormData,
        { withCredentials: true }
      )
      .then((response) => {
        if (response.statusText) {
          notify("success");
          setFormData({
            login: "",
            firstName: "",
            lastName: "",
          });
        }
      })
      .catch((error) => {
        notify(error.response.data.message);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-white flex flex-col items-center"
    >
      <h1 className="text-xl font-bold text-center mb-4">User Informations</h1>
      <div className="flex gap-10 flex-wrap justify-center">
        <label>
          <CustomInput
            type="text"
            name="login"
            value={formData.login}
            placeHolder="Login"
            onChange={handleInputChange}
          />
        </label>
        <label>
          <CustomInput
            type="text"
            name="firstName"
            placeHolder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </label>
        <label>
          <CustomInput
            placeHolder="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <button
        type="submit"
        className="bg-cyan-800 py-2 px-4 mt-4 shadow-md shadow-white/10 hover:scale-105 transition-all ease-in-out duration-200 rounded-md m-auto"
      >
        Submit
      </button>
    </form>
  );
}

export default Form;
