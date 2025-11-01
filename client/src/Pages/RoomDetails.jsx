// RoomDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assets, facilityIcons, roomCommonData } from '../assets/assets';
import StarRating from '../components/StarRating';
import Footerr from '../components/Footer';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const RoomDetails = () => {
  const { id } = useParams();
  const { axios, getToken, navigate } = useAppContext();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await axios.get(`/api/rooms/${id}`);
        if (data.success) {
          setRoom(data.room);
          setMainImage(data.room.images?.[0]);
        } else toast.error(data.message);
      } catch (err) {
        toast.error('Failed to load room: ' + err.message);
      }
    };
    fetchRoom();
  }, [id, axios]);

  const checkAvailability = async () => {
    if (!checkInDate || !checkOutDate) return toast.error("Select dates first");
    if (checkInDate >= checkOutDate) return toast.error('Check-In Date should be less than Check-Out Date');

    try {
      const { data } = await axios.post('/api/bookings/check-availability', { room: id, checkInDate, checkOutDate });
      if (data.success) {
        setIsAvailable(data.isAvailable);
        toast[data.isAvailable ? 'success' : 'error'](data.isAvailable ? 'Room is Available' : 'Room is not available');
      } else toast.error(data.message);
    } catch (err) {
      toast.error('Server error! ' + err.message);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!isAvailable) return checkAvailability();

    try {
      const { data } = await axios.post(
        '/api/bookings/book',
        { room: id, checkInDate, checkOutDate, guests, paymentMethod: "Pay at Hotel" },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success(data.message);
        navigate('/my-bookings');
        scrollTo(0, 0);
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!room) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
       <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* Room Details */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h2 className="text-3xl md:text-4xl font-playfair">
            {room.hotel?.name} <span>({room.roomType})</span>
          </h2>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <StarRating />
          <p className="ml-2">200+ reviews</p>
        </div>

        {/* Address */}
        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <img src={assets.locationIcon} alt="location-icon" />
          <span>{room.hotel?.address}</span>
        </div>

        {/* Room Images */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2">
            <img
              src={mainImage}
              alt="Room"
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room?.images?.length > 0 &&
                room.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    onClick={() => setMainImage(image)}
                    alt="Room-thumbnail"
                    className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                      mainImage === image ? 'outline outline-2 outline-orange-500' : ''
                    }`}
                  />
                ))
              }

          </div>
        </div>

        {/* Highlights */}
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Experience Luxury like Never Before
            </h1>
            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room?.amenities?.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <p className="text-2xl font-medium">${room.pricePerNight} / Night</p>
        </div>

        {/* Booking Form */}
        <form onSubmit={onSubmitHandler} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl">
          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            <div className="flex flex-col">
              <label htmlFor="checkInDate">Check In</label>
              <input
                type="date"
                id="checkInDate"
                value={checkInDate}
                onChange={e => setCheckInDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>

            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            <div className="flex flex-col">
              <label htmlFor="checkOutDate">Check Out</label>
              <input
                type="date"
                id="checkOutDate"
                value={checkOutDate}
                min={checkInDate} disabled={!checkInDate}
                onChange={e => setCheckOutDate(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>

            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            <div className="flex flex-col">
              <label htmlFor="guests">Guests</label>
              <input
                type="number"
                id="guests"
                value={guests}
                onChange={e => setGuests(e.target.value)}
                min={1}
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-10 py-3 md:py-4 text-base cursor-pointer"
          >
            { isAvailable? "Book Now" : "Check Availability" }
          </button>
        </form>


        {/* commpon Specification  */}

        <div className="mt-6 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-3">
              <img 
                src={spec.icon} 
                alt={`${spec.title}-icon`} 
                className="w-6 h-6 object-contain"
              />
              <div>
                <p className="text-base font-medium">{spec.title}</p>
                <p className="text-gray-500 text-sm">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>


          <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
            <p>
              Guests will be allocated on the ground floor according to availability. You get a comfortable Two bedroom apartment has a true city feeling. The price quoted is for two guest, at the guest slot please mark the number of guests to get the exact price for groups. The Guests will be allocated ground floor according to availability. You get the comfortable two bedroom apartment that has a true city feeling.
            </p>
          </div>


          <div className='flex flex-col items-start gap-4'>
            <div className='flex gap-4'>
              <img src={room.hotel?.image} alt="host" className='h-14 w-14md:h-18 md-w-18 rounded-full'/>
              <div>
                <p className='text-lg md:text-xl'>Hosted By:<span className='text-2xl font-bold text-zinc-500'>MD BONI AMIN JAYED</span></p>
                <div className='flex items-center mt-1'>
                  <StarRating/>
                  <p className='ml-2'>200+ reviews</p>
                </div>
              </div>
            </div>

            <Link to='/contact' className='btn btn-success bg-amber-800 px-3 py-2 text-white rounded rounded-full hover:bg-amber-700'>Contact Now</Link>
          </div>


      </div>
      <Footerr />
    </>
  );
};

export default RoomDetails;


