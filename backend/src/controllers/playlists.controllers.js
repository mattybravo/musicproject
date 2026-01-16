const playlistService = require (`../services/playlists.service`);

//GET - Todas las playlists por usuario
exports.getAllUserPlaylists = async (req, res) => {
    try {
        const {userId} = req.params;
        const playlists = await playlistService.getByUser(userId);
        res.status(200).json(playlists);
    } catch (error) {
        console.error(error.message);
        res.status(500).json ({message: "Error al obtener las playlists del usuario"});
    }
};
//GET - Una playlist por ID
exports.getUserPlaylistById = async (req, res) => {
    try {
        const {playlistId} = req.params;
        const playlist = await playlistService.getById(playlistId);
        if (!playlist) {return res.status(404).json({message: "Playlist no encontrada"})
        };
        res.status(200).json(playlist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: "Error al obtener la playlist"});
    }
};
//POST - Crear playlist
exports.createPlaylist = async (req, res) => {
    try {
        const data = {
        name: req.body.name,
        ownerId: req.user.id
        };
        const newPlaylist = await playlistService.createPlaylist(data);
        res.status(201).json(newPlaylist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json ({message: "Error al crear la playlist"});
    }
};
//PUT - Actualizar información de la playlist
exports.updatePlaylist = async (req, res) => {
    try {
        const {playlistId} = req.params;
        const data = req.body;
        const updated = await playlistService.updatePlaylist(playlistId, data);
        res.status(200).json(updated);
    } catch (error) {
        console.error(error.message);
        res.status(500).json ({message: "Error al actualizar información de la playlist"});
    }
};
//PUT - Añadir canción a la playlist
exports.addSongToPlaylist = async (req, res) => {
    try {
        const {playlistId} = req.params;
        const {songId} = req.body;
        const updated = await playlistService.addSongToPlaylist (playlistId, songId);
        res.status(200).json(updated);
    } catch (error) {
        console.error(error.message);
        res.status(500).json ({message: "Error al añadir canción a la playlist"});
    }
};
//PUT - Remover canción de la playlist
exports.removeSongFromPlaylist = async (req, res) => {
    try {
        const {playlistId} = req.params;
        const {songId} = req.body;
        const updated = await playlistService.removeSongFromPlaylist (playlistId, songId);
        res.status(200).json(updated);
    } catch (error) {
        console.error(error.message);
        res.status(500).json ({message: "Error al remover canción de la playlist"});
    }
};
//DELETE - Eliminar playlist
exports.deletePlaylist = async (req, res) => {
    try {
        const {playlistId} = req.params;
        await playlistService.deletePlaylist(playlistId)
        res.status(200).json({ message: "Playlist eliminada correctamente" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json ({message: "Error al eliminar la playlist"});
    }
};

