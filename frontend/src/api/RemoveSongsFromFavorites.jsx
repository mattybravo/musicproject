//Imports
import axios from "axios";


const RemoveSongFromFavorites = async (playlistId, songId, token) => {
    const res = await axios.put ( `
        http://localhost:4000/playlists/${playlistId}/remove-song`,
        {songId},

        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        },
    )
    return res.data;
}

export default RemoveSongFromFavorites;