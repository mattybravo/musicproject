const Genre = require (`../models/genres.models`);

//GET - Todos los géneros
exports.getAllGenres = async () => {
    return await Genre.find();
};
//GET - Solo un género
exports.getGenreById = async (genreId) => {
    if (!mongoose.Types.ObjectId.isValid(genreId)) return null;
    return await Genre.findById(genreId);
};