const jwt = require (`jsonwebtoken`);

//Middleware - Verifica que el token JWT sea válido
exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization; //formato "Bearer <token>"
    const token = authHeader?.split (` `)[1];

    if (!token) {return res.status(401).json ({message: "Token no proporcionado."})}

    try {
        const decoded = jwt.verify (token, process.env.JWT_SECRET);
        req.user = decoded; //Datos del token
        next(); // Paso a la ruta protegida
    } catch (error) {
        return res.status(403).json ({error: "Token inválido o expirado"});
    }
};


