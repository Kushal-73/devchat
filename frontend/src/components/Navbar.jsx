import { useQueryClient,useMutation } from '@tanstack/react-query';
import { useLocation } from 'react-router';
import useAuthUser from '../hooks/useAuthUser';
import  {logOut} from '../lib/api'
import { Link } from 'react-router';
import { BellIcon,LogOut,House,WrenchIcon} from 'lucide-react';


const Navbar = () => {

  const {authUser,isLoading}=useAuthUser();
  const isAdmin=authUser?.isAdmin;
  const location=useLocation();
  const isChatPage=location.pathname?.startsWith('/chat');
  const isNotificationPage=location.pathname?.startsWith('/notification')


  const queryClient=useQueryClient();

  const {mutate:logoutMutation}=useMutation({
    mutationFn:logOut,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['authUser']})
    }
  });

  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 '>
        <div className='flex items-center justify-end w-full gap-5'>
          {isChatPage && (
            <div className='pl-5'>
              <Link to='/' className='flex items-center gap-2.5 btn btn-ghost btn-circle'>
                <House />
              </Link>
            </div>
          )}
          {isNotificationPage &&(
             <div className='pl-5'>
              <Link to='/' className='flex items-center gap-2.5 btn btn-ghost btn-circle '>
                <House />
              </Link>
            </div>
          )}
       
          <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
            {isAdmin &&
            <Link to='/admin-dashboard'>
              <button className={`btn btn-ghost btn-circle `}>
                <WrenchIcon  className="size-6 text-base-content opacity-75" />
              </button>
            </Link>}

            <Link to='/notification'>
              <button className={`btn btn-ghost btn-circle `}>
                <BellIcon  className="size-6 text-base-content opacity-75" />
              </button>
            </Link>
            
          </div>
          <div className='avatar'>
            <div className='w-9 rounded-full bg-neutral text-neutral-content '>
              <button  >
                <Link to='/profile' >
                <span >
                {!authUser.profilePic ?
                (<img src={authUser.profilePic} alt={authUser.firstName} className="flex justify-center h-full rounded-full object-cover" />)
                :
                (<div className="text-3xl ml-3 font-mono  ">{authUser.firstName.charAt(0)}</div>)}
              </span>
              </Link>

              </button>
              
            </div>
          </div>
          <button className='btn btn-ghost btn-circle' onClick={logoutMutation}>
            <LogOut className='h-6 w-6 text-base-content opacity-75' />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;