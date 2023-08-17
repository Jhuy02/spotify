import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Follow_users, UserDetails } from "@/types";

const useGetUserFollowing = (id?: string) => {
  const { supabaseClient } = useSessionContext();
  const [following, setFollowing] = useState<Follow_users[]>();

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchSong = async () => {
      const { data, error } = await supabaseClient
        .from("follow_users")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        return toast.error(error.message);
      }
      setFollowing(data);
    };

    fetchSong();
  }, [id, supabaseClient]);
  return following;
};

export default useGetUserFollowing;
