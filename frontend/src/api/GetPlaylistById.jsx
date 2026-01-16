//Imports
import axios from "axios";

const GetPlaylistById = async (playlistId, token) => {
    const res = await axios.get(
    `http://localhost:4000/playlists/${playlistId}`,

        {
            headers: { Authorization: `Bearer ${token}`}

        }
    );
    return res.data;
};

export default GetPlaylistById;