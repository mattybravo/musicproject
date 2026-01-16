//Imports
import axios from "axios";

const GetAllGenres = async () => {
    const { data } = await axios.get ("http://localhost:4000/genres");
    return data;
}

export default GetAllGenres;