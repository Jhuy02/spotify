import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Song } from "@/types";

const useGetSongByUserId = (id?: string) => {
  const { supabaseClient } = useSessionContext();
  const [songs, setSongs] = useState<Song[]>();

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchSong = async () => {
      const { data, error } = await supabaseClient
        .from("songs")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        return toast.error(error.message);
      }
      setSongs(data);
    };

    fetchSong();
  }, [id, supabaseClient]);
  return songs;
};

export default useGetSongByUserId;
