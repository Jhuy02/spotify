import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { UserDetails } from "@/types";

const useLoadImageUser = (data: UserDetails) => {
  const supabaseClient = useSupabaseClient();

  if (!data) {
    return null;
  }

  if (!data.avatar_url) {
    return false;
  }

  const { data: imageData } = supabaseClient.storage
    .from("images")
    .getPublicUrl(data.avatar_url!);

  return imageData.publicUrl;
};

export default useLoadImageUser;
