import { useNavigate, useParams } from "react-router"
import useAuthUser from "../hooks/useAuthUser"
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { useEffect } from "react";
import PageLoading from '../pages/PageLoading'
import toast from "react-hot-toast";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import '@stream-io/video-react-sdk/dist/css/styles.css';

const STREAM_API_KEY=import.meta.env.VITE_STREAM_API_KEY


const CallPage = () => {

  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();
  
  const {data:tokenData}=useQuery({
    queryKey:['streamToken'],
    queryFn:getStreamToken,
    enabled: !!authUser,
    retry:false
  });
  



  useEffect(()=>{

    const initCall= async ()=>{
      if(!tokenData?.token ||!authUser ||!callId) return;

      try {
        console.log('initializing Stream call client....');

        const user={
          id: authUser._id,
          name: ((authUser.firstName).concat(authUser.lastName)),
          image: authUser.profilePic,
        }

        const videoClient=new StreamVideoClient({
          apiKey:STREAM_API_KEY,
          user,
          token: tokenData.token,
        })

        const callInstance=videoClient.call('default',callId);

        await callInstance.join({create:true});

        console.log('joined call successfully');

        setClient(videoClient);
        setCall(callInstance);


      } catch (error) {
        console.log(error);
        toast.error('error in calling');
      } finally{
        setIsConnecting(false);
      }
    };

    initCall();

  },[tokenData,authUser,callId]);

  if(isLoading || isConnecting ) return <PageLoading/>;

    
  const CallContent = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    const navigate = useNavigate();

    if (callingState === CallingState.LEFT) return navigate("/");

    return (
      <StreamTheme>
        <SpeakerLayout />
        <CallControls />
      </StreamTheme>
    );
  };

 return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallPage;