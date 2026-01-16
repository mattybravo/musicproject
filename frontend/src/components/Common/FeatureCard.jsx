const FeatureCard = ({ iconUrl, title, description }) => {
  return (
    <div className="w-full flex flex-wrap justify-center mt-16">
      <div
        className="
          group relative
          w-[240px] h-[260px]
          rounded-[30px]
          border border-white/10
          bg-white/5 backdrop-blur-xl
          p-6
          shadow-lg shadow-black/25
          transition-all duration-200 ease-out
          hover:-translate-y-[3px]
          hover:border-white/20
          hover:bg-white/10
          hover:shadow-xl hover:shadow-black/30
          overflow-hidden
        "
      >
        {/* ✨ reflejo (sheen) sutil */}
        <div
          className="
            pointer-events-none absolute inset-0 rounded-[30px]
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
            bg-gradient-to-br from-white/12 via-transparent to-transparent
          "
        />

        {/* ✨ glow muy suave con tu paleta */}
        <div
          className="
            pointer-events-none absolute -inset-2 rounded-[32px]
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
            blur-2xl
            bg-gradient-to-r from-mpSky/10 via-mpPurple/10 to-mpPink/10
          "
        />

        <div className="relative w-full h-full flex flex-col items-center justify-start text-center">
          <img
            src={iconUrl}
            alt={title}
            className="
              w-[62px] h-[62px]
              transition-all duration-200 ease-out
              group-hover:-translate-y-[2px]
              group-hover:scale-[1.03]
              group-hover:brightness-110
              drop-shadow-[0_10px_18px_rgba(0,0,0,0.25)]
            "
          />

          <h4
            className="
              font-mont text-mpPinkLight text-xl font-bold mt-4 leading-tight
              transition-colors duration-200 ease-out
              group-hover:text-mpPurpleLight
            "
          >
            {title}
          </h4>

          <p
            className="
              font-mont text-mpPinkLight text-xs mt-2 leading-snug
              opacity-70
              transition-all duration-200 ease-out
              group-hover:opacity-95
              group-hover:text-mpPurpleLight/90
            "
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
