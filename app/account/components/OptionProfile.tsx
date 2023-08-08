"use client";

import Button from "@/components/Button";
import PlayButton from "@/components/PlayButton";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useOnPlay from "@/hooks/useOnPlay";
import usePlayer from "@/hooks/usePlayer";
import useGetUserById from "@/hooks/useGetUserById";
import useGetSongByUserId from "@/hooks/useGetSongByUserId";

import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface OptionProfileProps {
  searchParams: string;
}

export const revalidate = 0;

const OptionProfile: React.FC<OptionProfileProps> = ({ searchParams }) => {
  const { userById } = useGetUserById(searchParams);
  const songs = useGetSongByUserId(searchParams);
  const { user } = useUser();
  const { supabaseClient } = useSessionContext();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const authModal = useAuthModal();
  const router = useRouter();
  const player = usePlayer();
  const onPlay = useOnPlay(songs!);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from("follow_users")
        .select("*")
        .eq("user_id", user.id)
        .eq("following_id", userById?.id)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    };

    fetchData();
  }, [supabaseClient, user?.id, userById?.id]);

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (isLiked) {
      const { error } = await supabaseClient
        .from("follow_users")
        .delete()
        .eq("user_id", user.id)
        .eq("following_id", userById?.id);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
        router.refresh();
      }
    } else {
      const { error } = await supabaseClient.from("follow_users").insert({
        user_id: user.id,
        following_id: userById?.id,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);
        toast.success("Success");
        router.refresh();
      }
    }

    router.refresh();
  };

  return (
    <div className="flex items-center gap-x-5 p-5 w-full">
      <div
        onClick={() => {
          onPlay(songs![0].id);
        }}
        className=""
      >
        {player.activeId ? (
          <PlayButton
            idActive={player.activeId}
            className="opacity-100 translate-x-[0px] translate-y-0"
          ></PlayButton>
        ) : (
          <PlayButton
            idActive="-1"
            className="opacity-100 translate-x-[0px] translate-y-0"
          ></PlayButton>
        )}
      </div>
      {user?.id !== userById?.id && (
        <Button onClick={handleLike} className="w-[120px]">
          {isLiked ? "watching" : "Follow"}
        </Button>
      )}
      <button className="group p-2">
        <BsThreeDots
          size={30}
          className="text-neutral-400 group-hover:text-white"
        />
      </button>
    </div>
  );
};

export default OptionProfile;
