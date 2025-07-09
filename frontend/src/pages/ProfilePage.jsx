import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeProfile } from "../lib/api";
import {MapPinIcon} from 'lucide-react'

const ProfilePage = () => {

  const {authUser}=useAuthUser();
  const queryClient=useQueryClient();

  const [formState,setFormState]=useState({
    firstName:authUser?.firstName ||'',
    lastName:authUser?.lastName || '',
    bio:authUser?.bio ||'',
    location:authUser?.location ||'',
    profilePic:authUser?.profilePic ||'',
  });

  const {mutate:profileMutation,isPending}= useMutation({
    mutationFn:completeProfile,
    onSuccess:()=>{
      console.log("Mutation Success!"); 
      toast.success('PROFILE CREATED SUCCESSFULLY !');
      queryClient.invalidateQueries({queryKey:['authUser']});
    },
    onError:(error)=>{
      console.error("Mutation Error:", error);
      toast.error(error.response.data.message || "An error has occured");
    }
  });

  const handleSubmit=(e)=>{
    e.preventDefault();
    profileMutation(formState);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" data-theme="coffee">
      <div className="card w-full bg-secondary/30 max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4  text-base-content/100">

            <div className="flex flex-col items-center justify-center space-y-2 font-medium">
              <div className="flex flex-col items-center justify-center size-5 text-3xl font-bold mb-2 ">Profile</div>
              <div className="size-32 rounded-full bg-base-200 overflow-hidden mt-4">
                {formState.profilePic ? (
                  <img src={formState.profilePic} alt={formState.firstName} className="wjustify-center h-full object-cover" />
                 ): (
                  <div className="flex items-center justify-center h-full bg-base bg-base-content">
                    <div className="flex items-center justify-center text-5xl h-full text-violet-950">{formState.firstName.charAt(0)}</div>
                  </div>
                  ) }
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="lable-text">First Name</span>
                </label>
                <input type="text" className='input input-bordered w-full '  name="firstName" value={formState.firstName} onChange={(e)=>setFormState({...formState,firstName:e.target.value})}/>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="lable-text">Second Name</span>
                </label>
                <input type="text" className='input input-bordered w-full' name="lastName" value={formState.lastName} onChange={(e)=>setFormState({...formState,lastName:e.target.value})}/>
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="lable-text">Bio</span>
                </label>
                <input type="text" className='input input-bordered w-full' name="bio" value={formState.bio} onChange={(e)=>setFormState({...formState,bio:e.target.value})}/>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="lable-text">Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70'/>
                  <input type="text" className='input input-bordered w-full pl-10 ' name="location" placeholder="city" value={formState.location} onChange={(e)=>setFormState({...formState,location:e.target.value})}/>
                </div>
              </div>

              <button className="btn w-full btn-secondary" disabled={isPending} type="submit">
                {isPending?(
                  <>
                    <progress className="progress  w-56 size-5 mr-2"></progress>
                  </>
                ):(
                  <>                 
                   <div className='mr-3'>Complete Profile</div>
                  </>
                )}
              </button>       

            </div>
          </form>
        </div>

      </div>

    </div>
  )
}

export default ProfilePage