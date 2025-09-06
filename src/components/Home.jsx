import React from 'react'
import Header from './Header'
import Playlist from './Playlist'
import Player from './Player'

const Home = ({ setIsSidebarOpen }) => {
  return (
    <div className='xl:mt-3 xl:mb-3 ml-2 mt-2 mr-2 xl:mr-6 bg-[#121212] xl:w-[74vw] h-[98vh] rounded-xl'>
        <Header setIsSidebarOpen={setIsSidebarOpen} />   {/* pass prop here */}
        <Playlist />
        <Player />
    </div>
  )
}

export default Home
