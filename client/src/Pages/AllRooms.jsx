import React, { useState, useMemo } from 'react';
import Footerr from '../components/Footer';
import { assets, facilityIcons } from '../assets/assets';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { useAppContext } from '../context/AppContext';

// ✅ Checkbox Component
const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
      <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
      <span className='font-light select-none'>{label}</span>
    </label>
  )
}

// ✅ Radio Button Component
const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
      <input type="radio" name='sortOption' checked={selected} onChange={() => onChange(label)} />
      <span className='font-light select-none'>{label}</span>
    </label>
  )
}

const AllRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { rooms, navigate, currency } = useAppContext();
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    PriceRange: []
  });
  const [selectedSort, setSelectedSort] = useState('');

  // ✅ Filter Options
  const roomTypes = ['Single Bed', 'Double Bed', 'Luxury Bed', 'Family Bed'];
  const PriceRanges = ['0 to 500', '500 to 1000', '1000 to 2000', '2000 to 3000'];
  const sortOptions = ['Price Low to Hiegh', 'Price Hiegh to Low', 'Newest First'];

  // ✅ Filter Handlers
  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters(prev => {
      const updated = { ...prev };
      if (checked) {
        updated[type].push(value);
      } else {
        updated[type] = updated[type].filter(item => item !== value);
      }
      return updated;
    });
  }

  const handleSortChange = (option) => setSelectedSort(option);

  const matchRoomType = (room) => selectedFilters.roomType.length === 0 || selectedFilters.roomType.includes(room.roomType);

  const matchesPriceRange = (room) => {
    return selectedFilters.PriceRange.length === 0 || selectedFilters.PriceRange.some(range => {
      const [min, max] = range.split('to').map(n => parseInt(n.trim()));
      return room.pricePerNight >= min && room.pricePerNight <= max;
    });
  }

  const filterDestination = (room) => {
    const destination = searchParams.get('destination');
    if (!destination) return true;
    return room.hotel?.city.toLowerCase().includes(destination.toLowerCase());
  }

  const sortRooms = (a, b) => {
    if (selectedSort === 'Price Low to Hiegh') return a.pricePerNight - b.pricePerNight;
    if (selectedSort === 'Price Hiegh to Low') return b.pricePerNight - a.pricePerNight;
    if (selectedSort === 'Newest First') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  }

  const filteredRooms = useMemo(() => {
    return rooms
      .filter(room => matchRoomType(room) && matchesPriceRange(room) && filterDestination(room))
      .sort(sortRooms);
  }, [rooms, selectedFilters, selectedSort, searchParams]);

  const clearFilters = () => {
    setSelectedFilters({ roomType: [], PriceRange: [] });
    setSelectedSort('');
    setSearchParams({});
  }

  return (
    <>
      <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-32 px-4 md:px-16 lg:px-24'>
        {/* Rooms Listing */}
        <div className='flex-1'>
          <div className='flex flex-col items-start text-left'>
            <h1 className='font-player text-4xl md:text-[40px]'>Hotel Rooms</h1>
            <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>
              Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.
            </p>
          </div>

          <div>
            {filteredRooms.map(room => (
              <div key={room._id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0'>
                <img
                  onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0); }}
                  src={room.images[0]}
                  alt="hotel-img"
                  title='View Room Details'
                  className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'
                />
                <div className='md:w-1/2 flex flex-col gap-2'>
                  <p className='text-gray-500'>{room.hotel?.city}</p>
                  <p className='text-gray-500 text-3xl font-playfair cursor-pointer'>{room.hotel?.name}</p>
                  <div className='flex items-center'>
                    <StarRating />
                    <p className='ml-2'>200+ review</p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <img src={assets.locationIcon} alt="location-icon" />
                    <span>{room.hotel?.address}</span>
                  </div>

                  {/* Room amenities */}
                  <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                    {room.amenities.map((item, index) => (
                      <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#e9e9f0]'>
                        <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                        <p className='text-xs'>{item}</p>
                      </div>
                    ))}
                  </div>

                  {/* Room price */}
                  <div className='flex flex-row items-center gap-3'>
                    <p className='text-xl font-medium text-gray-700'>{currency}{room.pricePerNight}</p>
                    <button
                      onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0); }}
                      className='bg-[#e9e9f0] hover:bg-fuchsia-200 btn py-2 px-3 cursor-pointer'
                    >
                      Book Hotel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Panel */}
        <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16'>
          <div className={`flex flex-col md:flex-row items-center justify-between px-5 py-2.5 lg:border-b border-gray-300 ${openFilter && 'border-b'}`}>
            <p className='text-base font-medium text-gray-800'>FILTERS</p>
            <div className='text-xs cursor-pointer'>
              <span onClick={() => setOpenFilter(!openFilter)} className='lg:hidden'>
                {openFilter ? 'HIDE' : 'SHOW'}
              </span>
              <span onClick={clearFilters} className='hidden lg:inline cursor-pointer'>CLEAR</span>
            </div>
          </div>

          <div className={`${openFilter ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
            {/* Price Range */}
            <div className='px-5 pt-5'>
              <p className='font-medium text-gray-800 pb-2'>Price Range</p>
              {PriceRanges.map((range, index) => (
                <CheckBox
                  key={index}
                  label={range}
                  selected={selectedFilters.PriceRange.includes(range)}
                  onChange={(checked) => handleFilterChange(checked, range, 'PriceRange')}
                />
              ))}
            </div>

            {/* Room Types */}
            <div className='px-5 pt-5'>
              <p className='font-medium text-gray-800 pb-2'>Room Type</p>
              {roomTypes.map((type, index) => (
                <CheckBox
                  key={index}
                  label={type}
                  selected={selectedFilters.roomType.includes(type)}
                  onChange={(checked) => handleFilterChange(checked, type, 'roomType')}
                />
              ))}
            </div>

            {/* Sort Options */}
            <div className='px-5 pt-5 pb-5'>
              <p className='font-medium text-gray-800 pb-2'>Sort By</p>
              {sortOptions.map((option, index) => (
                <RadioButton
                  key={index}
                  label={option}
                  selected={selectedSort === option}
                  onChange={handleSortChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footerr />
    </>
  )
}

export default AllRooms;
