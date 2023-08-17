"use client";

import { useUser } from "@/hooks/useUser";
import useUpdateUserModal from "@/hooks/useUpdateUserModal";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState } from "react";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import useGetUserById from "@/hooks/useGetUserById";

const UpdateUserModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUpdateUserModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { userById } = useGetUserById(user?.id);

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      image: null,
      full_name: "",
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      const uniqueID = uniqid();
      setIsLoading(true);

      const imageFile = values.image?.[0];

      if (!user) {
        toast.error("missing fileds");
        return;
      }

      if (imageFile) {
        const { error: errorStorageImage } = await supabaseClient.storage
          .from("images")
          .remove([userById?.avatar_url!]);
        if (errorStorageImage) {
          return toast.error(errorStorageImage.message);
        }
      }

      if (imageFile && !values.full_name) {
        const { data: iamgeData, error: imageError } =
          await supabaseClient.storage
            .from("images")
            .upload(`image-${uniqueID}`, imageFile, {
              cacheControl: "3600",
              upsert: false,
            });
        if (imageError) {
          setIsLoading(false);
          return toast.error("failed image");
        }

        const { error: supabaseError } = await supabaseClient
          .from("users")
          .update({
            avatar_url: iamgeData.path,
          })
          .eq("id", user.id);

        if (supabaseError) {
          setIsLoading(false);
          return toast.error(supabaseError.message);
        }
      }

      if (!imageFile && values.full_name) {
        const { error: supabaseError } = await supabaseClient
          .from("users")
          .update({
            full_name: values.full_name,
          })
          .eq("id", user.id);

        if (supabaseError) {
          setIsLoading(false);
          return toast.error(supabaseError.message);
        }
      }

      if (imageFile && values.full_name) {
        const { data: iamgeData, error: imageError } =
          await supabaseClient.storage
            .from("images")
            .upload(`image-${uniqueID}`, imageFile, {
              cacheControl: "3600",
              upsert: false,
            });
        if (imageError) {
          setIsLoading(false);
          return toast.error("failed image");
        }

        const { error: supabaseError } = await supabaseClient
          .from("users")
          .update({
            avatar_url: iamgeData.path,
            full_name: values.full_name,
          })
          .eq("id", user.id);

        if (supabaseError) {
          setIsLoading(false);
          return toast.error(supabaseError.message);
        }
      }

      router.refresh();
      setIsLoading(false);
      toast.success("created");
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Update User"
      description="change style"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="full_name"
          disabled={isLoading}
          {...register("full_name", { required: false })}
          placeholder="New Name"
        />
        <div>
          <div className="pb-1">Select an image</div>
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

export default UpdateUserModal;
