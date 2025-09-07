import React, { useEffect, useState, useContext, useRef } from "react";
import { SongContext } from "./SongContext";
import { gsap } from "gsap";
import BASE_URL from "../config";

const PlaylistCard = () => {
  const { songs, setSelectedFolder } = useContext(SongContext);
  const [metaData, setMetaData] = useState({});
  const scrollRef = useRef(null); // 📌 reference for GSAP scroll

  // Load metadata (covers, descriptions, etc.)
  useEffect(() => {
    const fetchJsons = async () => {
      let all = {};
      for (const item of songs) {
        const jsonFile = item.files.find((f) => f.endsWith(".json"));
        if (jsonFile) {
          // ✅ use Railway backend base URL
          const url = `${BASE_URL}songs/${encodeURIComponent(item.folder)}/${encodeURIComponent(jsonFile)}`;
          try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            all[item.folder] = data;
          } catch (err) {
            console.error("Error loading JSON:", url, err);
          }
        }
      }
      setMetaData(all);
    };
    if (songs.length > 0) {
      fetchJsons();
    }
  }, [songs]);

  // GSAP smooth scroll effect
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const targetScroll = el.scrollTop + e.deltaY;

      gsap.to(el, {
        scrollTop: targetScroll,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex flex-wrap gap-4 max-h-[73vh] xl:max-h-[60vh] overflow-y-auto xl:mt-3"
    >
      {songs.map((item, idx) => {
        const meta = metaData[item.folder];
        return (
          <div
            key={idx}
            onClick={() => setSelectedFolder(item.folder)}
            className="h-fit max-340:w-[60vw] max-340:ml-4 max-340:mt-2 sm:w-[35vw] lg:w-[40vw] sm:ml-5 xl:w-[190px] bg-[#252525] group hover:bg-[#4b4747] transition-all duration-200 rounded-lg cursor-pointer "
          >
            <div className="flex justify-center items-center relative">
              <img
                src={
                  meta?.cover
                    ? `${BASE_URL}songs/${encodeURIComponent(item.folder)}/${encodeURIComponent(meta.cover)}`
                    : "./default-cover.jpeg"
                }
                alt="cover"
                className="xl:w-[190px] xl:h-[165px] p-2 rounded-md w-[78vw] object-cover"
              />
              <img
                src="./svgs/playbtn.svg"
                alt="playbutton"
                className="xl:h-9 xl:w-9 h-14 w-14 absolute bottom-6 right-4 scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700"
              />
            </div>
            <div className="px-3 pt-2">
              <h1 className="xl:text-xl text-[55px] truncate max-340:text-[22px] max-560:text-[30px]">
                {meta ? meta.title : item.folder}
              </h1>
              <p className="xl:text-[12px] text-[33px] max-340:text-[18px] max-560:text-[25px] text-gray-400 truncate">
                {meta ? meta.description : "No description"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlaylistCard;
