import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { UserDetails } from "@/types";

const getUser = async (id: string): Promise<UserDetails> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error.message);
  }

  return data as any;
};

export default getUser;
