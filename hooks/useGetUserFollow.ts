import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

const useGetUserFollow = async (id?: string) => {
  const [followingById, setFollowingById] = useState<number>();
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchSong = async () => {
      const { data, error } = await supabaseClient
        .from("follow_users")
        .select("*")
        .eq("following_id", id);

      if (error) {
        return toast.error(error.message);
      }
      console.log(data.length);
      setFollowingById(data.length);
    };

    fetchSong();
  }, [id, supabaseClient]);
  return followingById;
};

export default useGetUserFollow;
