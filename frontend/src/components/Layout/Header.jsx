// Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.svg";

const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("favoritePlaylistId");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("activePlaylistId");
    localStorage.removeItem("activePlaylistName");
    navigate("/login");
  };

  return (
    <header className = "sticky top-0 z-50 border-b border-white/10 bg-mpBlack supports-[backdrop-filter]:bg-mpBlack/60 backdrop-blur-xl">
      <div className = "max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <button
          onClick={() => navigate("/home")}
          className = "flex items-center gap-3 select-none"
          aria-label = "Ir al inicio"
        >
          <h1 className="font-exo text-2xl font-semibold tracking-tight">
            <span className = "text-white">Music</span>
            <span className = "text-mpPurpleSoft">Project</span>
          </h1>

          <img
            src={logo}
            alt="MusicProject Logo"
            className="w-10 h-10 rounded-full"
          />
        </button>

        <div className="flex items-center gap-4">
          {username ? (
            <>
              <p className="font-mont text-[13px] text-white/80">
                Hola,{" "}
                <span className="font-semibold text-white">{username}</span>
              </p>

              <button
                onClick={handleLogout}
                className="
                  font-mont text-[13px]
                  px-4 py-2 rounded-full
                  border border-white/10
                  bg-white/5
                  text-white/80
                  hover:bg-white/10 hover:text-white
                  transition
                "
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="
                font-mont text-[13px]
                px-4 py-2 rounded-full
                border border-white/10
                bg-white/5
                text-white/80
                hover:bg-white/10 hover:text-white
                transition
              "
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
