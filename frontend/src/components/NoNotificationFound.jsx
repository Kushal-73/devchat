
import { BellOffIcon } from 'lucide-react'


const NoNotificationFound = () => {
  return (
    <div className='backdrop-brightness-125 w-full h-screen'>
    <div className='flex flex-col items-center justify-center py-16 text-center'>
      <div className='size-16 rounded-full bg-base-300 flex items-center justify-center mb-4 border border-fuchsia-300'>
        <BellOffIcon className='size-8 text-base-content opacity-35'/>
      </div>
      <h3 className='text-lg font-semibold mb-2'>No Notification yet</h3>
      
    </div>
    </div>
  );
}

export default NoNotificationFound;