const mongoose = require (`mongoose`);

const songSchema = new mongoose.Schema (
 {
      title: {type: String, required: true},
      artist: {type: String, required: true},
      imageUrl: {type: String, required: true},
      genreId: {type: mongoose.Schema.Types.ObjectId, ref: 'Genre',}, 
      audioUrl: {type: String},
      deezerId: { type: Number, unique: true, sparse: true },
      preview: { type: String },

 },
    {timestamps: true}
);

const Song = mongoose.model(`Song`, songSchema);

module.exports = Song;