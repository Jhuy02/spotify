import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { Cmt_Songs } from "@/types";

const useGetCmt = (id?: string) => {
  const [content, setContent] = useState<Cmt_Songs[]>();
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchSong = async () => {
      const { data, error } = await supabaseClient
        .from("Cmt_Songs")
        .select("*")
        .eq("id_song", id);

      if (error) {
        return toast.error(error.message);
      }

      setContent(data);
    };

    fetchSong();
  }, [id, supabaseClient]);

  return content;
};

export default useGetCmt;
