import getSongs from "@/actions/getSongs";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";

import PageContent from "./components/PageContent";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import PageContentHots from "./components/PageContentHots";

export const revalidate = 0;

export default async function Home() {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data } = await supabase
    .from("liked_songs")
    .select("*, songs(*)")
    .order("created_at", { ascending: false });
  const songs = await getSongs();

  return (
    <div className="bg-neutral-900 rounded-lg h-fit w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">Welcome Back</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem image="/images/liked.png" name="hello" href="liked" />
          </div>
        </div>
      </Header>

      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">Hot songs</h1>
        </div>
        <PageContentHots data={data!}></PageContentHots>
      </div>

      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">New songs</h1>
        </div>
        <PageContent songs={songs}></PageContent>
      </div>
    </div>
  );
}
