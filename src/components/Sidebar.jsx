import React, { useEffect, useRef, useContext } from "react";
import { gsap } from "gsap";
import { SongContext } from "./SongContext";
import BASE_URL from "../config";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { songs, playSong, currSongUrl, isPlaying, selectedFolder } = useContext(SongContext);
  const folder = songs.find(f => f.folder === selectedFolder);

  const scrollRef = useRef(null);
  const sidebarRef = useRef(null);

  // Sidebar open/close animation
  useEffect(() => {
    if (!sidebarRef.current) return;

    if (window.innerWidth >= 1280) {
      // On xl+ screens → sidebar always visible
      gsap.set(sidebarRef.current, { x: "0%" });
      return;
    }

    gsap.to(sidebarRef.current, {
      x: isOpen ? "0%" : "-200%",
      duration: 0.6,
      ease: isOpen ? "power3.out" : "power3.in",
    });
  }, [isOpen]);

  // On mount, hide sidebar for smaller screens
  useEffect(() => {
    if (window.innerWidth < 1280 && sidebarRef.current) {
      gsap.set(sidebarRef.current, { x: "-200%" });
    }
  }, []);

  // Smooth scroll with GSAP
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const scrollAmount = el.scrollTop + e.deltaY;

      gsap.to(el, {
        scrollTop: scrollAmount,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      ref={sidebarRef}
      className="xl:h-full h-[100vh] bg-black z-50 fixed top-0 xl:top-3 xl:ml-4 left-0 
                 w-[70vw] sm:w-[40vw] xl:relative xl:w-[23vw] xl:block rounded-xl overflow-hidden"
    >
      {/* Navbar Section */}
      <nav>
        <div className="xl:h-[23vh] h-[25vh] mt-3 xl:mt-0 mb-2 bg-[#121212] rounded-xl flex items-center">
          <ul className="p-6 list-none space-y-3 w-full">
            {/* Logo + Close Btn */}
            <li className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src="/svgs/logo.svg" alt="Music Logo" className="w-7 invert" />
                <span className="text-white font-semibold">Music</span>
              </div>
              <img
                src="/svgs/close.svg"
                alt="close"
                className="invert w-9 xl:hidden block cursor-pointer"
                onClick={() => {
                  gsap.to(sidebarRef.current, {
                    x: "-200%",
                    duration: 0.6,
                    ease: "power3.in",
                    onComplete: () => setIsOpen(false),
                  });
                }}
              />
            </li>

            {/* Menu Items */}
            <li className="flex gap-3 items-center cursor-pointer hover:text-gray-300">
              <img src="/svgs/home.svg" alt="home" className="w-6 invert" />
              <span>Home</span>
            </li>
            <li className="flex gap-3 items-center cursor-pointer hover:text-gray-300">
              <img src="/svgs/search.svg" alt="search" className="w-6 invert" />
              <span>Search</span>
            </li>
          </ul>
        </div>
      </nav>

      {/* Library Section */}
      <div className="h-[72vh] bg-[#121212] rounded-xl flex flex-col justify-between">
        <main
          ref={scrollRef}
          className="max-h-[60vh] overflow-auto scrollbar-hide"
        >
          <h2 className="flex p-5 gap-2 sticky top-0 bg-[#121212] z-10 text-white font-semibold">
            <img src="/svgs/library.png" alt="library" className="invert w-5" />
            <span>Your Library</span>
          </h2>

          <ul className="mt-2 flex flex-col gap-2 items-center">
            {folder?.files
              ?.filter(file => file.endsWith(".mp3"))
              .map((file, i) => {
                const songUrl = `${BASE_URL}songs/${encodeURIComponent(folder.folder)}/${encodeURIComponent(file)}`;
                const isPlayingThisSong = currSongUrl === songUrl && isPlaying;

                return (
                  <li
                    key={i}
                    className={`flex items-center justify-between border border-white/20 
                                w-[80%] rounded-lg p-2 cursor-pointer transition-all duration-200
                                ${isPlayingThisSong ? "bg-gray-700" : "hover:bg-gray-700"}`}
                    onClick={() => playSong(songUrl, i)}
                  >
                    <div className="flex flex-col text-white">
                      <h3 className="truncate max-340:text-[12px]">{file}</h3>
                      <h4 className="text-sm text-gray-400 max-340:text-[10px]">Unknown Artist</h4>
                    </div>
                    <div className="flex gap-3 items-center text-white ">
                      <h2 className="text-sm max-340:text-[12px]">{isPlayingThisSong ? "Playing" : "Play"}</h2>
                      <img
                        src={isPlayingThisSong ? "/svgs/pause.svg" : "/svgs/play.svg"}
                        alt={isPlayingThisSong ? "pause" : "play"}
                        className="invert w-6 max-340:w-4"
                      />
                    </div>
                  </li>
                );
              })}
          </ul>
        </main>

        {/* Footer Section */}
        <footer className="flex text-[12px] flex-wrap gap-5 p-2 underline justify-center items-center text-[#3d3d3d]">
          <a href="https://www.spotify.com/pk-en/legal/">Legal</a>
          <a href="https://www.spotify.com/pk-en/safetyandprivacy/">Safety Privacy Center</a>
          <a href="https://www.spotify.com/pk-en/legal/privacy-policy/">Privacy Policy</a>
          <a href="https://www.spotify.com/pk-en/legal/cookies-policy/">Cookies</a>
          <a href="https://www.spotify.com/pk-en/legal/privacy-policy/#s3">About Ads</a>
          <a href="https://www.spotify.com/pk-en/accessibility/">Accessibility</a>
        </footer>
      </div>
    </div>
  );
};

export default Sidebar;
