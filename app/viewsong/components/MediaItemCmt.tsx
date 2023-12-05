"use client";

import Image from "next/image";

import { Cmt_Songs } from "@/types";
import useLoadImageUser from "@/hooks/useLoadImageUser";
import useGetUserById from "@/hooks/useGetUserById";
import qs from "query-string";
import { useRouter } from "next/navigation";

interface MediaItemProps {
  data?: Cmt_Songs;
  onClick?: (id: string) => void;
}

const MediaItemCmt: React.FC<MediaItemProps> = ({ data, onClick }) => {
  console.log(data);
  const { userById } = useGetUserById(data?.user_id);
  const imageUrl = useLoadImageUser(userById!);
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
      className="flex items-center gap-x-3 hover:bg-neutral-800/50 cursor-pointer w-full p-2 rounded-md"
    >
      <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
        <Image
          fill
          src={imageUrl || "/images/music-placeholder.png"}
          alt="image"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="text-white font-black truncate">{userById?.full_name}</p>
        <p className="text-white text-base font-medium truncate">
          {data?.Content}
        </p>
      </div>
    </div>
  );
};

export default MediaItemCmt;
