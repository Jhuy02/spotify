"use client";

import useLoadImage from "@/hooks/useLoadImage";
import qs from "query-string";
import { liked_songs } from "@/types";

import Image from "next/image";

import { useRouter } from "next/navigation";
import PlayButton from "@/components/PlayButton";

interface SongItemProps {
  data: liked_songs;
  onClick: (id: string) => void;
}

const HotsItems: React.FC<SongItemProps> = ({ data, onClick }) => {
  const imagePath = useLoadImage(data.songs);
  const router = useRouter();
  const query = {
    id: data?.songs.user_id,
  };

  const url = qs.stringifyUrl({
    url: "/account",
    query,
  });

  return (
    <div
      onClick={() => router.push(url)}
      className="relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3"
    >
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
        <Image
          className="object-cover"
          src={imagePath || "/images/liked.png"}
          fill
          alt="Image"
        />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold w-full truncate">{data.songs.title}</p>
        <p className="text-neutral-400 text-sm pb-4 w-full truncate">
          By: {data.songs.author}
        </p>
      </div>
      <div
        onClick={() => {
          onClick(data.songs.id);
        }}
        className="absolute bottom-24 right-5"
      >
        <PlayButton idActive={data.songs.id} />
      </div>
    </div>
  );
};

export default HotsItems;
