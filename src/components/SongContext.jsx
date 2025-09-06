import React, { createContext, useState, useEffect, useRef } from "react";
import BASE_URL from "../config";

export const SongContext = createContext();

export const SongProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [currSongUrl, setCurrSongUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [currIndex, setCurrIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);   // ⏱️ Current playback time
  const [duration, setDuration] = useState(0);         // 🎵 Song duration
  const [volume, setVolume] = useState(1);             // 🔊 Default full volume
  const [isMuted, setIsMuted] = useState(false);
  const [lastVolume, setLastVolume] = useState(1);     // Stores last non-zero volume
  const [isEnded, setIsEnded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const audioRef = useRef(new Audio()); // ✅ Single global audio element

  // Fetch songs from backend
  useEffect(() => {
    const getSongs = async () => {
      try {
        const res = await fetch(`${BASE_URL}api/songs`);
        const data = await res.json();
        setSongs(data);

        if (data.length > 0) {
          setSelectedFolder(data[0].folder); // ✅ Default: first folder
        }
      } catch (err) {
        console.error("❌ Error fetching songs:", err);
      }
    };
    getSongs();
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => {
      setIsPlaying(false);
      setIsEnded(true); // ✅ Show replay option
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setMeta);
    audio.addEventListener("ended", onEnd);

    // Apply mute/volume
    audio.volume = isMuted ? 0 : volume;

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, [isMuted, volume]);

  // Play/Pause or Load New Song
  const playSong = (url, i) => {
    const audio = audioRef.current;

    if (currSongUrl === url) {
      // ✅ Toggle play/pause if same song
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
      return;
    }

    // ✅ Load new song
    audio.src = url;
    setCurrSongUrl(url);
    setCurrIndex(i);
    setIsPlaying(true);
    setIsEnded(false);
    audio.play();
  };

  // Next Song
  const nextSong = () => {
    if (!selectedFolder) return;
    const folder = songs.find(f => f.folder === selectedFolder);
    if (!folder) return;

    const mp3Files = folder.files.filter(f => f.endsWith(".mp3"));
    if (currIndex === null || mp3Files.length === 0) return;

    const nextIndex = (currIndex + 1) % mp3Files.length;
    const nextUrl = `${BASE_URL}api/songs/${encodeURIComponent(folder.folder)}/${encodeURIComponent(mp3Files[nextIndex])}`;
    playSong(nextUrl, nextIndex);
  };

  // Previous Song
  const prevSong = () => {
    if (!selectedFolder) return;
    const folder = songs.find(f => f.folder === selectedFolder);
    if (!folder) return;

    const mp3Files = folder.files.filter(f => f.endsWith(".mp3"));
    if (currIndex === null || mp3Files.length === 0) return;

    const prevIndex = (currIndex - 1 + mp3Files.length) % mp3Files.length;
    const prevUrl = `${BASE_URL}api/songs/${encodeURIComponent(folder.folder)}/${encodeURIComponent(mp3Files[prevIndex])}`;
    playSong(prevUrl, prevIndex);
  };

  // Seek to specific time
  const seekTo = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Change Volume
  const changeVolume = (val) => {
    const audio = audioRef.current;
    audio.volume = val;
    setVolume(val);

    if (val > 0) {
      setLastVolume(val);   // Save last usable volume
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    const audio = audioRef.current;

    if (!isMuted) {
      setLastVolume(volume > 0 ? volume : lastVolume);
      setVolume(0);
      audio.volume = 0;
      setIsMuted(true);
    } else {
      const restoreVolume = lastVolume > 0 ? lastVolume : 1;
      setVolume(restoreVolume);
      audio.volume = restoreVolume;
      setIsMuted(false);
    }
  };

  // Replay Song
  const replaySong = () => {
    const audio = audioRef.current;
    if (currSongUrl) {
      audio.currentTime = 0;
      audio.play();
      setIsPlaying(true);
      setIsEnded(false);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "m") {
        toggleMute(); // 🎵 Press "M" → mute/unmute
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleMute]);

  return (
    <SongContext.Provider
      value={{
        songs,
        setSongs,
        playSong,
        currSongUrl,
        isPlaying,
        selectedFolder,
        setSelectedFolder,
        nextSong,
        prevSong,
        currIndex,
        setCurrIndex,
        currentTime,
        duration,
        seekTo,
        volume,
        changeVolume,
        isMuted,
        setIsMuted,
        audioRef,
        toggleMute,
        isEnded,
        replaySong,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};
