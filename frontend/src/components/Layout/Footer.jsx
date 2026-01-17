// Imports
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Logo.svg";

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <div className="pt-px bg-mp-grad-full">
      <footer className="bg-mpDeep">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div
            className="flex justify-center items-center gap-2 mb-5 cursor-pointer select-none"
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              alt="MusicProject"
              className="w-7 h-7 opacity-90"
            />
            <h3 className="font-exo text-[18px] font-bold bg-mp-grad-3 bg-clip-text text-transparent">
              MusicProject
            </h3>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm mb-6">
            <button
              onClick={() => navigate("/explorar")}
              className="font-mont text-white/55 hover:text-white/80 transition"
            >
              Explorar
            </button>

            <button
              type="button"
              className="font-mont text-white/55 hover:text-white/80 transition"
            >
              Privacidad
            </button>

            <button
              type="button"
              className="font-mont text-white/55 hover:text-white/80 transition"
            >
              Términos
            </button>

            <button
              type="button"
              className="font-mont text-white/55 hover:text-white/80 transition"
            >
              Soporte
            </button>
          </nav>

          <p className="text-center text-xs font-mont text-white/35">
            © {year} MusicProject — Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
