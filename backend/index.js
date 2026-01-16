//Imports
const express = require (`express`);
const connectDB = require (`./src/config/db.js`);
const dotenv = require (`dotenv`);
const cors = require (`cors`);
//Routes
const songsRouter = require (`./src/routes/songs.router.js`)
const playlistRouter = require (`./src/routes/playlists.router.js`);
const genreRouter = require (`./src/routes/genres.router.js`);
const userRouter = require (`./src/routes/users.router.js`);
const deezerRouter = require (`./src/routes/deezer.router.js`);

//Env
dotenv.config();

//App
const app = express ();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true}));
app.use(express.json());
app.use(`/songs`, songsRouter);
app.use(`/playlists`, playlistRouter);
app.use(`/genres`, genreRouter);
app.use(`/users`, userRouter);
app.use(`/deezer`, deezerRouter);

//DB
connectDB();

//Port
const PORT = process.env.PORT || 4000;

app.get (`/`, (req, res) => {
    res.send (`Hola desde Express!`);});
//Start server
app.listen (PORT, () => {
    console.log (`servidor corriendo en http://localhost:${PORT}`);
})