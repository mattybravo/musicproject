// Imports
import { useState, useEffect } from "react";
import GetAllSongs from "../../api/GetAllSongs";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import SongCardNoLogin from "../../components/Music/SongCardNoLogin";
import FeatureCard from "../../components/Common/FeatureCard";
import NotaMusical from "../../assets/images/NotaMusical.svg";
import SignoMas from "../../assets/images/SignoMas.svg";
import Estrella from "../../assets/images/Estrella.svg";

const LandingPage = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const data = await GetAllSongs();
      setSongs(data);
    };
    fetchSongs();
  }, []);

  return (
    <>
      <Header />

      <main className="bg-mpDeep min-h-screen">
        <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
            
          <section className="text-center flex flex-col items-center">
            <h1 className="font-exo text-[38px] md:text-[44px] leading-tight font-bold text-white max-w-4xl">
              Crea tu{" "}
              <span className="bg-mp-grad-2 bg-clip-text text-transparent">
                Biblioteca Musical
              </span>
              , organizada a tu manera.
            </h1>

            <p className="font-mont text-white/70 text-[14px] md:text-[15px] mt-4 max-w-3xl leading-relaxed">
              Escuchá 30 segundos de millones de canciones y registrate gratis
              para{" "}
              <span className="text-white font-semibold">
                crear playlists ilimitadas
              </span>{" "}
              y guardar tus favoritos.
            </p>

            <div className="mt-10 w-full flex justify-center">
              <div
                className="
                  w-full max-w-xl
                  rounded-3xl
                  border border-white/10
                  bg-white/5
                  backdrop-blur-xl
                  p-6
                  shadow-xl shadow-black/25
                "
              >
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/register"
                    className="
                      w-full sm:w-auto
                      px-6 py-3 rounded-2xl
                      bg-mpPurple text-white font-semibold
                      shadow-md shadow-black/30
                      hover:opacity-90 transition
                      text-center
                    "
                  >
                    Crear cuenta gratis
                  </a>

                  <a
                    href="/login"
                    className="
                      w-full sm:w-auto
                      px-6 py-3 rounded-2xl
                      border border-white/15
                      bg-white/5 text-white font-semibold
                      hover:bg-white/10 transition
                      text-center
                    "
                  >
                    Iniciar sesión
                  </a>
                </div>

                <p className="mt-4 text-white/50 text-[12px] font-mont">
                  Sin tarjetas. Acceso rápido para explorar y armar tus playlists.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                iconUrl={NotaMusical}
                title={"Descubre nuevas canciones"}
                description={
                  "Sumérgete en un universo musical: desde los clásicos hasta lo más reciente, por género y estado de ánimo."
                }
              />

              <FeatureCard
                iconUrl={SignoMas}
                title={"Crea playlists ilimitadas"}
                description={
                  "Define el ambiente perfecto para cada momento. Crea y nombra listas sin límites para tu workout, viajes o estudio."
                }
              />

              <FeatureCard
                iconUrl={Estrella}
                title={"Guardar tus favoritos"}
                description={
                  "Colecciona y gestiona tus imprescindibles. Añade canciones y artistas a tu biblioteca personal con solo un click."
                }
              />
            </div>
          </section>

          <section className="mt-16">
            <div className="flex items-center justify-center gap-3 mb-8">
              <img src={NotaMusical} alt="Nota de música" className="w-7 h-7" />
              <h3 className="font-exo font-semibold text-[24px] md:text-[28px] text-white">
                Canciones que podés escuchar
              </h3>
            </div>

            <div
              className="
                grid gap-6
                grid-cols-2
                md:grid-cols-4
                justify-items-center
              "
            >
              {songs.slice(0, 4).map((song) => (
                <SongCardNoLogin
                  key={song._id}
                  title={song.title}
                  artist={song.artist}
                  imageUrl={song.imageUrl}
                />
              ))}
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default LandingPage;
