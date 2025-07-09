import { useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query';
import  {logIn} from '../lib/api'
import { Link } from 'react-router';
const LoginPage = () => {

  const [logInData,setLogInData]=useState({
    email:'',
    password:'',
  });

  const queryClient=useQueryClient();

  const {mutate:logInMutation,isPending,error}=useMutation({
    mutationFn:logIn,
    onSuccess:()=>{queryClient.invalidateQueries({queryKey:['authUser']})},


  })

  const handleSubmit=(e)=>{
    e.preventDefault();
    logInMutation(logInData);
  };


  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme='coffee'>
      <div className='border flex flex-col border-primary/100 lg:flex-row w-full max-w-2xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
        <div className='w-full lg:w-full p-5 sm:p-8 flex-col '>
          <div className='mb-4 flex items-center justify-start gap-2'>
            <span className='text-4xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide'>DevChat...../LOGIN</span>
          </div>
          {error && (
              <div className='alert alert-error mb-4 transition-opacity ease-in duration-700 opacity-100 hover:opacity-0'>
                <span>{error.response.data.message}</span>  
              </div>
            )}  
            
            <div className='w-full'>
              <form onSubmit={handleSubmit} >
                <div className='space-y-4'>

                  <div className='font-bold opacity-75'> Good to have you back!</div>
                  
                  <div className='form-control w-full'>

                    <label className='label'>
                      <span className='lable-text'>Email</span>
                    </label>
                    <input type='text' className='input input-bordered w-full ' value={logInData.email} onChange={(e)=>setLogInData({...logInData,email: e.target.value})} required/>

                  </div>

                  
                  <div className='form-control w-full'>
                    
                    <label className='label'>
                      <span className='lable-text'>Password </span>
                    </label>
                    <input type='password' className='input input-bordered w-full ' value={logInData.password} onChange={(e)=>setLogInData({...logInData,password: e.target.value})} required/>
                    <p className='text-xs opacity-70 mt-1'>Password must be 6 character long</p>

                  </div>

                  <button className='btn btn-secondary w-full ' type='submit'> {isPending ? <> <span className="loading loading-dots loading-xl"></span></>:"LOG IN"}</button>
                  
                  <div className='text-center mt-4'>
                    <p className='text-sm'>Don't have an account yet? {''}<Link to='/signup' className='text-primary hover:underline'>Create One</Link> Now</p>
                  </div>

                </div>
              </form>             
            </div>   
        </div>
      </div>
    </div>
  )
}

export default LoginPage;