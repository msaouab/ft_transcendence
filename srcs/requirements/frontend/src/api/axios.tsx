import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

export const GetAvatar = async () => {
  const res = await instance.get("/user/" + Cookies.get("userid") + "/avatar", {
    responseType: "blob",
  });
  return URL.createObjectURL(res.data);
};

export const PostAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  await instance
    .post("/user/" + Cookies.get("userid") + "/avatar", formData)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("Error uploading file:", error);
    });
};

export default instance;
