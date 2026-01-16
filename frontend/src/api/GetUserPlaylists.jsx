//Imports
import axios from "axios";

const GetUserPlaylists = async (userId, token) => {
    const res = await axios.get( 
        `http://localhost:4000/playlists/user/${userId}`,
        {
            headers: { 
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
};

export default GetUserPlaylists;