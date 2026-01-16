const axios = require("axios");

exports.searchSongs = async (req, res) => {
  try {
    const chartRes = await axios.get(
      "https://api.deezer.com/chart/0/tracks?limit=20"
    );

    const chartSongs = chartRes.data.data
      .filter(song => song.preview)
      .map(song => ({
        id: song.id,
        title: song.title,
        artist: song.artist.name,
        imageUrl: song.album.cover_medium,
        preview: song.preview,
      }));

    const searchRes = await axios.get(
      "https://api.deezer.com/search?q=music"
    );

    const searchSongs = searchRes.data.data
      .filter(song => song.preview)
      .map(song => ({
        id: song.id,
        title: song.title,
        artist: song.artist.name,
        imageUrl: song.album.cover_medium,
        preview: song.preview,
      }));

    const combined = [...chartSongs, ...searchSongs];

    const unique = Array.from(
      new Map(combined.map(song => [song.id, song])).values()
    );

    res.status(200).json(unique.slice(0, 10));
  } catch (error) {
    console.error("Deezer error:", error.message);
    res.status(500).json({ message: "Error Deezer" });
  }
};
