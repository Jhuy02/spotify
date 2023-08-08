"use client";

import { useEffect, useState } from "react";

import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";
import UpdateImageModal from "@/components/UpdateImageModal";

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
      <UpdateImageModal></UpdateImageModal>
    </>
  );
};

export default ModalProvider;
