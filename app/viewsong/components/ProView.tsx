"use client";

import Image from "next/image";
import Input from "@/components/Input";

import { IoArrowRedo } from "react-icons/io5";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadImage from "@/hooks/useLoadImage";
import useGetCmt from "@/hooks/useGetCmt";
import MediaItemCmt from "./MediaItemCmt";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const revalidate = 0;

interface ProViewProps {
  searchParams: string;
}

const ProView: React.FC<ProViewProps> = ({ searchParams }) => {
  const { song } = useGetSongById(searchParams);
  const imagePath = useLoadImage(song!);
  const { user } = useUser();
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const content = useGetCmt(searchParams);

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      image: null,
      full_name: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      if (!user) {
        toast.error("missing fileds");
        return;
      }

      if (values.lenght < 0) {
        toast.error("Hãy thử viết gì đó");
        return;
      }

      const { error } = await supabaseClient.from("Cmt_Songs").insert({
        id_song: song?.id,
        user_id: user.id,
        Content: values.content,
      });

      router.refresh();
      toast.success("created");
      reset();
    } catch (error) {
      toast.error("error");
    } finally {
    }
  };

  return (
    <>
      <div className="flex p-5 items-center justify-start gap-4">
        <div className="group relative w-[250px] h-[250px] rounded-full">
          <Image
            fill
            className="object-cover rounded-full"
            alt="image"
            src={imagePath ? imagePath : "/images/liked.png"}
          ></Image>
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <p className="text-neutral-300 font-extrabold text-2xl pt-5">
            {song?.title}
          </p>
          <div className="flex justify-start items-center gap-x-4 group">
            <p className="text-white text-sm font-medium">By:</p>
            <span className="text-white">{song?.author}</span>
          </div>
        </div>
      </div>
      <div className="py-5">
        <div className="max-w-[60vw] p-3">
          <h5 className="text-2xl font-extrabold">Comment</h5>
          <form onSubmit={handleSubmit(onSubmit)} className="m-4 flex gap-2">
            <Input
              id="content"
              {...register("content", { required: true })}
              className="bg-transparent border-x-transparent border-t-transparent border-b-white"
              type="text"
              placeholder="Nêu Cảm Nghĩ Của Bạn"
            ></Input>
            <button
              type="submit"
              className="hover:bg-slate-500 rounded-full px-2"
            >
              <IoArrowRedo size={26} className="text-white" />
            </button>
          </form>
          <div className="mt-8 ">
            {content ? (
              content?.map((item) => (
                <MediaItemCmt key={item.song_id} data={item} />
              ))
            ) : (
              <p className="p-5">Chưa có đánh giá hãy là người đầu tiên</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProView;
