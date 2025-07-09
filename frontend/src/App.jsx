
import {Navigate, Route, Routes} from 'react-router';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import NotificationsPage  from './pages/NotificationsPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import CallPage from './pages/CallPage.jsx';
import ProfilPage from './pages/ProfilePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import FriendsPage from './pages/FriendsPage.jsx';

import {Toaster} from 'react-hot-toast';

import PageLoading from './pages/PageLoading.jsx';
import useAuthUser from './hooks/useAuthUser.js';

import Layout from './components/Layout.jsx';


const App = () => {

 const {isloading,authUser} =useAuthUser();
 const isAuthenticated=Boolean(authUser);
 const hasProfile=authUser?.profile_created;
 const isAdmin=authUser?.isAdmin;
 const isBanned=authUser?.isBanned;
 

  if(isloading) return <PageLoading/>
  

  return (
   
      <div className=' h-full' data-theme='coffee'>
    
        <Routes>
          <Route path='/' element={(isAuthenticated && hasProfile) ? ( <Layout showSidebar={true} ><HomePage /></Layout>) : (<Navigate to={isAuthenticated? '/profile' :'/login'}/>)} />
          <Route path='/signup' element={!isAuthenticated?<SignUpPage /> : <Navigate to={hasProfile ?  '/' : '/profile'}/>} />
          <Route path='/login' element={!isAuthenticated ?<LoginPage /> : <Navigate to={hasProfile ?  '/' : '/profile'}/>} />            
          <Route path='/notification' element={(isAuthenticated && hasProfile)?( <Layout showSidebar={true}> <NotificationsPage /></Layout>):<Navigate to={!isAuthenticated?('/login'):('/profile')}/>} />
          <Route path='/call/:id' element={(isAuthenticated && hasProfile && !isBanned) && <CallPage /> } />
          <Route path='/chat/:id' element={(isAuthenticated && hasProfile && !isBanned)?(<Layout showSidebar={false} ><ChatPage /></Layout>) : (<Navigate to='/login'/>)} />
          <Route path='/admin-dashboard' element={(isAuthenticated && hasProfile && isAdmin && !isBanned)?( <Layout showSidebar={true}> <AdminPage /></Layout>):<Navigate to={!isAuthenticated?('/login'):('/profile')}/>} />  
          <Route path='/profile' element={isAuthenticated ? (!hasProfile ? (<ProfilPage/>) :( <Navigate to='/'/>) ): (<Navigate to={!isAuthenticated?'/login':'/profile'}/>)} />
          <Route path='/friends' element={(isAuthenticated && hasProfile)?( <Layout showSidebar={true}> <FriendsPage /></Layout>):<Navigate to={!isAuthenticated?('/login'):('/profile')}/>} />
        </Routes>
        <Toaster toastOptions={{style:{zIndex:9999,},}}/>
     
      </div>

  )
}

export default App;