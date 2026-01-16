const SongCardNoLogin = ({ title, artist, imageUrl }) => {
  return (
    <div
      className="
        w-[220px]
        rounded-3xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        p-4
        shadow-lg shadow-black/25
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:scale-[1.02]
        hover:bg-white/10 hover:border-white/20
        hover:shadow-2xl hover:shadow-black/35
        cursor-default
        select-none
      "
    >
      <div className="w-full flex justify-center">
        <img
          src={imageUrl}
          alt={`Portada de ${title} por ${artist}`}
          className="
            w-[150px] h-[150px]
            rounded-2xl
            object-cover
            ring-1 ring-white/10
            shadow-md shadow-black/30
            transition duration-300
            group-hover:opacity-95
          "
        />
      </div>

      <div className="mt-4 text-left">
        <p className="text-white font-semibold text-[14px] leading-tight truncate">
          {title}
        </p>
        <p className="text-white/65 font-medium text-[12px] mt-1 truncate">
          {artist}
        </p>
      </div>
    </div>
  );
};

export default SongCardNoLogin;
