const express = require (`express`);
const router = express.Router();
const genreController = require (`../controllers/genres.controller`);
//Routes
router.get(`/`, genreController.getAllGenres);
router.get(`/:genreId`, genreController.getGenreById);

module.exports = router;