const express = require (`express`);
const router = express.Router();
const playlistController = require (`../controllers/playlists.controllers`);
const {authenticateToken} = require (`../middleware/auth.middleware`);
//Routes que requieren estar autenticadas
router.get(`/user/:userId`, authenticateToken, playlistController.getAllUserPlaylists);
router.get(`/:playlistId`, authenticateToken, playlistController.getUserPlaylistById);
router.post(`/`, authenticateToken, playlistController.createPlaylist);
router.put(`/:playlistId`, authenticateToken, playlistController.updatePlaylist);
router.put(`/:playlistId/add-song`, authenticateToken, playlistController.addSongToPlaylist);
router.put(`/:playlistId/remove-song`, authenticateToken, playlistController.removeSongFromPlaylist);
router.delete(`/:playlistId`, authenticateToken, playlistController.deletePlaylist);

module.exports = router;
