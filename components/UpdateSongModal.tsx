"use client";

import { useUser } from "@/hooks/useUser";
import useUpdateSongModal from "@/hooks/useUpdateSongModal";
import useGetSongById from "@/hooks/useGetSongById";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import uniqid from "uniqid";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";

const UpdateSongModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const updateSongModal = useUpdateSongModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const idSong = updateSongModal.selectedId;
  const { song } = useGetSongById(idSong!);

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      author: "",
      image: null,
    },
  });

  const onChangeModal = (open: boolean) => {
    if (!open) {
      reset();
      updateSongModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      const uniqueID = uniqid();

      const imageFile = values.image?.[0];

      if (!user) {
        toast.error("missing fileds");
        return;
      }

      if (song?.image_path && imageFile) {
        const { error: errorStorageImage } = await supabaseClient.storage
          .from("images")
          .remove([song.image_path]);
        if (errorStorageImage) {
          return toast.error(errorStorageImage.message);
        }
      }

      if (imageFile) {
        const { data: iamgeData, error: imageError } =
          await supabaseClient.storage
            .from("images")
            .upload(`image-${uniqueID}`, imageFile, {
              cacheControl: "3600",
              upsert: true,
            });
        if (imageError) {
          setIsLoading(false);
          return toast.error(imageError.message);
        }

        const { error } = await supabaseClient
          .from("songs")
          .update({
            image_path: iamgeData.path,
          })
          .eq("id", idSong);
        if (error) {
          setIsLoading(false);
          return toast.error(error.message);
        }
      }

      const { error } = await supabaseClient
        .from("songs")
        .update({
          author: values.author || song?.author,
          title: values.title || song?.title,
        })
        .eq("id", idSong);

      if (error) {
        setIsLoading(false);
        return toast.error(error.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success("created");
      reset();
      updateSongModal.onClose();
    } catch (error) {
      toast.error("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="updata Songs"
      description="updata an mp3 file"
      isOpen={updateSongModal.isOpen}
      onChange={onChangeModal}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <div>
          <div className="pb-1">Current Title: {song?.title}</div>
          <Input
            id="title"
            disabled={isLoading}
            {...register("title", { required: false })}
            placeholder="New Song Title"
          />
        </div>
        <div>
          <div className="pb-1">Current Author: {song?.author}</div>
          <Input
            id="author"
            disabled={isLoading}
            {...register("author", { required: false })}
            placeholder="New Song Author"
          />
        </div>
        <div>
          <div className="pb-1">Select an new image</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", { required: false })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UpdateSongModal;
