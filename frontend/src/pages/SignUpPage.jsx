import React, { useState } from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {Link} from 'react-router';

import { signUp } from '../lib/api';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [signupData,setSignupData]=useState({
    firstName:'',
    lastName:'',
    email:'',
    password:'',
  });

  const queryClient=useQueryClient();

  const {mutate:signUpMutation,isPending,error}=useMutation({
    mutationFn:signUp,
    onSuccess:()=>{
      toast.success('Welcome Aboard');
      queryClient.invalidateQueries({queryKey:['authUser']})
    },
  });
 
  const handleSubmit=(e)=>{
    e.preventDefault();
    signUpMutation(signupData);
  }

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme='coffee'>
      <div className='border flex flex-col border-primary/100 lg:flex-row w-full max-w-2xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
        <div className='w-full lg:w-full p-5 sm:p-8 flex-col '>

          <div className='mb-4 flex items-center justify-start gap-2'>

            <span className='text-4xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide'>DevChat...../SIGNUP</span>

          </div>

        
            {error && (
              <div className='alert alert-error mb-4'>
                <span>{error.response.data.message}</span>  
              </div>
            )}
         
      
          <div className='w-full'>
            <form onSubmit={handleSubmit}>
              <div className='space-y-5'>

                  <div className='form-control w-full'>

                    <label className='label'>
                      <span className='lable-text'>First Name *</span>
                    </label>
                    <input type='text' className='input input-bordered w-full ' value={signupData.firstName} onChange={(e)=>setSignupData({...signupData,firstName: e.target.value})} required/>

                  </div>

                  <div className='form-control w-full'>
                    
                    <label className='label'>
                      <span className='lable-text'>Second Name</span>
                    </label>
                    <input type='text' className='input input-bordered w-full ' value={signupData.lastName} onChange={(e)=>setSignupData({...signupData,lastName: e.target.value})} />

                  </div>                 

                  <div className='form-control w-full'>
                    
                    <label className='label'>
                      <span className='lable-text'>Email *</span>
                    </label>
                    <input type='text' className='input input-bordered w-full ' value={signupData.email} onChange={(e)=>setSignupData({...signupData,email: e.target.value})} required/>

                  </div>

                  <div className='form-control w-full'>
                    
                    <label className='label'>
                      <span className='lable-text'>Password *</span>
                    </label>
                    <input type='password' className='input input-bordered w-full ' value={signupData.password} onChange={(e)=>setSignupData({...signupData,password: e.target.value})} required/>
                    <p className='text-xs opacity-70 mt-1'>Password must be 6 character long</p>

                  </div>

              </div>
              <button className='btn btn-secondary w-full ' type='submit'> {isPending ? <> <span className="loading loading-dots loading-xl"></span></>:"Create Account"}</button>
              <div className='text-center mt-5'>
                <p className='text-sm'>Already have an account?{' '}<Link to='/login' className='text-primary hover:underline'>LogIn</Link></p>

              </div>
            </form>
          </div>
          
        </div>
      </div>

    </div>
  )
}

export default SignUpPage;