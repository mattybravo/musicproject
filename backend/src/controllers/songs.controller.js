const songsService = require (`../services/songs.service`);
const Song = require (`../models/song.models`);
//GET
exports.getAllSongs = async (req, res) => {
    try {
        const songs = await songsService.getAllSongs ();
        res.status(200).json(songs);
    } catch (error) {
        console.error(error.message);
        res.status(500).json ({message: "Error al obtener las canciones"});
    }
};
//GET - Obtener canciones por id
exports.getSongsById = async (req, res) => {
    try {
        const song = await songsService.getSongById (req.params.songId);
        if (!song) {
        return res.status(404).json({error:`Canción no encontrada`})
        };
        res.status(200).json(song);
    } catch (error) {
      console.error(error.message)
      res.status(500).json ({message: "Error al obtener la canción"});
    }
};
//GET
exports.getSongsByGenre = async (req, res) => {
    try {
        const {genreId} = req.params;
        const songs = await songsService.getSongByGenre (genreId);
        if (!songs || songs.length == 0) {
            return res.status(404).json({message: "No hay canciones para este género"});
        }
        res.status(200).json(songs)
    } catch (error) {
        console.error(error.message);
        res.status(500).json ({message: "Error al obtener las canciones por género"});
    }
}
//GET 
exports.fetchAudioDeezer = async (req, res) => {
    try {
        const {songId} = req.params;
        const updatedSong = await songsService.getPreviewAndUpdate (songId);
        return res.status(200).json ({message: "Preview obtenido y canción actualizada", song: updatedSong});
    } catch (error) {
        return res.status(500).json ({message: "No se pudo obtener el preview", error: error.message});
    }
};

//POST
exports.createSongFromDeezer = async (req, res) => {
  try {
    const { deezerId, title, artist, imageUrl, preview } = req.body;

    if (!deezerId || !title || !artist || !imageUrl) {
      return res.status(400).json({
        message: "Datos incompletos",
      });
    }

    let song = await Song.findOne({ deezerId });
    if (song) return res.status(200).json(song);

    const isBlockedPreview = (p) =>
      typeof p === "string" &&
      p.includes("cdnt-preview.dzcdn.net") &&
      p.includes("/api/1/1/");

    let realPreview = "";

    // 1) Intentar obtener preview real desde Deezer
    try {
      const deezerRes = await axios.get(
        `https://api.deezer.com/track/${deezerId}`
      );

      const deezerPreview = deezerRes.data?.preview;
      if (typeof deezerPreview === "string" && deezerPreview.trim() !== "") {
        realPreview = deezerPreview.trim();
      }
    } catch (_) {
      // sin acción (fallback abajo)
    }

    // 2) Fallback al preview recibido si es válido
    if (!realPreview && typeof preview === "string" && preview.trim() !== "") {
      const candidate = preview.trim();
      if (!isBlockedPreview(candidate)) {
        realPreview = candidate;
      }
    }

    // 3) Si sigue bloqueado o inválido -> guardar vacío (NO cortar el add)
    if (!realPreview || isBlockedPreview(realPreview)) {
      realPreview = "";
    }

    song = await Song.create({
      deezerId,
      title,
      artist,
      imageUrl,
      preview: realPreview, 
    });

    return res.status(200).json(song);
  } catch (error) {
    return res.status(500).json({
      message: "Error creando canción",
      error: error.message,
    });
  }
};
