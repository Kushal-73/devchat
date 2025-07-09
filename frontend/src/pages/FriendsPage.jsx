import useAuthUser from "../hooks/useAuthUser"
import PageLoading from '../pages/PageLoading'
import toast from "react-hot-toast";
import { getUserFriends } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import { MapPinCheck,Vote ,MessageSquareMore,TrafficCone,BadgeAlert} from "lucide-react";
import { Link } from "react-router";

const FriendsPage = () => {

    const {authUser}=useAuthUser();
    const hasBanned=authUser?.isBanned;

    const {data:friends,isLoading:loadingFriends}=useQuery({
    queryKey:['friends'],
    queryFn: getUserFriends,
    initialData:[],
    });

    return (
     <div className='p-5 sm-p-7 lg:p-9 '>
       <div className='container space-y-10 '>
        <div className='flex flex-col sm:flex-col items-start sm:items-center justify-between gap-4'>
          <h3 className='text-4xl font-bold sm:text-5xl tracking-tight font-mono bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 pb-2 transition-all duration-300 hover:tracking-normal drop-shadow-md'>Friends</h3>
            {loadingFriends ? (
            <div className='flex justify-center py-12  '>
              <PageLoading/>
            </div>
          ) : (
            <>
              {friends.length>0 && (
                
                <section className="space-y-4 w-full ">
                  <div className=" space-y-3  ">
                    {friends?.map((request)=>(
                      
                        <div key={request._id} className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="card-body p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="avatar w-14 h-14 rounded-full bg-base-300">
                                  <img src={request?.profilePic} alt={request?.firstName} />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{(request?.firstName).concat(request?.lastName+' ')}</h3>
                                </div>
                                <div>
                                  {request?.location && (
                                  <div className='flex items-center text-xs opacity-75 mt-1'>
                                  <MapPinCheck className='size-6 '/>{(request?.location.length >10)?(request?.location.substring(0, 7).concat('..')):(request?.location)}
                                  </div>
                                  )}
                                </div>
                              </div>
                              {!hasBanned? (  <Link to={`/chat/${request._id}`} className="btn btn-primary btn-sm"> <MessageSquareMore/> Chat </Link>
                                ):(
                                 <button className="btn btn-outline btn-sm text-center btn-error " onClick={()=>toast.error('ADMIN HAS BANNED YOU')}>YOU ARE BANNED<BadgeAlert /></button>   
                                )
                              }
                            </div>
                          </div>
                        </div>
                     
                    ))}
                  </div>  
                </section >
              )}
                {friends?.length ===0 &&
                <div className='backdrop-brightness-125 w-full h-screen'>
                    <div className='flex flex-col items-center justify-center py-16 text-center'>
                        <div className='size-16 rounded-full bg-base-300 flex items-center justify-center mb-4 border border-fuchsia-300'>
                            <TrafficCone className='size-8 text-base-content opacity-35'/>
                        </div>
                        <h3 className='text-lg font-semibold mb-2'>NONE</h3>    
                    </div>
                 </div>
                }
        </>)}
      </div>
    </div>
    </div>
    )
}
    

export default FriendsPage;