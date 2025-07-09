import { useLocation,Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { Antenna, Users , House , Vibrate, WrenchIcon} from "lucide-react";

const Sidebar = () => {

  const {authUser,isLoading}=useAuthUser();
  const isAdmin=authUser?.isAdmin;
  const location=useLocation();
  const currentPath=location.pathname;

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0" data-theme='coffee'>
      <div className="p-5 border-b border-base-300 ">
        <Link to='/' className="flex items-center gap-2.5">
        <Antenna size={28} strokeWidth={1.75} className="" />
        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider pb-2 transition-all duration-300 hover:tracking-normal drop-shadow-md">DevChat..</span>
        </Link>

      </div>

      <div className="flex  p-4">
        <div className="avatar avatar-online online">
         <div className=" h-16 w-16 rounded-full bg-neutral text-neutral-content">
            <span >
              {(authUser.profilePic )?
              ((!isLoading)?(<img src={authUser.profilePic} alt={authUser.firstName} className="flex justify-center h-full rounded-full object-cover" />):(<div className="text-3xl flex flex-1 items-center justify-center p-3 font-mono ">{authUser.firstName.charAt(0)}</div>))
              :
              (<div className="text-3xl flex flex-1 items-center justify-center p-3 font-mono ">{authUser.firstName.charAt(0)}</div>)}
            </span>
         </div>
        </div>
        <div className="flex-1">
          <p className="text-2xl font-semibold m-5">{authUser?.firstName}</p>        
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link to='/' className={`btn btn-ghost justify-center w-full gap-3 px-3 normal-case ${currentPath==='/'?'btn-active':''}`}>
            <House  className="size-5 text-base-content opacity-75"/>
            <span>Home</span>
        
        </Link>

        <Link to='/friends' className={`btn btn-ghost justify-center w-full gap-3 px-3 normal-case ${currentPath==='/friends'?'btn-active':''}`}>
    
            <Users className="size-5 text-base-content opacity-75" />
            <span>Friends</span>
        
        </Link>

        
        <Link to='/notification' className={`btn btn-ghost justify-center w-full gap-3 px-3 normal-case ${currentPath==='/notification'?'btn-active':''}`}>
    
            <Vibrate  className="size-5 text-base-content opacity-75" />
            <span>Notifications</span>
        
        </Link>
        {isAdmin &&
         <Link to='/admin-dashboard' className={`btn btn-ghost justify-center w-full gap-3 px-3 normal-case ${currentPath==='/admin-dashboard'?'btn-active':''}`}>
    
            <WrenchIcon className="size-5 text-base-content opacity-75" />
            <span>Admin Pannel</span>
        
        </Link>}
        

      </nav>




    </aside>
  )
}

export default Sidebar;