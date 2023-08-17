"use client";

import { useEffect, useState } from "react";

import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";
import UpdateUserModal from "@/components/UpdateUserModal";
import UpdateSongModal from "@/components/UpdateSongModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal></AuthModal>
      <UploadModal></UploadModal>
      <UpdateUserModal></UpdateUserModal>
      <UpdateSongModal></UpdateSongModal>
    </>
  );
};

export default ModalProvider;
