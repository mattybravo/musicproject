import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  //Crear audio solo 1 vez
  if (!audioRef.current) {
    audioRef.current = new Audio();
  }

  const normalizePreview = (preview) => {
    if (typeof preview !== "string") return "";
    const p = preview.trim();

    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  };

  const isValidPreview = (preview) => {
    const p = normalizePreview(preview);

    return (
      typeof p === "string" &&
      p.length > 10 &&
      (p.startsWith("https://") || p.startsWith("http://")) &&
      (p.includes(".mp3") || p.includes("preview"))
    );
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.crossOrigin = "anonymous";

    const handleEnded = () => setIsPlaying(false);
    const handleError = () => setIsPlaying(false);

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
      audio.load();

      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  const playSong = useCallback(
    async (song) => {
      const audio = audioRef.current;
      const preview = normalizePreview(song?.preview);

      // Preview inválido => no reproducir
      if (!isValidPreview(preview)) {
        setIsPlaying(false);
        return;
      }

      // Misma canción => reanudar
      const sameSong = currentSong?.preview === preview;

      if (sameSong) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
        return;
      }

      // Canción nueva => reset
      audio.pause();
      audio.currentTime = 0;

      setCurrentSong(song);

      audio.src = preview;
      audio.volume = 0.3;
      audio.load();

      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);

        try {
          const token = localStorage.getItem("token");
          if (!token || !song?._id) return;

          const res = await fetch(
            `http://localhost:4000/songs/fetch-audio/${song._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const data = await res.json();
          const updatedSong = data?.song;

          const updatedPreview = normalizePreview(updatedSong?.preview);

          if (!updatedSong?.preview || !isValidPreview(updatedPreview)) return;

          setCurrentSong(updatedSong);

          audio.pause();
          audio.currentTime = 0;
          audio.src = updatedPreview;
          audio.volume = 0.3;
          audio.load();

          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        } catch {
        }
      }
    },
    [currentSong]
  );

  const pauseSong = useCallback(() => {
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const resumeSong = useCallback(() => {
    const audio = audioRef.current;

    if (!currentSong) return;

    const preview = normalizePreview(currentSong.preview);
    if (!isValidPreview(preview)) return;

    if (!audio.src) {
      audio.src = preview;
      audio.load();
    }

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [currentSong]);

  const stopSong = useCallback(() => {
    const audio = audioRef.current;

    audio.pause();
    audio.currentTime = 0;
    audio.src = "";
    audio.load();

    setIsPlaying(false);
    setCurrentSong(null);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        pauseSong,
        resumeSong,
        stopSong,
        audioRef,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
