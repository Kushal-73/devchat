import {useMutation, useQueryClient} from '@tanstack/react-query'

import { useQuery} from "@tanstack/react-query";
import { getUserFriends,getRecomendedUsers ,getOutgoingFriendReqs,sendFriendRequest} from '../lib/api';
import { useEffect, useState } from 'react';
import useAuthUser from "../hooks/useAuthUser"
import FriendCard from '../components/FriendCard';
import { CheckCircleIcon,Frown, MapPinCheck, UserPlus2 } from 'lucide-react';

const HomePage = () => {

  const {authUser}=useAuthUser();

  const queryClient=useQueryClient();
  const [outgoingRequestsId,setOutgoingRequesgtId]=useState(new Set())

  const {data:friends=[],isLoading:loadingFriends}=useQuery({
    queryKey:['friends'],
    queryFn: getUserFriends
  });

  const {data:recomendenUsers=[],isLoading:loadingUsers}=useQuery({
    queryKey:['users'],
    queryFn: getRecomendedUsers
  });

  const {data:outgoingFriendReqs}=useQuery({
    queryKey:['outgoingFriendReqs'],
    queryFn:getOutgoingFriendReqs
  });

  const {mutate:sendRequestMutation,isPending}=useMutation({
    mutationFn:sendFriendRequest,
    onSuccess:()=> queryClient.invalidateQueries({queryKey:['outgoingFriendReqs']})
  });

  useEffect(()=>{
    const outgoingIds=new Set()
    if(outgoingFriendReqs && outgoingFriendReqs.length >0){
      outgoingFriendReqs.forEach((req)=>{
        outgoingIds.add(req.recipient._id);
      })
      setOutgoingRequesgtId(outgoingIds);
    }
  },[outgoingFriendReqs]);

    return (
    <div className='p-5 sm-p-7 lg:p-9 '>
      <div className='container space-y-10'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h3 className='text-4xl font-bold sm:text-5xl tracking-tight font-mono bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 pb-2 transition-all duration-300 hover:tracking-normal drop-shadow-md'>Welcome : {authUser.firstName}</h3>
        </div>
        <h2 className='font-semibold text-2xl sm:text-3xl tracking-tight text-gray-950 dark:text-gray-100 pb-1 border-b-2 border-gray-200 dark:border-gray-700 '>Friends </h2>
      </div>

    
        <div className='backdrop-brightness-125'>
          {loadingFriends?(
            <div className='flex justify-center py-6  '>
              <span className='loading loading-dots loading-lg '></span>
            </div>
          ): friends.length==0 ? (
            <div className='flex flex-col items-center bg-clip-text text-transparent  text-zinc-600 py-4'>
              <h2 className='text-2xl sm:text-3xl'>Missing friends</h2>
              <p className='opacity-75'>start your journey now</p>
            </div>
            
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 '>
              {friends.map((friend)=>(
                <FriendCard key={friend._id} friend={friend}/>
              ))}
            </div>
          ) }
        </div>

        <section className='mt-5 flex-1 min-h-0 flex flex-col'>
          <div className='mb-6 sm:mb-3'>
            <div className='flex-row sm:flex-row items-start sm:items-center justify-between gap-4'>
                <h2 className='font-semibold text-2xl sm:text-3xl tracking-tight text-gray-950 dark:text-gray-100 pb-1 border-b-2 border-gray-200 dark:border-gray-700 '>Explore </h2>
                <p className='opacity-75 text-stone-400'>: Make new Contacts  </p>
            </div>
          </div>

          <div className='min-h-0 backdrop-brightness-125 '>
            {loadingUsers?(
              <div className='flex justify-center py-6  '>
               <span className='loading loading-dots loading-lg '></span>
              </div>
              ): recomendenUsers.length===0 ? (
              <div className='flex flex-col items-center bg-clip-text text-transparent  text-zinc-600 py-4'>
                <h2 className='text-2xl sm:text-3xl'>No Contacts available</h2>
                <Frown className='mt-3 size-40 opacity-75 ' />
              </div>
          
              ) : (
              <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 '>
                {recomendenUsers.map((user)=>{
                  const hasRequestBeenSent=outgoingRequestsId.has(user._id);              
                  return(
                    <div key={user._id} className='card m-4 bg-base-200 hover:shadow-lg  transition-all duration-300'>
                      <div className='card-body p-5 space-y-4'>
                        <div className='flex items-center gap-3'>
                          <div className='avatar size-16 sm:size-14 rounded-full'>
                            <img src={user.profilePic} alt={user.firstName.charAt(0)} />
                          </div>

                          <div>
                            <h3 className='font-semibold text-lg'>{(user.firstName).concat(user.lastName)}</h3>
                            {user.location && (
                              <div className='flex items-center text-xs opacity-75 mt-1'>
                                <MapPinCheck className='size-6 '/>{(user.location.length >10)?(user.location.substring(0, 7).concat('..')):(user.location)}
                              </div>
                            )}

                          </div>
                        </div>
                        {user.bio && <p className='text-sm opacity-70'>{user.bio}</p>}

                        <button onClick={()=>sendRequestMutation(user._id)} disabled={hasRequestBeenSent || isPending} className={` btn w-full mt-2 ${hasRequestBeenSent? 'btn-disabled':'btn-primary'} ` }>
                          {hasRequestBeenSent ? (<>
                            <CheckCircleIcon className='size-4 mr-2'/>Request Sent
                          </>) : (
                            <>
                              <UserPlus2 className='size=4 mr-2'/>Send Friend Request
                            </>
                          )}
                        </button>

                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </section>

    

    </div>
  )
}

export default HomePage;