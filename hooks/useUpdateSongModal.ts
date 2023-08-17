import { create } from "zustand";

interface UpdateSongModalStore {
  selectedId: string | null;
  isOpen: boolean;
  onOpen: (id?: string) => void;
  onClose: () => void;
}

const useUpdateSongModal = create<UpdateSongModalStore>((set) => ({
  selectedId: null,
  isOpen: false,
  onOpen: (id) => set({ selectedId: id, isOpen: true }),
  onClose: () => set({ selectedId: null, isOpen: false }),
}));

export default useUpdateSongModal;
