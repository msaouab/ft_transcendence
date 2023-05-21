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

export const getFriendsInfo = async (id:string) => {
  try {
    const res = await instance.get("/user/" + id + "/friends/info");
    return res.data;
  }
  catch (err) {
    console.log(err);
  }
}

export const getChannels = async (id:string) => {
  try {
    const res = await instance.get("/User/" + id + "/channels");
    return res.data;
  }
  catch (err) {
    console.log(err);
  }
}

export const getAchivements = async (id:string) => {
  try {
    const res = await instance.get("/achivements/" + id);
    return res.data;
  }
  catch (err) {
    console.log(err);
  }
}



export const getRankData = async (id:string) => {
  try {
    const res = await instance.get("/user/" + id + "/rankData");
    return res.data;
  }
  catch (err) {
    console.log(err);
  }
}

export const getUserInfo = async (id:string) => {
  try {
    const res = await instance.get("/User/" + id );
    return res.data;
  }
  catch (err) {
    console.log(err);
  }
}

export default instance;
