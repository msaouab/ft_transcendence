import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

export const GetAvatar = async () => {
  await instance.get("/user/" + Cookies.get("userid") + "/avatar", {
	responseType: "blob",
  }).then((res) => {
    return res;
  });
};

export default instance;
