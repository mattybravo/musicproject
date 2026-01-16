
const SongPlayer = ({title, artist, imageUrl, onPlay}) => {
    return (
        <div
            onClick = {onPlay}
            className ="cursor-pointer w-[220px] p-5 rounded-2xl bg-mp-grad-2
            transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
            <img src = {imageUrl} alt = {title} className = "w-[130px] h-[130px] rounded-full mb-3" />
            <h3 className="text-white font-bold">{title}</h3>
            <p className="text-mpPinkLight">{artist}</p>
        </div>
    );
};

export default SongPlayer;