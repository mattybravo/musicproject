// Imports
import axios from "axios";
import Mail from "../../assets/images/Mail.svg";
import Candado from "../../assets/images/Candado.svg";
import Logo from "../../assets/images/Logo.svg";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { saveToken } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [uiMessage, setUiMessage] = useState({
    show: false,
    type: "info",
    text: "",
  });

  const timerRef = useRef(null);

  const showMessage = (type, text) => {
    setUiMessage({ show: true, type, text });

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setUiMessage((p) => ({ ...p, show: false }));
    }, 2600);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showMessage("warning", "Completá tu email y contraseña para ingresar.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/users/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("favoritePlaylistId", res.data.favoritePlaylistId);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("username", res.data.user.username);

      localStorage.removeItem("activePlaylistId");
      localStorage.removeItem("activePlaylistName");

      saveToken(res.data.token);

      showMessage("success", "Sesión iniciada correctamente. Bienvenido 🎧");

      setTimeout(() => {
        navigate("/home");
      }, 700);
    } catch (error) {
      const msg =
        error.response?.data?.message || "Email o contraseña incorrectos.";

      showMessage("error", msg);
    }
  };

  const messageStyles = {
    success: "border-white/10 bg-white/5",
    warning: "border-white/10 bg-white/5",
    error: "border-white/10 bg-white/5",
    info: "border-white/10 bg-white/5",
  };

  return (
    <div className="min-h-screen bg-mpDeep flex flex-col items-center justify-center px-6 py-10">
      <div
        className="flex items-center justify-center mb-10 cursor-pointer select-none"
        onClick={() => navigate("/")}
      >
        <h1 className="text-4xl font-bold text-white font-exo">
          Music
          <span className="text-mpPurpleSoft ml-2">Project</span>
        </h1>

        <img
          src={Logo}
          alt="Logo-login"
          className="w-11 h-11 ml-3 rounded-full"
        />
      </div>

      <div
        className="
          w-full max-w-[720px]
          rounded-3xl
          border border-white/10
          bg-white/5
          backdrop-blur-xl
          shadow-2xl shadow-black/40
          p-8 md:p-12
        "
      >
        {uiMessage.show && (
          <div
            className={`
              mb-6 rounded-2xl border backdrop-blur-xl px-5 py-4
              ${messageStyles[uiMessage.type]}
            `}
          >
            <p className="text-white/85 text-[13px] font-mont">
              {uiMessage.text}
            </p>
          </div>
        )}

        <h3 className="text-white text-2xl font-semibold text-start font-mont">
          Iniciar sesión
        </h3>

        <p className="text-white/60 text-sm font-mont mt-2">
          Accedé a tu biblioteca y seguí armando tus playlists ✨
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-6 mt-10"
        >
          <div
            className="
              flex items-center w-full max-w-[580px] h-16 px-6
              rounded-full
              border border-white/10
              bg-white/5
              transition
              focus-within:border-white/25
              focus-within:bg-white/10
            "
          >
            <img
              src={Mail}
              alt="emailIcon"
              className="w-6 h-6 mr-4 opacity-70"
            />
            <input
              onChange={handleChange}
              value={formData.email}
              type="email"
              name="email"
              placeholder="Correo electrónico"
              className="
                flex-grow bg-transparent text-white placeholder-white/40
                focus:outline-none font-mont text-sm
              "
              required
            />
          </div>

          <div
            className="
              flex items-center w-full max-w-[580px] h-16 px-6
              rounded-full
              border border-white/10
              bg-white/5
              transition
              focus-within:border-white/25
              focus-within:bg-white/10
            "
          >
            <img
              src={Candado}
              alt="passwordIcon"
              className="w-6 h-6 mr-4 opacity-70"
            />
            <input
              onChange={handleChange}
              value={formData.password}
              type="password"
              name="password"
              placeholder="Contraseña"
              className="
                flex-grow bg-transparent text-white placeholder-white/40
                focus:outline-none font-mont text-sm
              "
              required
            />
          </div>

          <button
            type="submit"
            className="
              w-full max-w-[220px] h-12 mt-4
              rounded-full
              bg-mpPurple text-white font-bold font-mont
              shadow-md shadow-black/30
              hover:opacity-90 transition
            "
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            className="text-xs text-white/50 hover:text-white/70 transition font-mont"
          >
            ¿Olvidaste tu contraseña?
          </button>

          <p className="text-xs text-white/50 font-mont">
            ¿No tenés cuenta?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-mpPinkLight hover:text-white cursor-pointer transition"
            >
              Registrate
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
