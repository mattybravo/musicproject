const Song = require (`../models/song.models`);
const axios = require (`axios`);
//GET - Traer todas las canciones de la DB
exports.getAllSongs = async () => {
    return await Song.find();
};
//GET - Traer Canciones por id de la DB
exports.getSongById = async (id) => {
    return await Song.findById(id);
};
//GET - Traer canciones por género de la DB
exports.getSongByGenre = async (genreId) => {
    return await Song.find({genreId});
};
//POST - Subir audioUrl a las canciones
exports.getPreviewAndUpdate = async (songId) => {
    //1 - Buscar canción en Mongo
    const song = await Song.findById(songId);
    if (!song) throw new Error("Canción no encontrada en MongoDB");

    //2 - Texto de busqueda para la API de Deezer
    const searchQuery = `${song.title} ${song.artist}`;
    const encodedQuery = encodeURIComponent (searchQuery);

    //3 - Llamar a la API
    const url = `https://api.deezer.com/search?q=${encodedQuery}`;
    const response = await axios.get(url);

    //4 - Lista de resultados
    const results = response.data.data;
    if (!results || results.length === 0) {throw new Error("No se encontraron resultados en Deezer")};

    //5 - Primer resultado
    const songData = results[0];
    if (!songData) {throw new Error("No se encontraron resultados en Deezer")};

    //6 - Actualizar canción de la DB
    song.preview = songData.preview;
    await song.save();

    //7- Devolverl la canción actualizada
    return song;
};
