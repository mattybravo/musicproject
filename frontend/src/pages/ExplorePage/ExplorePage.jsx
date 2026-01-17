// Imports
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import GetAllSongs from "../../api/GetAllSongs";
import GetSongsByGenreOnDeezer from "../../api/GetSongsByGenreOnDeezer";
import AddSongToFavorites from "../../api/AddSongToFavorites";
import SongCard from "../../components/Music/SongCard";
import { usePlayer } from "../../context/PlayerContext";
import GetPlaylistById from "../../api/GetPlaylistById";

const ExplorePage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [canAddSongs, setCanAddSongs] = useState(true);
  const [playlistName, setPlaylistName] = useState("");

  const [uiMessage, setUiMessage] = useState({
    show: false,
    type: "info",
    title: "",
    text: "",
    actionLabel: "",
    onAction: null,
  });

  const { playSong } = usePlayer();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const getStoredPlaylistId = () =>
    localStorage.getItem("activePlaylistId") ||
    localStorage.getItem("favoritePlaylistId");

  const showMessage = useCallback((payload) => {
    setUiMessage({
      show: true,
      type: payload.type || "info",
      title: payload.title || "",
      text: payload.text || "",
      actionLabel: payload.actionLabel || "",
      onAction: payload.onAction || null,
    });
  }, []);

  const hideMessage = useCallback(() => {
    setUiMessage((prev) => ({ ...prev, show: false }));
  }, []);

  useEffect(() => {
    const validate = async () => {
      const storedPlaylistId = getStoredPlaylistId();

      if (!token) {
        setCanAddSongs(false);
        setPlaylistName("");
        showMessage({
          type: "warning",
          title: "Necesitás iniciar sesión",
          text: "Para agregar canciones a una playlist, primero iniciá sesión.",
          actionLabel: "Iniciar sesión",
          onAction: () => navigate("/login"),
        });
        return;
      }

      if (!storedPlaylistId) {
        setCanAddSongs(false);
        setPlaylistName("");
        showMessage({
          type: "info",
          title: "No hay playlist seleccionada",
          text: "Volvé a tu biblioteca, creá una playlist y después agregá canciones desde acá.",
          actionLabel: "Ir a Biblioteca",
          onAction: () => navigate("/home"),
        });
        return;
      }

      try {
        const playlist = await GetPlaylistById(storedPlaylistId, token);

        setPlaylistName(playlist?.name || "Playlist");
        setCanAddSongs(true);

        localStorage.setItem("activePlaylistId", playlist._id);
        localStorage.setItem("activePlaylistName", playlist.name);

        hideMessage();
      } catch {
        localStorage.removeItem("activePlaylistId");
        localStorage.removeItem("activePlaylistName");

        setCanAddSongs(false);
        setPlaylistName("");

        showMessage({
          type: "warning",
          title: "La playlist ya no existe",
          text: "Parece que la playlist seleccionada fue eliminada. Volvé a tu biblioteca y elegí otra.",
          actionLabel: "Ir a Biblioteca",
          onAction: () => navigate("/home"),
        });
      }
    };

    validate();
  }, [token, navigate, showMessage, hideMessage]);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const [localSongs, deezerSongsRaw] = await Promise.all([
          GetAllSongs(),
          GetSongsByGenreOnDeezer(),
        ]);

        const deezerSongs = Array.from(
          new Map(deezerSongsRaw.map((s) => [s.deezerId, s])).values()
        ).slice(0, 5);

        setSongs([...deezerSongs, ...localSongs]);
      } catch {
        showMessage({
          type: "error",
          title: "Error cargando canciones",
          text: "No pudimos cargar las canciones. Probá recargar la página.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, [showMessage]);

  const handlePlayExplore = async (song) => {
    try {
      const hasPreview =
        typeof song?.preview === "string" && song.preview.startsWith("http");

      if (!song?._id) {
        if (hasPreview) playSong(song);
        return;
      }

      if (hasPreview) {
        playSong(song);
        return;
      }

      const t = localStorage.getItem("token");
      if (!t) return;

      const res = await axios.get(
        `http://localhost:4000/songs/fetch-audio/${song._id}`,
        { headers: { Authorization: `Bearer ${t}` } }
      );

      const updatedSong = res.data?.song;
      if (!updatedSong?.preview) return;

      setSongs((prev) =>
        prev.map((s) => (s._id === updatedSong._id ? updatedSong : s))
      );

      playSong(updatedSong);
    } catch {
      // silencioso (no rompe UX)
    }
  };

  const handleAddSong = async (song) => {
    try {
      if (!token) {
        showMessage({
          type: "warning",
          title: "Necesitás iniciar sesión",
          text: "Iniciá sesión para poder agregar canciones a tus playlists.",
          actionLabel: "Iniciar sesión",
          onAction: () => navigate("/login"),
        });
        return;
      }

      if (!canAddSongs) {
        showMessage({
          type: "info",
          title: "Primero seleccioná una playlist",
          text: "Volvé a tu biblioteca, creá o seleccioná una playlist y después agregá canciones.",
          actionLabel: "Ir a Biblioteca",
          onAction: () => navigate("/home"),
        });
        return;
      }

      const playlistId = getStoredPlaylistId();

      if (!playlistId) {
        showMessage({
          type: "info",
          title: "No hay playlist activa",
          text: "Volvé a tu biblioteca y elegí una playlist.",
          actionLabel: "Ir a Biblioteca",
          onAction: () => navigate("/home"),
        });
        return;
      }

      let songId = song._id;

      if (!songId && song.deezerId) {
        const res = await axios.post(
          "http://localhost:4000/songs/from-deezer",
          song,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        songId = res.data._id;
      }

      await AddSongToFavorites(playlistId, songId, token);

      const name = localStorage.getItem("activePlaylistName") || "Playlist";

      showMessage({
        type: "success",
        title: "Canción agregada",
        text: `Se añadió correctamente a "${name}".`,
      });

      setTimeout(hideMessage, 2600);
    } catch {
      showMessage({
        type: "error",
        title: "No se pudo agregar",
        text: "Hubo un error al añadir la canción. Intentá de nuevo.",
      });
    }
  };

  const messageStyles = {
    info: "border-white/10 bg-white/5",
    success: "border-white/10 bg-white/5",
    warning: "border-white/10 bg-white/5",
    error: "border-white/10 bg-white/5",
  };

  if (loading) {
    return (
      <section className="bg-mpDeep min-h-screen px-10 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <p className="text-white/70 text-[13px] font-mont">
              Cargando canciones...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-mpDeep min-h-screen px-10 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <h2 className="text-white text-3xl font-semibold tracking-tight">
              Explorar canciones
            </h2>
            <p className="text-white/50 text-[13px] font-mont mt-1">
              Elegí canciones y agregalas a tus playlists.
            </p>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="
              shrink-0
              px-4 py-2 rounded-full
              border border-white/10
              bg-white/5
              text-white/80 text-[13px] font-mont
              hover:bg-white/10 hover:text-white
              transition
            "
          >
            ← Volver a tu biblioteca
          </button>
        </div>

        {uiMessage.show && (
          <div
            className={`
              mb-6 rounded-3xl border backdrop-blur-xl p-5
              ${messageStyles[uiMessage.type]}
            `}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-white font-semibold text-[14px] font-mont">
                  {uiMessage.title}
                </p>
                <p className="text-white/60 text-[13px] font-mont mt-1">
                  {uiMessage.text}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {uiMessage.actionLabel && uiMessage.onAction && (
                  <button
                    onClick={uiMessage.onAction}
                    className="
                      px-4 py-2 rounded-full
                      border border-white/10 bg-white/5
                      text-white text-[13px] font-mont font-semibold
                      hover:bg-white/10 transition
                    "
                  >
                    {uiMessage.actionLabel}
                  </button>
                )}

                <button
                  onClick={hideMessage}
                  className="
                    px-4 py-2 rounded-full
                    text-white/60 text-[13px] font-mont
                    hover:text-white transition
                  "
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
          {canAddSongs ? (
            <p className="text-white/60 text-[13px] font-mont">
              Agregando canciones a:{" "}
              <span className="text-white font-semibold">{playlistName}</span>
            </p>
          ) : (
            <p className="text-white/60 text-[13px] font-mont">
              Para agregar canciones necesitás una playlist activa.
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {songs.map((song) => (
            <SongCard
              key={song._id || song.deezerId}
              title={song.title}
              artist={song.artist}
              imageUrl={song.imageUrl}
              onPlay={() => handlePlayExplore(song)}
              onAddFavorite={() => handleAddSong(song)}
              disabledAdd={!canAddSongs}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExplorePage;
