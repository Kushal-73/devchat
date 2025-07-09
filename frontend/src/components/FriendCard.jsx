import { Link } from "react-router";
import { MapPinHouse } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser"
import { BadgeAlert } from "lucide-react";
import toast from "react-hot-toast";
const FriendCard = ({friend}) => {
    const {authUser}=useAuthUser();
    const hasBanned=authUser?.isBanned;

    return (

    <div className="card m-3 bg-base-200 hover:shadow-md transition-shadow">
        <div className="card-body p-4">
            <div className="flex items-center gap-3 mb-3">
                <div className="avatar size-12 rounded-full bg-base-300">
                    <img src={friend.profilePic} alt={friend.firstName.charAt(0)} />
                </div>
                <h3 className="font-semibold truncate">{(friend.firstName).concat(friend.lastName)}</h3>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
                {friend?.location ?               
                ( <span className="badge badge-secondary text-xs w-auto">
                    <MapPinHouse className="size-4" />{friend.location}
                </span>) : ( <span className="badge bg-base-200 text-xs w-auto"></span>)}

            </div>
            {!hasBanned? (  <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full text-center"> Chat </Link>
            ):(
                <button className="btn btn-outline w-full text-center btn-error " onClick={()=>toast.error('ADMIN HAS BANNED YOU')}>YOU ARE BANNED<BadgeAlert /></button>   
            )}
          
        </div>

    </div>
  )
}

export default FriendCard;