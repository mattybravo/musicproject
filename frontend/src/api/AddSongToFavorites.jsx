// Imports
import axios from "axios";

const AddSongToFavorites = async (playlistId, songId, token) => {
  // Validaciones
  if (!token) throw new Error("TOKEN_MISSING");
  if (!playlistId) throw new Error("PLAYLIST_MISSING");
  if (!songId) throw new Error("SONG_MISSING");

  try {
    const res = await axios.put(
      `http://localhost:4000/playlists/${playlistId}/add-song`,
      { songId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    const status = error?.response?.status;

    // Playlist inexistente (la borraron o quedó id viejo)
    if (status === 404) {
      localStorage.removeItem("activePlaylistId");
      localStorage.removeItem("activePlaylistName");
      throw new Error("PLAYLIST_NOT_FOUND");
    }

    // Token inválido o expirado
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("favoritePlaylistId");
      localStorage.removeItem("activePlaylistId");
      localStorage.removeItem("activePlaylistName");
      localStorage.removeItem("username");
      throw new Error("AUTH_ERROR");
    }

    // Error genérico
    throw new Error("ADD_SONG_ERROR");
  }
};

export default AddSongToFavorites;


