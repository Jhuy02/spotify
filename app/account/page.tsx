import Header from "@/components/Header";
import OptionProfile from "./components/OptionProfile";
import Profile from "./components/Profile";
import SongsContent from "./components/SongsContent";
import FollowingContent from "./components/FollowingContent";

export const revalidate = 0;
interface SearchProps {
  searchParams: {
    id: string;
  };
}

const Account = async ({ searchParams }: SearchProps) => {
  return (
    <div className="bg-neutral-900 rounded-lg h-fit w-full overflow-hidden overflow-y-auto">
      <Header className="bg-gradient-to-b from-pink-500 via-pink-800">
        <Profile searchParams={searchParams.id}></Profile>
      </Header>
      <OptionProfile searchParams={searchParams.id}></OptionProfile>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        <SongsContent userId={searchParams.id}></SongsContent>
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        <FollowingContent userId={searchParams.id}></FollowingContent>
      </div>
    </div>
  );
};

export default Account;
