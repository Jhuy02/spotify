import usePlayer from "@/hooks/usePlayer";
import { FaPause, FaPlay } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface PlayButtonProps {
  className?: string;
  idActive?: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({ className, idActive }) => {
  const player = usePlayer();

  return (
    <button
      className={twMerge(
        `transition rounded-full opacity-0 flex items-center bg-green-500 p-4 drop-shadow-md translate translate-y-1/4 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110`,
        className
      )}
    >
      {player.activeId === idActive ? (
        <FaPause className="text-black" />
      ) : (
        <FaPlay className="text-black" />
      )}
    </button>
  );
};

export default PlayButton;
