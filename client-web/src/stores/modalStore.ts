import { create } from "zustand";

type ActionsProps = {
  openModal: ({
    children,
    contentClassName,
  }: {
    children: React.ReactNode;
    contentClassName?: string;
  }) => void;
  closeModal: () => void;
};

type StoreProps = ActionsProps & {
  isOpen: boolean;
  children: React.ReactNode | null;
  contentClassName?: string;
};

export const useModalStore = create<StoreProps>()((set) => ({
  openModal: ({ children, contentClassName }) =>
    set({ isOpen: true, children, contentClassName }),
  closeModal: () =>
    set({ isOpen: false, children: null, contentClassName: undefined }),
  isOpen: false,
  children: null,
  contentClassName: undefined,
}));
