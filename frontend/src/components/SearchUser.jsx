import { useMutation } from '@tanstack/react-query';
import { MapPinCheck ,OctagonX ,BadgePlus} from 'lucide-react';
import { banUser,unBanUser } from "../lib/api";

const SearchUser = (prop) => {
 
    const filterData=(prop.allUsers).filter((member)=>{
          if(prop?.textInp === '') return member;
        else{
            return ((member.firstName).concat(member.lastName)).toLowerCase().includes(prop?.textInp);
        }
    });


    const {mutate:banUserMutation}=useMutation({
          mutationFn: banUser,
          onSuccess:()=>{

          queryClient.invalidateQueries({queryKey:['allUsers']});
          },
    });
    
    const {mutate:unBanUserMutation}=useMutation({
          mutationFn: unBanUser,
          onSuccess:()=>{

          queryClient.invalidateQueries({queryKey:['allUsers']});
          },
    });

  
  return (
    <div>
        <div className=" space-y-3  ">
             <h2 className='font-semibold text-2xl sm:text-3xl tracking-tight text-gray-950 dark:text-gray-100 '>USERS  <span className="indicator-item badge badge-secondary text-lime-600">{filterData?.length}</span> </h2>
                    {filterData?.map((user)=>{
                    
                      return(
                       <div key={user?._id} className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="card-body p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 relative">
                                <div className="avatar w-14 h-14 rounded-full bg-base-300">
                                  <img src={user?.profilePic} alt={user?.firstName} />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{(user?.firstName).concat(user?.lastName+'  ')}</h3>
                                </div>
                                <div>
                                  {user?.location && (
                                  <div className='flex items-center text-xs opacity-75 mt-1'>
                                  <MapPinCheck className='size-6 '/>{(user.location.length >10)?(user.location.substring(0, 7).concat('..')):(user.location)}
                                  </div>
                                  )}
                                </div>
                              </div>
                             
                              <div className=" mr-3 items-center justify-between">
                                 <span className="indicator-item badge font-semibold text-cyan-900 mr-6">{user?.isAdmin ? ( 'ADMIN' ):( 'USER' )}</span>
                               <button className={` btn btn-error btn-outline btn-sm mr-3 ${user.isBanned?'btn-disabled':'btn-primary'}`} value={user._id} onClick={()=>banUserMutation(user._id)  }>
                                  <OctagonX className="size-5"/> Ban 
                                </button>
                                <button className={`btn btn-success btn-outline btn-sm  ${!user.isBanned?'btn-disabled':'btn-primary'}`} value={user._id} onClick={()=>unBanUserMutation(user._id) }>
                                  <BadgePlus className='size-5'/> Unban
                                </button>
                              </div>
                            </div>
                          </div>
                        </div> )
                      })}
        </div>
    </div>
  )
}

export default SearchUser;