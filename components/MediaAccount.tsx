"use client";

import Image from "next/image";

import { Follow_users } from "@/types";
import useGetUserById from "@/hooks/useGetUserById";
import useLoadImageUser from "@/hooks/useLoadImageUser";
import qs from "query-string";
import { useRouter } from "next/navigation";

interface MediaAccountProps {
  data: Follow_users;
}

const MediaAccount: React.FC<MediaAccountProps> = ({ data }) => {
  const { userById } = useGetUserById(data.following_id);
  const imageUrl = useLoadImageUser(userById!);
  const router = useRouter();

  const query = {
    id: userById?.id,
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
      <div className="relative aspect-square w-full h-full rounded-full overflow-hidden">
        <Image
          className="object-cover"
          src={imageUrl || "/images/liked.png"}
          fill
          alt="Image"
        />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold w-full truncate">{userById?.full_name}</p>
        <p className="text-neutral-400 text-sm pb-4 w-full truncate">Profile</p>
      </div>
    </div>
  );
};

export default MediaAccount;
