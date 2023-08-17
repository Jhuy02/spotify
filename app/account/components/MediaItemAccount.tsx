"use client";

import Image from "next/image";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import TippyHeader from "@tippyjs/react/headless";

import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import LikeButton from "@/components/LikeButton";
import useToggle from "@/hooks/useToggle";
import ModulePost from "./ModulePost";
import { useUser } from "@/hooks/useUser";

interface MediaItemAccountProps {
  data: Song;
  onClick?: (id: string) => void;
}

const MediaItemAccount: React.FC<MediaItemAccountProps> = ({
  data,
  onClick,
}) => {
  const { user } = useUser();
  const { supabaseClient } = useSessionContext();
  const imageUrl = useLoadImage(data);
  const [liked, setLiked] = useState<number>();
  const [isToggled, toggle] = useToggle(false);

  useEffect(() => {
    if (!data.id) {
      return;
    }
    const songId = data.id;
    const fetchSong = async () => {
      const { data, error } = await supabaseClient
        .from("liked_songs")
        .select("*")
        .eq("song_id", songId);

      if (error) {
        return toast.error(error.message);
      }
      setLiked(data?.length);
    };

    fetchSong();
  }, [data.id, supabaseClient]);

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between hover:bg-neutral-800/50 group">
        <div
          onClick={handleClick}
          className="flex items-center gap-x-3 cursor-pointer w-full p-2 rounded-md"
        >
          <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
            <Image
              fill
              src={imageUrl || "/images/music-placeholder.png"}
              alt="MediaItem"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-y-1 overflow-hidden">
            <p className="text-white truncate">{data.title}</p>
            <p className="text-neutral-400 text-sm truncate">
              By {data.author}
            </p>
          </div>
        </div>
        <div className="p-4 flex items-center">
          <p className="text-white px-2 mx-5">{liked === 0 ? "" : liked}</p>
          <LikeButton songId={data?.id}></LikeButton>
        </div>
        {user?.id === data.id && (
          <TippyHeader
            placement="top-start"
            interactive
            visible={isToggled}
            render={(attrs) => (
              <div
                tabIndex={-1}
                {...attrs}
                className="absolute w-[250px] right-0 translate-y-9 p-5 text-white bg-[#0f0f0f] rounded-lg "
              >
                <ModulePost toggle={toggle} data={data}></ModulePost>
              </div>
            )}
            onClickOutside={toggle}
          >
            <button onClick={toggle} className="mr-3 hidden group-hover:flex">
              <BiDotsHorizontalRounded
                className="text-neutral-300 hover:text-white"
                size={30}
              />
            </button>
          </TippyHeader>
        )}
      </div>
    </>
  );
};

export default MediaItemAccount;
