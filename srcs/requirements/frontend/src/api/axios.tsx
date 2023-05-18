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

export const fetchRankData = async () => {
  const res = await instance.get(
    "/User/" + Cookies.get("userid") + "/rankData"
  );
  return res.data;
};

export const fetchUserData = async () => {
  const res = await instance.get("/me");
  return res.data;
};

export const FetchUsersFriends = async () => {
  const res = await instance.get("/user/" + Cookies.get("userid") + "/friends");
  return res.data;
};

export const Logout = async () => {
  await instance.get("/logout").catch((error) => {
    if (error.response.status == 401) {
      navigate("/login");
    }
  });
};

export default instance;
