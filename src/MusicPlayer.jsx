import React, { useState, useRef, useEffect } from "react";
import "./MusicPlayer.css"; // We'll create this CSS file next

// SVG Icons
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M8 5v14l11-7z"></path>
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
  </svg>
);

const PrevIcon = () => (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"></path>
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path>
  </svg>
);

const songList = [
  { name: "Cherry Blossom", src: "/mp3/cherry-blossom.mp3" },
  { name: "Japanese Garden", src: "/mp3/japanese-calm.mp3" },
  { name: "Ryuichi Sakamoto", src: "/mp3/ryuichi-sakamoto.mp3" },
  { name: "Red Rain", src: "/mp3/red-rain.mp3" },
];

function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Effect to handle changing song source
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songList[currentSongIndex].src;
      audioRef.current.load(); // Important to load the new source
      if (isPlaying) {
        // If it was playing, try to play the new song
        audioRef.current.play().catch((error) => {
          console.error("Error playing new song:", error);
          setIsPlaying(false); // If autoplay fails, set to paused
        });
      }
    }
  }, [currentSongIndex]); // Re-run when currentSongIndex changes

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const playNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songList.length);
    // isPlaying will be handled by the useEffect or if the user manually plays
  };

  const playPrevSong = () => {
    setCurrentSongIndex(
      (prevIndex) => (prevIndex - 1 + songList.length) % songList.length
    );
    // isPlaying will be handled by the useEffect or if the user manually plays
  };

  // Update audio source when component mounts if needed, or rely on useEffect
  // This ensures the initial song is loaded correctly.
  useEffect(() => {
    if (audioRef.current && !audioRef.current.src) {
      audioRef.current.src = songList[currentSongIndex].src;
      // Do not auto-play on initial load unless specified
    }
  }, [currentSongIndex]); // Should only run once on mount effectively unless currentSongIndex is changed externally before first render

  return (
    <div className="music-player-container">
      <audio ref={audioRef} loop />
      <button
        onClick={playPrevSong}
        className="prev-next-button"
        aria-label="Previous song"
      >
        <PrevIcon />
      </button>
      <button
        onClick={togglePlayPause}
        className="play-pause-button"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button
        onClick={playNextSong}
        className="prev-next-button"
        aria-label="Next song"
      >
        <NextIcon />
      </button>
      <div className="song-info">{songList[currentSongIndex].name}</div>
    </div>
  );
}

export default MusicPlayer;
