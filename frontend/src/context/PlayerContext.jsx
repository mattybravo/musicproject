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

  // ✅ Creamos audio 1 sola vez
  if (!audioRef.current) {
    audioRef.current = new Audio();
  }

  // ✅ Helpers
  const normalizePreview = (preview) => {
    if (typeof preview !== "string") return "";
    const p = preview.trim();

    // a veces viene encodeado o con caracteres raros
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

    // ✅ ayuda a algunos navegadores con fuentes externas
    audio.crossOrigin = "anonymous";

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      console.error("❌ Error cargando audio. SRC:", audio.src);
      setIsPlaying(false);
    };

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

  // ✅ Play principal
  const playSong = useCallback(
    async (song) => {
      const audio = audioRef.current;

      const preview = normalizePreview(song?.preview);

      // 🚫 Preview inválido => no hacemos nada
      if (!isValidPreview(preview)) {
        console.warn("⛔ Preview inválido:", preview, song);
        setIsPlaying(false);
        return;
      }

      // ✅ si es la misma canción => reanudar
      const sameSong = currentSong?.preview === preview;

      if (sameSong) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.error("❌ audio.play() falló (sameSong):", err);
            setIsPlaying(false);
          });
        return;
      }

      // ✅ reset completo para canción nueva
      audio.pause();
      audio.currentTime = 0;

      setCurrentSong(song);

      audio.src = preview;
      audio.volume = 0.3;
      audio.load();

      console.log("🎧 Play:", audio.src);

      // ✅ intento normal
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("❌ audio.play() falló:", err, "SRC:", audio.src);
        setIsPlaying(false);

        // 🔥 FALLBACK AUTOMÁTICO:
        // Si falla el source (NotSupportedError, etc.), pedimos preview real al back
        try {
          const token = localStorage.getItem("token");
          if (!token || !song?._id) return;

          const res = await fetch(
            `http://localhost:4000/songs/fetch-audio/${song._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const data = await res.json();
          const updatedSong = data?.song;

          const updatedPreview = normalizePreview(updatedSong?.preview);

          if (!updatedSong?.preview || !isValidPreview(updatedPreview)) {
            console.warn(
              "⛔ fetch-audio no devolvió preview válido:",
              updatedSong?.preview
            );
            return;
          }

          // ✅ setear song actualizada
          setCurrentSong(updatedSong);

          // ✅ reintentar con preview real
          audio.pause();
          audio.currentTime = 0;
          audio.src = updatedPreview;
          audio.volume = 0.3;
          audio.load();

          console.log("🎧 Reintentando con preview real:", audio.src);

          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch((e) => {
              console.error("❌ Reintento falló:", e, "SRC:", audio.src);
              setIsPlaying(false);
            });
        } catch (e) {
          console.error("❌ fallback fetch-audio falló:", e);
        }
      }
    },
    [currentSong]
  );

  // ✅ Pausar
  const pauseSong = useCallback(() => {
    const audio = audioRef.current;
    audio.pause();
    setIsPlaying(false);
  }, []);

  // ✅ Reanudar (cuando currentSong existe)
  const resumeSong = useCallback(() => {
    const audio = audioRef.current;

    if (!currentSong) {
      console.warn("⛔ No se puede reanudar: currentSong null");
      return;
    }

    const preview = normalizePreview(currentSong.preview);

    if (!isValidPreview(preview)) {
      console.warn("⛔ No se puede reanudar: preview inválida");
      return;
    }

    if (!audio.src) {
      audio.src = preview;
      audio.load();
    }

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.error("❌ resumeSong falló:", err);
        setIsPlaying(false);
      });
  }, [currentSong]);

  // ✅ Stop total (limpia_attach player)
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