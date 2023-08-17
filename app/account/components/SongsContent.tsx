"use client";

import useGetSongByUserId from "@/hooks/useGetSongByUserId";
import useOnPlay from "@/hooks/useOnPlay";
import MediaItemAccount from "./MediaItemAccount";

export const revalidate = 0;
interface SongsContentProps {
  userId: string;
}

const SongsContent: React.FC<SongsContentProps> = ({ userId }) => {
  const songs = useGetSongByUserId(userId);
  const onPlay = useOnPlay(songs!);

  if (songs?.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full h-[50vh] px-6">No songs</div>
    );
  }
  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
      <div className="text-white text-xl font-semibold pb-5">List Songs</div>
      {songs?.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1">
            <MediaItemAccount
              onClick={(id: string) => {
                onPlay(id);
              }}
              data={song}
            ></MediaItemAccount>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SongsContent;
