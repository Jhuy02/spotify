"use client";

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import qs from "query-string";
import Tippy from "@tippyjs/react";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";

import Button from "./Button";
import useGetUserById from "@/hooks/useGetUserById";
import useLoadImageUser from "@/hooks/useLoadImageUser";
import Image from "next/image";

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();
  const AuthModal = useAuthModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const { userById } = useGetUserById(user?.id);
  const imagePath = useLoadImageUser(userById!);
  const query = {
    id: user?.id,
  };

  const url = qs.stringifyUrl({
    url: "/account",
    query,
  });

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logout");
      router.replace("/");
    }
  };

  return (
    <div
      className={twMerge(
        ` h-fit bg-gradient-to-b from-emerald-800 p-6 relative`,
        className
      )}
    >
      <div className="fixed z-50 p-[22px] translate-x-[-26px] top-0 webkit-fill-available w-full flex items-center justify-between mb-4">
        <div className="z-50 hidden md:flex gap-x-2 items-center">
          <Tippy content="back">
            <button
              onClick={() => router.back()}
              className="rounded-full bg-black flex  items-center justify-center hover:opacity-75 transition"
            >
              <RxCaretLeft className="text-white" size={35} />
            </button>
          </Tippy>
          <Tippy content="forward">
            <button
              onClick={() => router.forward()}
              className="rounded-full bg-black flex  items-center justify-center hover:opacity-75 transition"
            >
              <RxCaretRight className="text-white" size={35} />
            </button>
          </Tippy>
        </div>
        <div className="flex z-50 md:hidden gap-x-2 items-center">
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <HiHome className="text-black" size={20} />
          </button>
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div className="flex z-50 justify-between items-center gap-x-4">
          {user ? (
            <div className="flex gap-x-4 items-center">
              <Button onClick={handleLogout} className="bg-white px-6 py-2">
                Logout
              </Button>
              <Tippy content={user.email}>
                <Button
                  onClick={() => router.push(url)}
                  className="bg-white relative w-[40px] h-[40px]"
                >
                  {userById?.avatar_url ? (
                    <Image
                      className="object-cover rounded-full"
                      fill
                      src={imagePath || ""}
                      alt="image"
                    />
                  ) : (
                    <FaUserAlt />
                  )}
                </Button>
              </Tippy>
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={AuthModal.onOpen}
                  className="bg-transparent text-neutral-300 font-medium"
                >
                  Sing Up
                </Button>
              </div>
              <div>
                <Button
                  onClick={AuthModal.onOpen}
                  className="bg-white px-6 py-2"
                >
                  Log In
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full h-16"></div>
      {children}
    </div>
  );
};

export default Header;
