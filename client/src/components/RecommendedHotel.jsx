import { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import HotelCard from './HotelCard'
import Title from './Title'

const RecommendedHotel = () => {
  const { rooms, searchedCities } = useAppContext()
  const [recommended, setRecomended] = useState([])

  const filterHotels = () => {
    const filteredHotels = rooms
      .slice()
      .filter((room) => searchedCities.includes(room.hotel?.city))
    setRecomended(filteredHotels)
  }

  useEffect(() => {
    filterHotels()
  }, [rooms, searchedCities])

  return (
    recommended.length > 0 && (
      <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
        <Title
          title='Recommended Hotels'
          subtitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.'
        />
        <div className='flex flex-wrap items-center justify-center gap-6'>
          {recommended.slice(0, 4).map((room, index) => (
            <HotelCard key={index} room={room} index={index} />
          ))}
        </div>

        {/* <button
          onClick={() => {
            navigate('/rooms')
            scrollTo(0, 0)
          }}
          className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'
        >
          View All Destinations
        </button> */}
      </div>
    )
  )
}

export default RecommendedHotel
