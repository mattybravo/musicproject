//Imports
import axios from "axios";

const GetAllSongs = async () => {
    const { data } = await axios.get ("http://localhost:4000/songs");
    return data;
};

export default GetAllSongs;