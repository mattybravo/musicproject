const mongoose = require (`mongoose`);
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema (
 {
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
 },
    {timestamps: true}
);

//pre save y hasheo de la contraseña
userSchema.pre("save", async function (next) { 
   try {
      if (!this.isModified("password")) return next();
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash (this.password, salt);
      return next(); // continua el guardado
   }   
   catch (err) {
      return next(err);
   }
});
//comparar contraseña
userSchema.methods.comparePassword = async function (passwordIngresada) {
   return bcrypt.compare (passwordIngresada, this.password);
};

const User = mongoose.model(`User`, userSchema);

module.exports = User;

