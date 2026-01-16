const express = require (`express`);
const router = express.Router ();
const deezerController = require (`../controllers/deezer.controller`)
//Routes
router.get (`/search`, deezerController.searchSongs);

module.exports = router;