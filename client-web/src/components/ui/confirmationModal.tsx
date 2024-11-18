import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "./button";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { useModalStore } from "@/stores/modalStore";

const confirmationVariants = cva(
  "flex flex-col items-center justify-center gap-6",
  {
    variants: {
      variant: {
        error: "text-red-500 bg-red-500",
        success: "text-green-500 bg-green-500 ",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
);

interface ConfirmationModalProps extends VariantProps<typeof confirmationVariants> {
  title: string;
  onAgreeClick?: () => void;
  onDeclineClick?: () => void;
}

const ConfirmationModal = ({ variant, title, onAgreeClick, onDeclineClick }: ConfirmationModalProps) => {

  const { closeModal } = useModalStore()

  return (
    <div className={cn(confirmationVariants({ variant }), "bg-white")}>
     <div className="flex flex-col items-center justify-center" >
         <QuestionMarkCircleIcon/>
          <h2 className="text-[20px] text-inherit">Atenção</h2>
          {title && <h4 className=" text-[14px]">{title}</h4>}
     </div>
     <div className="flex gap-4" >
      <Button onClick={() => {
        closeModal();
        onAgreeClick && onAgreeClick();
      }} className={cn(confirmationVariants({ variant }), "text-white")}>
        Não
      </Button>
      <Button onClick={() => {
        closeModal();
        onDeclineClick && onDeclineClick();
      }} className={cn(confirmationVariants({ variant }), "text-white bg-green-500")}>
        Sim
      </Button>
      </div>
    </div>
  );
};

export { ConfirmationModal };
