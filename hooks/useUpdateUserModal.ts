import { create } from "zustand";

interface UploadModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useUpdateUserModal = create<UploadModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useUpdateUserModal;
