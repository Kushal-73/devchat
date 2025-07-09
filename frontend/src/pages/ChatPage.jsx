import { useParams } from "react-router"

import {getStreamToken} from '../lib/api';
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ChatLoader from '../components/ChatLoader';
import useAuthUser from "../hooks/useAuthUser";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react'

import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import CallButton from '../components/CallButton'

const STREAM_API_KEY=import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {
  const {id:targetUserId}=useParams();

  const [chatClient,setChatClient]=useState(null);
  const [channel,setChannel]=useState(null);
  const [loading,setLoading]=useState(true);

  const {authUser}=useAuthUser();

  const {data:tokenData}=useQuery({
    queryKey:['streamToken'],
    queryFn:getStreamToken,
    enabled: !!authUser,
  });

  useEffect(()=>{

    const initChat=async()=>{
        if(!tokenData?.token || !authUser) return ;

        try {
        console.log('initializing Stream chat client....');

        const client=StreamChat.getInstance(STREAM_API_KEY);
   
        await client.connectUser({
          id: authUser._id,
          name: ((authUser.firstName).concat(authUser.lastName)),
          image:authUser.profilePic
        },String(tokenData.token));

        const channelId=[authUser._id,targetUserId].sort().join('-');

        const currChannel=client.channel("messaging",channelId,{
          members:[authUser._id,targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
          
        } catch (error) {
          toast.error('cannot initialze chats Please try again');
          console.log(error)
          
        }finally{ 
          setLoading(false);
        }
     };
    initChat();
  },[tokenData,authUser,targetUserId]);

  const handleVideoCall=()=>{
    if(channel){
      const callId = [authUser._id, targetUserId].sort().join('-');

      const callURL=`${window.location.origin}/call/${callId}`;

      channel.sendMessage({
        text:`Come and join me on call . Join me here : ${callURL}`,
      });

      toast.success('Call Link sent successfully')
    }
  }

  if(loading || !chatClient || !channel) return <ChatLoader/>;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall}/>
            <Window>
              <ChannelHeader/>
              <MessageList/>
              <MessageInput focus/>
            </Window>
          </div>
          <Thread/>
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage;