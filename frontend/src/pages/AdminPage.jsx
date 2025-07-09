import useAuthUser from "../hooks/useAuthUser";
import { getAllUsers } from "../lib/api";
import {useMutation, useQueryClient} from '@tanstack/react-query'

import TextField from "@mui/material/TextField";
import { useQuery} from "@tanstack/react-query";
import {useState } from 'react';

import SearchUser from "../components/SearchUser";

const AdminPage = () => {


    const {authUser,isLoading}=useAuthUser();
  
    const [inputText, setInputText] = useState("");

    const inputHandler = (e) => {
    let lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
    };

    const{data:allUsers}=useQuery({
      queryKey:['allUsers'],
      queryFn:getAllUsers,
      initialData:[],
    });
  
    


  return (
      <div className='p-5 sm-p-7 lg:p-9'>
        <div className='container space-y-10 '>
            <div className="search font-mono ">
              <TextField 
              className="font-mono"
                id="outlined-basic"
                variant="outlined"
                fullWidth
                onChange={inputHandler}
                label="Search"
              />
            </div>
          <div className="flex flex-1 items-center justify-center m-auto mt-4">


            {isLoading ? (
              <div className='flex justify-center py-12  '>
                <span className='loading loading-dots loading-lg '></span>
              </div>
            ) : (
              <>
               <section className="space-y-4 w-full "> 
                 
                  {inputText  ?
                  ( <SearchUser allUsers={allUsers} textInp={inputText}/>

                  ) : (
                    <SearchUser allUsers={allUsers} textInp={''}/>
                  )}   
                 
                </section>
              </>
            )}
           
          </div>
        </div>
      </div>
  )
}

export default AdminPage;