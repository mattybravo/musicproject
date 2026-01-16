//Imports
import axios from "axios";

const DeletePlaylist = async (playlistId, token) => {
  const res = await axios.delete(
    `http://localhost:4000/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export default DeletePlaylist;
