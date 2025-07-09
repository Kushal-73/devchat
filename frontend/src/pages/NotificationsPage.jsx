import { useQuery,useQueryClient,useMutation } from "@tanstack/react-query"
import {getFriendRequests,acceptFriendRequest} from '../lib/api'
import NoNotificationFound from "../components/NoNotificationFound"
import { MapPinCheck,MessageSquareIcon,Vote} from "lucide-react"
import { Link } from "react-router"
import useAuthUser from "../hooks/useAuthUser"
import { BadgeAlert } from "lucide-react"
import toast from "react-hot-toast"


const NotificationsPage = () => {

  const queryClient=useQueryClient();
  const {authUser}=useAuthUser();
  const hasBanned=authUser?.isBanned;

  const{data:friendRequests,isLoading}=useQuery({
    queryKey:['friendRequests'],
    queryFn:getFriendRequests,
  });


  const {mutate:acceptRequestMutation,isPending}=useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['friendRequests']});
      queryClient.invalidateQueries({queryKey:['friends']});
    },
  });

  const incomingRequests=friendRequests?.incomingReq || [];
  const acceptedRequests=friendRequests?.acceptedReq || [];


  return (
    <div className='p-5 sm-p-7 lg:p-9 '>
      <div className='container space-y-10 '>
        <div className='flex flex-col sm:flex-col items-start sm:items-center justify-between gap-4'>
          <h3 className='text-4xl font-bold sm:text-5xl tracking-tight font-mono bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 pb-2 transition-all duration-300 hover:tracking-normal drop-shadow-md'>Notifications</h3>
          {isLoading ? (
            <div className='flex justify-center py-12  '>
              <span className='loading loading-dots loading-lg '></span>
            </div>
          ) : (
            <>
              {incomingRequests.length>0 && (
                
                <section className="space-y-4 w-full ">
                  <h2 className='font-semibold text-2xl sm:text-3xl tracking-tight text-gray-950 dark:text-gray-100 '>Friend Requests <span className="indicator-item badge badge-secondary text-lime-600">{incomingRequests.length}</span></h2>   
                  <div className=" space-y-3  ">
                    {incomingRequests.map((request)=>(
                      
                        <div key={request._id} className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="card-body p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="avatar w-14 h-14 rounded-full bg-base-300">
                                  <img src={request.sender?.profilePic} alt={request.sender?.firstName} />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{(request.sender?.firstName).concat(request.sender.lastName+'  ')}</h3>
                                </div>
                                <div>
                                  {request.sender?.location && (
                                  <div className='flex items-center text-xs opacity-75 mt-1'>
                                  <MapPinCheck className='size-6 '/>{(request.sender.location.length >10)?(request.sender.location.substring(0, 7).concat('..')):(request.sender.location)}
                                  </div>
                                  )}
                                </div>
                              </div>
                              <button className="btn btn-primary btn-sm" onClick={()=>acceptRequestMutation(request._id)} disabled={isPending}>
                               <Vote /> Accept
                              </button>
                            </div>
                          </div>
                        </div>
                     
                    ))}
                  </div>  
                </section >
              )}

              {acceptedRequests.length>0 && (
                <section className="space-y-4 w-full">
                  <h2 className='font-semibold text-2xl sm:text-3xl tracking-tight text-gray-950 dark:text-gray-100 '>New Connections <span className="indicator-item badge badge-secondary text-cyan-600">{acceptedRequests.length}</span></h2>   
                  <div className="space-y-3">
                    {acceptedRequests.map((notifiaction)=>(
                       <div key={notifiaction._id} className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="card-body p-4 ">
                            <div className="flex items-center justify-between ">
                              <div className="flex items-center flex-1 gap-3">
                                <div className="avatar w-14 h-14 rounded-full bg-base-300">
                                  <img src={notifiaction.recipient?.profilePic} alt={notifiaction.recipient?.firstName} />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold">{(notifiaction.recipient.firstName).concat(notifiaction.recipient.lastName+' ')}</h3>
                                  <p className="text-sm my-1"> {(notifiaction.recipient.firstName)}has accepted your friend request !</p>
                                </div>{!hasBanned?( <Link to={`/chat/${notifiaction.recipient._id}`} className="badge badge-success py-5">
                                  <MessageSquareIcon className="h-3 w-3 mr-1 text-l"/>New Friend
                                </Link>):(
                                  <button className="badge badge-error badge-outline py-5 " onClick={()=>toast.error('ADMIN HAS BANNED YOU')} ><BadgeAlert /></button>
                                )}
                               
                              </div>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </section>

                
              )}
              {incomingRequests.length===0 && acceptedRequests.length===0 &&(
                    <NoNotificationFound/>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage