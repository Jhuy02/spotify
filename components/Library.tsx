"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import { Song } from "@/types";
import useOnPlay from "@/hooks/useOnPlay";

import MediaItem from "./MediaItem";

interface LibraryProps {
  songs: Song[];
}

const Library: React.FC<LibraryProps> = ({ songs }) => {
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const onPlay = useOnPlay(songs);

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    return uploadModal.onOpen();
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist className="text-neutral-400" size={26}></TbPlaylist>
          <p className="text-neutral-400 font-medium text-md">Your library</p>
        </div>
        <AiOutlinePlus
          onClick={onClick}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
          size={20}
        ></AiOutlinePlus>
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        {songs
          ? songs.map((item) => (
              <MediaItem
                key={item.id}
                onClick={(id: string) => {
                  onPlay(id);
                }}
                data={item}
              />
            ))
          : "You have not posted anything yet"}
      </div>
    </div>
  );
};

export default Library;
