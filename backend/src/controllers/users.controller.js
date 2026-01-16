const User = require (`../models/users.models`);
const jwt = require (`jsonwebtoken`);
const Playlist = require (`../models/playlists.models`);

//REGISTRO del usuario
exports.register = async (req, res) => {
    try {
        const {username, email, password} = req.body;                 
        //1 - Validación básica
        if (!username || !email || !password) {
            return res.status(400).json({error: "todos los campos son requeridos"})
        }

        //2 - Verificar si el email ya está en uso
        const existingUser = await User.findOne({email});
        if (existingUser) { return res.status(409).json({ error: "El email ya está registrado" });}

        //3 - Crear nuevo usuario
        const newUser = await User.create ({username, email, password});

        //4 - Crear playlist Favoritos automáticamente al registrarse
        await Playlist.create({
            name: "Favoritos",
            ownerId: newUser._id,
            songIds: []
        });

        //5 - Generar JWT
        const token = jwt.sign(
        {id: newUser._id},
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
        );

        //6 - Responder al front
        return res.status(201).json({
            message: "Usuario creado",
            user:{id: newUser._id,
            username: newUser.username,
            email: newUser.email},
            token
            }
        );

    } catch (error) {
        return res.status(500).json ({error: "Error interno del servidor"});
    }
};

//LOGIN del usuario
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        //1 - Validación básica
        if (!email || !password) {
            return res.status(400).json ({error: "Email y contraseña requeridos"});
        }

        //2 - Buscar usuario en Mongo
        const user = await User.findOne({email});
        if (!user) {return res.status(401).json({error: "Credenciales inválidas"})};

        //3 - Comparar contraseña
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {return res.status(401).json ({error: "Credenciales inválidas"})};

        //4 - Generar JWT
          const token = jwt.sign(
        {id: user._id, username: user.username}, 
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
        );

        //5 - añadir la playlist Favoritos en la respuesta
        const favPlaylist = await Playlist.findOne ({
            ownerId : user._id,
            name: "Favoritos",
        });

        //6 - Responder al front
        return res.status(200).json({
            message: "Login exitoso",
            user: {
            id: user._id,
            username: user.username,
            email: user.email
            },
            favoritePlaylistId: favPlaylist ? favPlaylist._id : null,
            token
        });


    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};