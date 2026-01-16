import axios from "axios";

const UpdatePlaylist = async (playlistId, name, token) => {
  const res = await axios.put(
    `http://localhost:4000/playlists/${playlistId}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export default UpdatePlaylist;
