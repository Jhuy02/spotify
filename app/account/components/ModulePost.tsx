"use client";

import useAuthModal from "@/hooks/useAuthModal";
import useUpdateSongModal from "@/hooks/useUpdateSongModal";
import { useUser } from "@/hooks/useUser";
import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";

interface ModulePostProps {
  data: Song;
  toggle: () => void;
}

const ModulePost: React.FC<ModulePostProps> = ({ data, toggle }) => {
  const { user } = useUser();
  const authModal = useAuthModal();
  const updateSongModal = useUpdateSongModal();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const onClickUpdate = () => {
    if (!user) {
      return authModal.onOpen();
    }
    toggle();
    return updateSongModal.onOpen(data.id);
  };

  const onClickDelete = async () => {
    const { error: errorsong } = await supabaseClient
      .from("songs")
      .delete()
      .eq("id", data.id);
    if (errorsong) {
      return toast.error("failed delete");
    }
    const { error: errorStorageSong } = await supabaseClient.storage
      .from("songs")
      .remove([data.song_path]);
    if (errorStorageSong) {
      return toast.error(errorStorageSong.message);
    }
    const { error: errorStorageImage } = await supabaseClient.storage
      .from("images")
      .remove([data.image_path]);
    if (errorStorageImage) {
      return toast.error(errorStorageImage.message);
    }
    router.refresh();
    toast.success("created");
  };

  return (
    <div className="flex flex-col items-start justify-start w-full">
      <button
        onClick={onClickUpdate}
        className="text-white text-sm p-2 hover:bg-slate-600 w-full rounded-md text-start"
      >
        Update Song
      </button>
      <button
        onClick={onClickDelete}
        className="text-white text-sm p-2 hover:bg-slate-600 w-full rounded-md text-start"
      >
        Delete Song
      </button>
    </div>
  );
};

export default ModulePost;
