import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home';
import AllRooms from './Pages/AllRooms';
import ContactPage from './Pages/ContactPage';
import MyBookings from './Pages/MyBookings';
import HotelReg from './components/HotelReg';
import Layout from './Pages/HotelOwner.jsx/Layout';
import DashBoard from './Pages/HotelOwner.jsx/DashBoard';
import AddRoom from './Pages/HotelOwner.jsx/AddRoom';
import ListRoom from './Pages/HotelOwner.jsx/ListRoom';
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext';
import RoomDetails from './Pages/RoomDetails';



const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner") ;
  const{ showHotelReg } = useAppContext()

  return (
    <div>
      <Toaster/>
      { !isOwnerPath && < Navbar/>}
     { showHotelReg &&  <HotelReg/>}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/rooms' element={<AllRooms/>}/>
          <Route path='/rooms/:id' element={<RoomDetails/>}/>
          <Route path='/contact' element={<ContactPage/>}/>
          <Route path='/my-bookings' element={<MyBookings/>}/>

          <Route path='/owner' element={<Layout/>}>
              <Route index element={<DashBoard/>}/>
              <Route path='add-room' element={<AddRoom/>}/>
              <Route path='list-room' element={<ListRoom/>}/>
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App