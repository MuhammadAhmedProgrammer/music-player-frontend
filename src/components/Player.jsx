import React, { useContext } from 'react'
import { SongContext } from './SongContext';

const formatTime = (sec) => {
    if (isNaN(sec)) return "00:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const Player = () => {
    const {
        currSongUrl, isPlaying, playSong, nextSong, prevSong, currIndex,
        currentTime, duration, seekTo, volume, changeVolume, isMuted, toggleMute, isEnded, replaySong
    } = useContext(SongContext);

    return (
        <div className='flex justify-center'>
            <div className='flex justify-center items-center flex-col fixed max-560:w-[80%] xl:w-[70vw] max-1000:bottom-4 max-560:bottom-12 xl:bottom-10'>
                <div className='flex justify-between items-center bg-[#121212] hover:bg-[#4b4747] transition-all duration-700 w-full p-3 max-340:rounded-lg max-340:w-[100%] max-340:p-1 rounded-2xl max-560:p-0 '>
                    <h1 className='max-560:text-[10px]'>{currSongUrl ? decodeURIComponent(currSongUrl.split('/').pop()) : "No song selected"}</h1>

                    <div className='flex items-center gap-4 max-560:gap-2 cursor-pointer'>
                        <img src="/svgs/previoussong.svg" alt="previous"
                            className='invert w-7 h-7 sm:w-8 sm:h-8 max-560:h-5 max-560:w-5 cursor-pointer' onClick={prevSong} />
                        <img
                            src={
                                isEnded
                                    ? "/svgs/replay.svg"
                                    : isPlaying
                                        ? "/svgs/pause.svg"
                                        : "/svgs/play.svg"
                            }
                            alt={isEnded ? "replay" : isPlaying ? "pause" : "play"}
                            className="invert w-5 h-5 sm:w-7 sm:h-7 cursor-pointer max-560:h-4 max-560:w-4"
                            onClick={() => {
                                if (isEnded) {
                                    replaySong();   // ✅ restart song
                                } else if (currSongUrl) {
                                    playSong(currSongUrl, currIndex); // normal play/pause
                                }
                            }}
                        />
                        <img src="/svgs/nextsong.svg" alt="next"
                            className='invert w-7 h-7 sm:w-8 sm:h-8 cursor-pointer max-560:h-5 max-560:w-5' onClick={nextSong} />
                    </div>

                    {/* Time + Volume */}
                    <div className='gap-2 flex flex-col items-end'>
                        <h2 className='max-560:text-[10px]'>{formatTime(currentTime)} / {formatTime(duration)}</h2>
                        <div className='flex gap-6 sm:gap-3 max-560:gap-2  items-center relative bottom-2 justify-center'>
                            <img
                                src={isMuted ? "/svgs/mute.png" : "/svgs/volume.png"}
                                alt={isMuted ? "mute" : "volume"}
                                className="invert w-5 h-5 sm:w-6 sm:h-6 cursor-pointer max-560:w-4 max-560:h-4"
                                onClick={toggleMute}
                            />
                            <input
                                type="range"
                                min="0" max="1" step="0.01"
                                value={isMuted ? 0 : volume}   // slider shows 0 when muted
                                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                                className="w-[12vw] sm:w-[6vw] max-560:w-14"
                            />

                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div
                    className="h-1 w-[98%] bg-gray-500 rounded-xl relative cursor-pointer"
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const offsetX = e.clientX - rect.left;
                        const percent = Math.min(Math.max(offsetX / rect.width, 0), 1);
                        const newTime = percent * duration;
                        seekTo(newTime);   // ⏩ seek instantly
                    }}
                >
                    {/* Filled progress */}
                    <div
                        className="h-1 bg-white rounded-xl"
                        style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                    ></div>

                    {/* Knob */}
                    <div
                        className="w-[15px] h-[15px] rounded-full bg-white absolute top-1/2 transform -translate-y-1/2 cursor-pointer"
                        style={{
                            left: duration ? `${(currentTime / duration) * 100}%` : "0%",
                            transition: "left 0.1s linear"
                        }}
                        onMouseDown={(e) => {
                            const progressBar = e.currentTarget.parentElement;
                            const rect = progressBar.getBoundingClientRect();

                            const move = (ev) => {
                                const offsetX = ev.clientX - rect.left;
                                const percent = Math.min(Math.max(offsetX / rect.width, 0), 1);
                                const newTime = percent * duration;
                                seekTo(newTime);
                            };

                            const up = () => {
                                document.removeEventListener("mousemove", move);
                                document.removeEventListener("mouseup", up);
                            };

                            document.addEventListener("mousemove", move);
                            document.addEventListener("mouseup", up);
                        }}
                    ></div>
                </div>

            </div>

        </div>
    )
}

export default Player;
