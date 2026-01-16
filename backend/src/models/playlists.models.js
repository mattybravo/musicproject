const mongoose = require (`mongoose`);

const playlistSchema = mongoose.Schema (
 {
    name: {type: String, required: true},
    ownerId: {type: mongoose.Schema.Types.ObjectId, ref: `User`, required: true},
    songIds: [{type: mongoose.Schema.Types.ObjectId, ref: `Song`}]
 },
    {timestamps: true}
);

const Playlist = mongoose.model (`Playlist`,playlistSchema);

module.exports = Playlist;
