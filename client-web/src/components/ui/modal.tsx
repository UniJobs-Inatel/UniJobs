import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModalStore } from "@/stores/modalStore";

export default function Modals() {
  const { closeModal, isOpen, children, contentClassName } = useModalStore();
  return (
    <>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className={contentClassName}>{children}</DialogContent>
      </Dialog>
    </>
  );
}
