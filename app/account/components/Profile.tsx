"use client";

import Image from "next/image";

import useGetUserById from "@/hooks/useGetUserById";
import useLoadImageUser from "@/hooks/useLoadImageUser";
import { AiFillFileAdd } from "react-icons/ai";
import { HiPencilSquare } from "react-icons/hi2";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import useUpdateUserModal from "@/hooks/useUpdateUserModal";
import useAuthModal from "@/hooks/useAuthModal";

export const revalidate = 0;
interface ProfileProps {
  searchParams: string;
}

const Profile: React.FC<ProfileProps> = ({ searchParams }) => {
  const { userById } = useGetUserById(searchParams);
  const imagePath = useLoadImageUser(userById!);
  const [followingById, setFollowingById] = useState<number>();
  const { user } = useUser();
  const { supabaseClient } = useSessionContext();
  const uploadModal = useUpdateUserModal();
  const authModal = useAuthModal();

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    return uploadModal.onOpen();
  };

  useEffect(() => {
    if (!searchParams) {
      return;
    }

    const fetchSong = async () => {
      const { data, error } = await supabaseClient
        .from("follow_users")
        .select("*")
        .eq("following_id", searchParams);

      if (error) {
        return toast.error(error.message);
      }
      setFollowingById(data.length);
    };

    fetchSong();
  }, [searchParams, supabaseClient]);

  return (
    <div className="flex items-center justify-start gap-4">
      <div className="group relative w-[250px] h-[250px] rounded-full">
        {user?.id === userById?.id && (
          <button
            onClick={onClick}
            className="absolute inset-0 bg-[#0000008c] rounded-full z-10 hidden group-hover:flex items-center justify-center transition"
          >
            <AiFillFileAdd size={30} className="text-white"></AiFillFileAdd>
          </button>
        )}
        <Image
          fill
          className="object-cover rounded-full"
          alt="image"
          src={imagePath ? imagePath : "/images/liked.png"}
        ></Image>
      </div>
      <div className="flex flex-col items-start justify-start gap-2">
        <p className="text-white text-sm font-medium">Hồ sơ:</p>
        <div className="flex justify-start items-center gap-x-4 group">
          <span className="text-white text-2xl font-extrabold">
            {userById?.full_name}
          </span>
          {user?.id === userById?.id && (
            <button
              onClick={onClick}
              className="text-white hidden group-hover:block"
            >
              <HiPencilSquare size={30}></HiPencilSquare>
            </button>
          )}
        </div>
        <p className="text-neutral-300 pt-5">
          {followingById
            ? `${followingById} Followers`
            : `${
                searchParams === user?.id
                  ? "Tiếp tục cố gắng"
                  : "hãy là người theo dõi đầu tiên"
              }`}
        </p>
      </div>
    </div>
  );
};

export default Profile;
