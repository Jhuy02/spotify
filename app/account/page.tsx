import Header from "@/components/Header";
import OptionProfile from "./components/OptionProfile";
import Profile from "./components/Profile";
import AccountContent from "./components/AccountContent";

interface SearchProps {
  searchParams: {
    id: string;
  };
}

export const revalidate = 0;

const Account = async ({ searchParams }: SearchProps) => {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="bg-gradient-to-b from-pink-500 via-pink-800">
        <Profile searchParams={searchParams.id}></Profile>
      </Header>
      <OptionProfile searchParams={searchParams.id}></OptionProfile>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        <AccountContent userId={searchParams.id}></AccountContent>
      </div>
    </div>
  );
};

export default Account;
