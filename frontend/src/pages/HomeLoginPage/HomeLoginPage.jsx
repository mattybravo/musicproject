// Imports
import Header from "../../components/Layout/Header";
import SideBar from "../../components/Layout/Sidebar";
import Footer from "../../components/Layout/Footer";
import MusicPlayer from "../../components/Music/MusicPlayer";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GetPlaylistById from "../../api/GetPlaylistById";
import RemoveSongsFromFavorites from "../../api/RemoveSongsFromFavorites";
import Eliminar from "../../assets/images/Eliminar.svg";
import { usePlayer } from "../../context/PlayerContext";
import axios from "axios";

const HomeLoginPage = () => {
  const navigate = useNavigate();

  const { playSong, stopSong, currentSong } = usePlayer();

  const [activePlaylistId, setActivePlaylistId] = useState(null);
  const [activePlaylistName, setActivePlaylistName] = useState("");
  const [songs, setSongs] = useState([]);

  const didInitRef = useRef(false);

  const clearActivePlaylist = useCallback(() => {
    setActivePlaylistId(null);
    setActivePlaylistName("");
    setSongs([]);

    localStorage.removeItem("activePlaylistId");
    localStorage.removeItem("activePlaylistName");

    stopSong();
  }, [stopSong]);

  const handleSelectPlaylist = useCallback(
    async (playlistId) => {
      try {
        const token = localStorage.getItem("token");

        if (!playlistId || !token) {
          clearActivePlaylist();
          return;
        }

        const playlist = await GetPlaylistById(playlistId, token);

        setActivePlaylistId(playlist._id);
        setActivePlaylistName(playlist.name);
        setSongs(playlist.songIds || []);

        localStorage.setItem("activePlaylistId", playlist._id);
        localStorage.setItem("activePlaylistName", playlist.name);

        stopSong();
      } catch (error) {
        console.error("Error cargando playlist:", error);
        clearActivePlaylist();
      }
    },
    [clearActivePlaylist, stopSong]
  );

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    const lastPlaylistId = localStorage.getItem("activePlaylistId");
    const favId = localStorage.getItem("favoritePlaylistId");

    if (lastPlaylistId) {
      handleSelectPlaylist(lastPlaylistId);
    } else if (favId) {
      handleSelectPlaylist(favId);
    } else {
      clearActivePlaylist();
    }
  }, [handleSelectPlaylist, clearActivePlaylist]);

  useEffect(() => {
    if (!currentSong) return;

    const stillExists = songs.some((s) => s._id === currentSong._id);
    if (!stillExists) {
      stopSong();
    }
  }, [songs, currentSong, stopSong]);

  const handlePlayFromHome = async (song) => {
    try {
    
      if (song?.preview && typeof song.preview === "string" && song.preview.startsWith("http")) {
        playSong(song);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `http://localhost:4000/songs/fetch-audio/${song._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedSong = res.data?.song;

      if (!updatedSong?.preview) {
        console.warn("⛔ Canción sigue sin preview después de fetch-audio:", updatedSong);
        return;
      }

      setSongs((prev) =>
        prev.map((s) => (s._id === updatedSong._id ? updatedSong : s))
      );

      playSong(updatedSong);
    } catch (error) {
      console.error("Error intentando reproducir canción:", error);
    }
  };

  const handleRemoveSong = async (songId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !activePlaylistId) return;

      await RemoveSongsFromFavorites(activePlaylistId, songId, token);

      setSongs((prev) => {
        const updated = prev.filter((s) => s._id !== songId);

        if (currentSong?._id === songId) {
          stopSong();
        }

        if (updated.length === 0) {
          stopSong();
        }

        return updated;
      });
    } catch (error) {
      console.error("Error al eliminar canción:", error);
    }
  };

  return (
    <section className="bg-mpDeep flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1">
        <SideBar
          onSelectPlaylist={handleSelectPlaylist}
          activePlaylistId={activePlaylistId}
        />

        <main className="flex-1 px-10 pt-10 pb-10">

          <div className="w-full flex justify-center mb-10">
            <MusicPlayer />
          </div>

          <div className="mb-6">
            <h2 className="text-white text-2xl font-bold leading-tight">
              {activePlaylistName || "Tu biblioteca"}
            </h2>

            <p className="text-white/40 text-xs font-mont mt-1">
              Gestioná tus canciones y armá tu biblioteca personal
            </p>
          </div>

          {!activePlaylistId ? (
            <div className="mt-6 w-full max-w-[520px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
              <p className="text-white/60 text-sm font-mont">
                No tenés una playlist seleccionada todavía.
              </p>

              <p className="text-white/40 text-xs font-mont mt-2">
                Creá una playlist desde el sidebar para empezar.
              </p>
            </div>
          ) : songs.length === 0 ? (
            <div className="mt-6 w-full max-w-[520px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
              <p className="text-white/60 text-sm font-mont">
                Esta playlist no tiene canciones todavía 🎧
              </p>

              <button
                onClick={() => navigate("/explorar")}
                className="mt-4 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-mpPurple text-white font-semibold font-mont shadow-md shadow-black/30 hover:opacity-90 transition"
              >
                Explorar canciones 🎵
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-6">
              {songs.map((song) => (
                <div
                  key={song._id}
                  className = "p-4 rounded-2xl flex justify-between items-center border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl shadow-black/25"
                >
                  <div
                    className = "flex gap-4 items-center cursor-pointer"
                    onClick={() => handlePlayFromHome(song)}
                  >
                    <img
                      src={song.imageUrl}
                      alt={song.title}
                      className = "w-14 h-14 rounded-xl object-cover"
                    />

                    <div className="min-w-0">
                      <h3 className="text-white font-bold truncate max-w-[420px]">
                        {song.title}
                      </h3>
                      <p className="text-mpPinkLight text-sm truncate max-w-[420px]">
                        {song.artist}
                      </p>

                      {!song.preview && (
                        <p className="text-white/40 text-[11px] mt-0.5 font-mont">
                          Tocá para cargar preview
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    className="hover:opacity-80 transition"
                    onClick={() => handleRemoveSong(song._id)}
                    title="Eliminar canción"
                  >
                    <img src={Eliminar} alt="Eliminar" className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </section>
  );
};

export default HomeLoginPage;
