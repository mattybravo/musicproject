const express = require (`express`);
const router = express.Router();
const songController = require (`../controllers/songs.controller`);
//Routes
router.get (`/`, songController.getAllSongs);
router.get (`/:songId`, songController.getSongsById);
router.get (`/genre/:genreId`, songController.getSongsByGenre);
router.get (`/fetch-audio/:songId`, songController.fetchAudioDeezer);
router.post (`/from-deezer`, songController.createSongFromDeezer);
module.exports = router;