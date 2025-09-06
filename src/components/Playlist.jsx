import React from 'react'
import PlaylistCard from './PlaylistCard'

const Playlist = () => {
    const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/${track}`;
    if (!pause) {
        currentSong.play();
        play.src = "svgs/pause.svg";

    }
}
    return (
        <div className='p-6'>
            <h1 className='font-bold text-3xl'>Available Playlists</h1>
            <PlaylistCard />
        </div>
    )
}

export default Playlist
