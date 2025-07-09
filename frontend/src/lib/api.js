import { axiosInstance } from "./axios";

export const signUp=async(signupData)=>{
      const res=await axiosInstance.post('/auth/signup',signupData);
      return res.data;
}

export const logIn=async(logInData)=>{
      const res=await axiosInstance.post('/auth/login',logInData);
      return res.data;
}

export const logOut=async()=>{
      const res=await axiosInstance.post('/auth/logout');
      return res.data;
}

export const getAuthUser=async() =>{
      try {
            const res =await axiosInstance.get('/auth/me');
            return res.data;
      } catch (error) {
            return null;
      }
}

export const completeProfile=async(userData)=>{
      const res=await axiosInstance.post('/auth/profile',userData);
      return res.data;
}


export const getUserFriends=async()=>{
      const res=await axiosInstance.get('/users/friends');
      return res.data;
}

export const getRecomendedUsers=async()=>{
      const res=await axiosInstance.get('/users');
      return res.data;
}

export const getOutgoingFriendReqs=async()=>{
      const res=await axiosInstance.get('/users/outgoing-friend-request');
      return res.data;
}

export const sendFriendRequest=async(userId)=>{
      const res=await axiosInstance.post(`/users/friend-request/${userId}`);
      return res.data;
}

export const getFriendRequests=async(userId)=>{
      const res=await axiosInstance.get(`/users/friend-requests`);
      return res.data;
}

export const acceptFriendRequest=async(requestId)=>{

      const res=await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
      return res.data;
}

export const getStreamToken=async()=>{
      
      const response=await axiosInstance.get('/chat/token');
      return response.data;
}

export const getAllUsers=async()=>{
      
      const response=await axiosInstance.get('/adminCrud/allUsers');
      return response.data;
}

export const banUser=async(userId)=>{
      
      const response=await axiosInstance.put(`/adminCrud/${userId}/ban`);
      return response.data;
}

export const unBanUser=async(userId)=>{
      
      const response=await axiosInstance.put(`/adminCrud/${userId}/unban`);
      return response.data;
}