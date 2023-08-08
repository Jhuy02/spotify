"use client";

import useLoadImage from "@/hooks/useLoadImage";
import qs from "query-string";
import { Song } from "@/types";

import Image from "next/image";

import PlayButton from "./PlayButton";
import { useRouter } from "next/navigation";

interface SongItemProps {
  data: Song;
  onClick: (id: string) => void;
}

const SongItem: React.FC<SongItemProps> = ({ data, onClick }) => {
  const imagePath = useLoadImage(data);
  const router = useRouter();

  const query = {
    id: data?.user_id,
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
        <p className="font-semibold w-full truncate">{data.title}</p>
        <p className="text-neutral-400 text-sm pb-4 w-full truncate">
          By: {data.author}
        </p>
      </div>
      <div
        onClick={() => {
          onClick(data.id);
        }}
        className="absolute bottom-24 right-5"
      >
        <PlayButton idActive={data.id} />
      </div>
    </div>
  );
};

export default SongItem;
