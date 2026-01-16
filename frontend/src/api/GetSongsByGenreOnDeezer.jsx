// Imports
import axios from "axios";

const GetSongsByGenreOnDeezer = async () => {
  const res = await axios.get(
    "http://localhost:4000/deezer/search"
  );

  return res.data.map(song => ({
    deezerId: song.id, 
    title: song.title,
    artist: song.artist,
    preview: song.preview,
    imageUrl: song.imageUrl,
  }));
};

export default GetSongsByGenreOnDeezer;
