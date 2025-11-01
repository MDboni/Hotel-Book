import React, { useState } from 'react'
import { assets, cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Hero = () => {
  const [destinations, setDestinations] = useState('')
  const { navigate, getToken, axios, setSearchedCities } = useAppContext()

  const onSearch = async (e) => {
    e.preventDefault()

    // navigate without space
    navigate(`/rooms?destinations=${destinations}`)

    const token = await getToken()

    // ✅ send correct data
    await axios.post('/api/user/store-recent-search', { recentSearchedCities: destinations }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    // ✅ update local searched cities
    setSearchedCities((prevSearchedCities) => {
      const updatedSearchCities = [...prevSearchedCities, destinations]
      if (updatedSearchCities.length > 3) {
        updatedSearchCities.shift()
      }
      return updatedSearchCities
    })
  }

  return (
    <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center h-screen'>
      <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>The Ultimate Hotel Experience</p>
      <h1 className='font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4'>
        Discover Your Perfect Getaway Destination
      </h1>
      <p className='max-w-130 mt-2 text-sm md:text-base'>
        Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today.
      </p>

      <form onSubmit={onSearch} className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>
        <div>
          <div className='flex items-center gap-2'>
            <img src={assets.calenderIcon} alt='' className='h-4' />
            <label htmlFor="destinationInput">Destination</label>
          </div>
          <input
            onChange={e => setDestinations(e.target.value)}
            value={destinations}
            list='destinations'
            id="destinationInput"
            type="text"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            placeholder="Type here"
            required
          />
          <datalist id='destinations'>
            {cities.map((city, i) => (
              <option value={city} key={i} />
            ))}
          </datalist>
        </div>

        <div>
          <div className='flex items-center gap-2'>
            <img src={assets.calenderIcon} alt='' className='h-4' />
            <label htmlFor="checkIn">Check in</label>
          </div>
          <input id="checkIn" type="date" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
        </div>

        <div>
          <div className='flex items-center gap-2'>
            <svg className="w-4 h-4 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
            </svg>
            <label htmlFor="checkOut">Check out</label>
          </div>
          <input id="checkOut" type="date" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
        </div>

        <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
          <label htmlFor="guests">Guests</label>
          <input min={1} max={4} id="guests" type="number" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16" placeholder="0" />
        </div>

        <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1'>
          <img src={assets.searchIcon} alt='' className='h-7' />
          <span>Search</span>
        </button>
      </form>
    </div>
  )
}

export default Hero
