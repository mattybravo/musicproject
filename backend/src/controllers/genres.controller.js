const genresService = require (`../services/genres.service`);

//GET - Traer todas los géneros
exports.getAllGenres = async (req, res) => {
    try {
        const genres = await genresService.getAllGenres();
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json ({message: "Error al traer los géneros"});
    }
};
//GET - Traer un solo género
exports.getGenreById = async (req, res) => {
    try {
         const {genreId} = req.params;
        const genre = await genresService.getGenreById(genreId);
        if (!genre) {
        return res.status(404).json({message: "Género no encontrado"}) 
        };
        res.status(200).json(genre);
    } catch (error) {
        res.status(500).json ({message: "Error al traer el género"});
    }
};
