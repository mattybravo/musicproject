const Playlist = require (`../models/playlists.models`);

//GET - Todas las playlists por usuario en la DB
exports.getByUser  = async (userId) => {
    return await Playlist.find({ownerId: userId });
};
//GET - Traer Una playlist por id en la DB
exports.getById = async (playlistId) => {
    return await Playlist.findById(playlistId)
    .populate("songIds"); 
};
//POST - Playlist creada 
exports.createPlaylist = async (data) => {
    return await Playlist.create(data);    
};
//PUT - Playlist actualizada
exports.updatePlaylist = async (playlistId, data) => {
    return await Playlist.findByIdAndUpdate(playlistId, data, {new: true});
};
//PUT - Canción añadida a la playlist
exports.addSongToPlaylist = async (playlistId, songId) => {
    return await Playlist.findByIdAndUpdate(playlistId, {$push: {songIds: songId}}, {new: true});
};
//PUT- Canción removida de la playlist
exports.removeSongFromPlaylist = async (playlistId, songId) => {
    return await Playlist.findByIdAndUpdate(playlistId, {$pull: {songIds: songId}}, {new: true});
};
//DELETE - Playlist borrada
exports.deletePlaylist = async (playlistId) => {
    return await Playlist.findByIdAndDelete(playlistId);
};


