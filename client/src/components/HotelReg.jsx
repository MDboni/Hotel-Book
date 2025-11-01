import React, { useState } from 'react';
import { assets, cities } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const HotelReg = () => {
  const { setShowHotelReg, setIsOwner, getToken, axios } = useAppContext();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/hotels/`,
        { name, contact, address, city },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsOwner(true);
        setShowHotelReg(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div onClick={() => setShowHotelReg(false)} className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm'>
      <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className='flex bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden max-md:mx-4'>
        
        {/* Left side image */}
        <img 
          src={assets.regImage} 
          alt="hotel registration" 
          className='w-1/2 object-cover hidden md:block' 
        />

        {/* Right side form */}
        <div className='relative flex flex-col w-full md:w-1/2 p-8 md:p-10'>
          <img 
            onClick={() => setShowHotelReg(false)}
            src={assets.closeIcon} 
            alt="close-icon" 
            className='absolute top-4 right-4 h-5 cursor-pointer hover:rotate-90 transition-transform duration-300' 
          />

          <h2 className='text-2xl font-semibold text-gray-800 mt-3 mb-2 text-center'>
            Register Your Hotel
          </h2>
          <p className='text-sm text-gray-500 mb-6 text-center'>
            Fill out the form below to get your hotel listed
          </p>

          <input type="text" placeholder="Hotel Name" value={name} onChange={(e)=>setName(e.target.value)} className="input-field mb-4" required />
          <input type="text" placeholder="Phone" value={contact} onChange={(e)=>setContact(e.target.value)} className="input-field mb-4" required />
          <input type="text" placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)} className="input-field mb-4" required />

          <select value={city} onChange={(e)=>setCity(e.target.value)} className="input-field mb-6" required>
            <option value="">Select City</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button type="submit" className='bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all text-white font-medium py-2.5 w-full rounded-lg shadow-md'>
            Register Hotel
          </button>
        </div>
      </form>
    </div>
  )
}

export default HotelReg;
