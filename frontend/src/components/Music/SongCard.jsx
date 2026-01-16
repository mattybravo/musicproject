const SongCard = ({
  title,
  artist,
  imageUrl,
  onPlay,
  onAddFavorite,
  disabledAdd = false,
}) => {
  const isPlayable = Boolean(onPlay);

  return (
    <div
      className="
        w-[220px]
        rounded-3xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        p-5
        shadow-lg shadow-black/20
        transition
        hover:bg-white/10
      "
    >
      <div className="w-full flex justify-center">
        <img
          src={imageUrl}
          alt={title}
          className="
            w-[132px] h-[132px]
            rounded-full
            object-cover
            ring-1 ring-white/10
            shadow-md shadow-black/30
          "
        />
      </div>

      <div className="mt-4">
        <h3 className="text-white font-semibold text-[15px] leading-tight truncate">
          {title}
        </h3>
        <p className="text-white/65 text-[13px] truncate">{artist}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        
        <button
          onClick={onPlay}
          disabled={!isPlayable}
          className={`
            w-full rounded-full py-2
            font-mont text-[13px] font-medium
            transition
            ${
              isPlayable
                ? "bg-white/10 border border-white/10 text-white hover:bg-white/15"
                : "bg-white/5 border border-white/5 text-white/35 cursor-not-allowed"
            }
          `}
        >
          {isPlayable ? "▶ Reproducir" : "Sin preview"}
        </button>

        <button
          onClick={onAddFavorite}
          disabled={disabledAdd}
          title={
            disabledAdd
              ? "Seleccioná una playlist primero"
              : "Añadir canción"
          }
          className={`
            w-full rounded-full py-2
            font-mont text-[13px] font-semibold
            transition
            ${
              disabledAdd
                ? "bg-white/5 border border-white/5 text-white/35 cursor-not-allowed"
                : "bg-mpPurpleSoft/90 text-mpBlack hover:bg-mpPurpleSoft"
            }
          `}
        >
          {disabledAdd ? "Seleccioná una playlist" : "Añadir 💜"}
        </button>
      </div>
    </div>
  );
};

export default SongCard;