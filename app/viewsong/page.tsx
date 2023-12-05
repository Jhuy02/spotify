import Header from "@/components/Header";
import ProView from "./components/ProView";

export const revalidate = 0;

interface SearchProps {
  searchParams: {
    id: string;
  };
}

const Account = async ({ searchParams }: SearchProps) => {
  return (
    <div className="bg-neutral-900 rounded-lg h-fit w-full overflow-hidden overflow-y-auto">
      <Header className="bg-gradient-to-b from-pink-500 via-pink-800"></Header>
      <ProView searchParams={searchParams.id}></ProView>
    </div>
  );
};

export default Account;
