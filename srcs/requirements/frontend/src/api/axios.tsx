import axios from "axios";
import Cookies from "js-cookie";



const instance =  axios.create({
  baseURL: "http://localhost:3000/api/v1", 
  withCredentials: true,
}) 


export const GetAvatar = async (id:string) => {
  const res = await instance.get("/user/" + id + "/avatar", {
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

export const PostChannelAvatar = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  await instance
    .post("/Channels/uploadAvatar", formData)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const CreateChannel = async (channel: any) => {
  const res = await instance.post("/Channels/create", channel).then((response) => {
    return response;
  }).catch((error) => {
    throw error;
  });
  return res.data;
}

export const GetJoindChannels = async (id: string) => {
  try {
    const res = await instance.get("/User/" + id + "/channels");
    return res.data;
  }
  catch (err) {
    console.log(err);
  }
}
export default instance;
