// Imports
import { usePlayer } from "../../context/PlayerContext";
import PlayIcon from "../../assets/images/Pausa.svg"; // play
import PauseIcon from "../../assets/images/Siguiente.svg"; // pause

const MusicPlayer = () => {
  const { currentSong, isPlaying, pauseSong, resumeSong } = usePlayer();

  if (!currentSong) return null;

  const handleToggle = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong(); 
    }
  };

  return (
    <div
      className="
        w-[340px]
        rounded-3xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        p-6
        text-white
        shadow-xl shadow-black/25
        flex flex-col items-center
      "
    >
      <img
        src={currentSong.imageUrl}
        alt={currentSong.title}
        className="
          w-[170px] h-[170px]
          rounded-full
          object-cover
          ring-1 ring-white/10
          shadow-lg shadow-black/40
          mb-5
        "
      />

      <h2 className="text-[18px] font-semibold text-center leading-tight max-w-[280px] truncate">
        {currentSong.title}
      </h2>

      <p className="text-white/65 text-[13px] mt-1 mb-5 max-w-[280px] truncate text-center">
        {currentSong.artist}
      </p>

      <button
        onClick={handleToggle}
        className="
          w-[54px] h-[54px]
          rounded-full
          border border-white/10
          bg-white/10
          flex items-center justify-center
          hover:bg-white/15
          transition
        "
        aria-label={isPlaying ? "Pausar" : "Reproducir"}
      >
        <img
          src={isPlaying ? PauseIcon : PlayIcon}
          className="w-8 h-8 opacity-95"
          alt={isPlaying ? "Pausar" : "Reproducir"}
        />
      </button>
    </div>
  );
};

export default MusicPlayer;