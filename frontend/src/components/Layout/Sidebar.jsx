// Imports
import { useEffect, useState, useCallback, useMemo } from "react";
import SignoMas2 from "../../assets/images/SignoMas2.svg";
import Editar from "../../assets/images/Editar.svg";
import Eliminar from "../../assets/images/Eliminar.svg";
import GetUserPlaylists from "../../api/GetUserPlaylists";
import CreatePlaylist from "../../api/CreatePlaylist";
import DeletePlaylist from "../../api/DeletePlaylist";
import UpdatePlaylist from "../../api/UpdatePlaylist";

const SideBar = ({ onSelectPlaylist, activePlaylistId }) => {
  const [playlists, setPlaylists] = useState([]);

  const [modal, setModal] = useState({
    open: false,
    type: "", // create | rename | delete
    playlistId: null,
    currentName: "",
  });

  const [text, setText] = useState("");

  const closeModal = useCallback(() => {
    setModal({ open: false, type: "", playlistId: null, currentName: "" });
    setText("");
  }, []);

  const loadPlaylists = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;

    try {
      const data = await GetUserPlaylists(userId, token);
      setPlaylists(data.filter((p) => p.name !== "Favoritos"));
    } catch {
      // silencioso (para repo público)
    }
  }, []);

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  const openCreate = () => {
    setText("");
    setModal({ open: true, type: "create", playlistId: null, currentName: "" });
  };

  const openRename = (playlistId, currentName) => {
    setText(currentName);
    setModal({ open: true, type: "rename", playlistId, currentName });
  };

  const openDelete = (playlistId, currentName) => {
    setModal({ open: true, type: "delete", playlistId, currentName });
  };

  const handleConfirm = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (modal.type === "create") {
        const name = text.trim();
        if (!name) return;
        await CreatePlaylist(name, token);
      }

      if (modal.type === "rename") {
        const newName = text.trim();
        if (!newName || newName === modal.currentName) return;
        await UpdatePlaylist(modal.playlistId, newName, token);
      }

      if (modal.type === "delete") {
        await DeletePlaylist(modal.playlistId, token);
        if (activePlaylistId === modal.playlistId) onSelectPlaylist(null);
      }

      await loadPlaylists();
      closeModal();
    } catch {
      // silencioso
    }
  };

  const modalTitle = useMemo(() => {
    if (modal.type === "delete") return "Eliminar playlist";
    if (modal.type === "rename") return "Editar playlist";
    return "Nueva playlist";
  }, [modal.type]);

  return (
    <>
      <aside
        className="
          w-[300px]
          min-h-[calc(100vh-72px)]
          border-r border-white/10
          bg-mpNight/40
          backdrop-blur-xl
          px-6 pt-10
          text-white
        "
      >
        <h3 className="font-exo font-semibold text-[22px] tracking-tight mb-6">
          Tu Biblioteca
        </h3>

        {playlists.length === 0 && (
          <p className="text-white/45 text-[13px] mb-6 font-mont">
            Todavía no creaste playlists
          </p>
        )}

        <div className="flex flex-col gap-3">
          {playlists.map((pl) => {
            const isActive = activePlaylistId === pl._id;

            return (
              <div
                key={pl._id}
                className={`
                  group w-full rounded-2xl border transition
                  ${isActive ? "border-white/20 bg-white/10" : "border-white/10 bg-white/5"}
                  hover:bg-white/10
                `}
              >
                <div className="w-full h-[54px] flex items-center justify-between px-4">
                  <button
                    type="button"
                    onClick={() => onSelectPlaylist(pl._id)}
                    className="
                      flex-1 text-left
                      font-mont text-[14px]
                      text-white/90
                      transition
                      pr-3
                    "
                  >
                    <span
                      className={`block truncate ${isActive ? "text-white font-semibold" : ""}`}
                    >
                      {pl.name}
                    </span>
                  </button>

                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={() => openRename(pl._id, pl.name)}
                      className="opacity-80 hover:opacity-100 transition"
                      title="Editar nombre"
                    >
                      <img
                        src={Editar}
                        alt="Editar"
                        className="w-[18px] h-[18px]"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => openDelete(pl._id, pl.name)}
                      className="opacity-80 hover:opacity-100 transition"
                      title="Eliminar playlist"
                    >
                      <img
                        src={Eliminar}
                        alt="Eliminar"
                        className="w-[18px] h-[18px]"
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={openCreate}
          className="
            mt-10 w-full
            flex items-center justify-center gap-3
            rounded-2xl
            border border-white/10
            bg-white/5
            px-4 py-3
            font-mont text-[14px]
            text-white/85
            hover:bg-white/10 hover:text-white
            transition
          "
        >
          <img
            src={SignoMas2}
            className="w-5 h-5 opacity-90"
            alt="Nueva playlist"
          />
          Nueva playlist
        </button>
      </aside>

      {modal.open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-6">
          <button
            className="absolute inset-0 bg-black/60"
            onClick={closeModal}
            aria-label="Cerrar modal"
          />

          <div
            className="
              relative w-full max-w-[420px]
              rounded-3xl border border-white/10
              bg-white/5 backdrop-blur-xl
              p-6
              shadow-2xl shadow-black/40
              text-white
            "
          >
            <h3 className="font-exo text-xl font-semibold tracking-tight">
              {modalTitle}
            </h3>

            {modal.type === "delete" ? (
              <p className="font-mont text-[13px] text-white/65 mt-2">
                ¿Seguro que querés eliminar{" "}
                <span className="text-white font-semibold">
                  "{modal.currentName}"
                </span>
                ? Esta acción no se puede deshacer.
              </p>
            ) : (
              <>
                <p className="font-mont text-[13px] text-white/65 mt-2">
                  {modal.type === "rename"
                    ? "Actualizá el nombre de tu playlist."
                    : "Elegí un nombre para tu playlist."}
                </p>

                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Nombre de la playlist"
                  className="
                    mt-5 w-full
                    rounded-2xl border border-white/10
                    bg-white/5 backdrop-blur-xl
                    px-4 py-3
                    font-mont text-[13px]
                    text-white placeholder:text-white/35
                    outline-none
                    focus:border-white/20
                  "
                  autoFocus
                />
              </>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="
                  px-4 py-2 rounded-full
                  border border-white/10 bg-white/5
                  text-white/80 text-[13px] font-mont
                  hover:bg-white/10 hover:text-white
                  transition
                "
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirm}
                className={`
                  px-4 py-2 rounded-full
                  text-white text-[13px] font-mont font-semibold
                  transition
                  ${
                    modal.type === "delete"
                      ? "bg-mpHotPink/90 hover:opacity-95"
                      : "bg-mpPurple hover:opacity-95"
                  }
                `}
              >
                {modal.type === "delete"
                  ? "Eliminar"
                  : modal.type === "rename"
                  ? "Guardar"
                  : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
