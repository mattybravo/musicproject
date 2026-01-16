import axios from "axios";

const CreatePlaylist = async (name, token) => {
    const res = await axios.post (
        "http://localhost:4000/playlists",
        {name},
        
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
}

export default CreatePlaylist;
