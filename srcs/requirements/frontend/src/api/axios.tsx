import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

export const GetAvatar = async (id: string) => {
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

export const getFriendsInfo = async (id: string) => {
  try {
    const res = await instance.get("/user/" + id + "/friends/info");
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getChannels = async (id: string) => {
  try {
    const res = await instance.get("/User/" + id + "/channels");
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getAchivements = async (id: string) => {
  try {
    const res = await instance.get("/achivements/" + id);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getRankData = async (id: string) => {
  if (id === "") {
    return;
  }
  try {
    const res = await instance.get("/user/" + id + "/rankData");
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getUserInfo = async (id: string) => {
  if (id === "") {
    return;
  }
  try {
    const res = await instance.get("/User/" + id);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const addFriend = async (id: string, receiver_id: string) => {
  if (id === receiver_id || receiver_id === "" || id === "") {
    return;
  }
  try {
    const res = await instance.post("/user/" + id + "/invites", {
      receiver_id,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const blockThisUser = async (id: string, blockedUser_id: string) => {
  if (id === blockedUser_id || blockedUser_id === "" || id === "") {
    return;
  }
  try {
    const res = await instance.post("/user/" + id + "/blockedusers", {
      blockedUser_id,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const unblockThisUser = async (id: string, blockedUser_id: string) => {
  if (id === blockedUser_id || blockedUser_id === "" || id === "") {
    return;
  }
  try {
    const res = await instance.delete(
      "/user/" + id + "/blockedusers/" + blockedUser_id
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const RemoveThisFriendInvite = async ( id: string, receiver_id: any) => {
  if (id === receiver_id || receiver_id === "" || id === "") {
    return;
  }
  try {
    const res = await instance.delete("/user/" + id + "/invites", {
      data: { receiver_id },
    });
    return res.data;
  } catch (err) {

    console.log(err);
  }
};




export const isFriend = async (id: string, receiver_id: string) => {
  if (id === receiver_id || receiver_id === "" || id === "") {
    return;
  }
  try {
    const res = await instance.get("/User/" + id );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const isBlocked = async (id: string, receiver_id: string) => {
  if (id === receiver_id || receiver_id === "" || id === "") {
    return;
  }
  try {
    const res = await instance.get("/user/" + id + "/is-blocked/" + receiver_id);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

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

export const GetChannelMessages = async (id: string, limit: number, offset: number) => {
  try {
    const res = await instance.get("/Channels/" + id + "/messages?limit=" + limit + "&offset=" + offset);
    return res.data;
  }
  catch (err) {
    console.log(err);
  }
}

export const GetChannelInfo = async (id: string) => {
  try {
    const res = await instance.get("/Channels/" + id + "/info");
    return res.data;
  }
  catch (err) {
    console.log(err);
  }
}

export default instance;
