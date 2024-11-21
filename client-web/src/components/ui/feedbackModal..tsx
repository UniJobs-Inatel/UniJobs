import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "./button";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { useModalStore } from "@/stores/modalStore";

const feedbackVariants = cva(
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

interface FeedBackModalProps extends VariantProps<typeof feedbackVariants> {
  title: string;
  subTitle?: string;
  onOkayClick?: () => void;
}

const FeedBackModal = ({ variant, title, subTitle, onOkayClick }: FeedBackModalProps) => {

  const { closeModal } = useModalStore()

  return (
    <div className={cn(feedbackVariants({ variant }), "bg-white")}>
     <div className="flex flex-col items-center justify-center" >
          {variant == "success" ? (
            <CheckCircleIcon className="w-16" />
          ) : (
            <XCircleIcon className="w-16" />
          )}
    
          <h2 className=" text-[20px] text-inherit">
            {variant == "success" ? "SUCESSO" : "ERRO"}
          </h2>
          <h3 className=" ">{title}</h3>
          {subTitle && <h4 className=" text-[14px]">{subTitle}</h4>}
     </div>
      <Button
       data-cy='feedback-button'
       onClick={() => {
        closeModal();
        onOkayClick && onOkayClick();
      }} className={cn(feedbackVariants({ variant }), "text-white")}>
        OK
      </Button>
    </div>
  );
};

export { FeedBackModal };
