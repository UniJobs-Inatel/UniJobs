import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "./button";
import { useModalStore } from "@/stores/modalStore";

interface ConfirmationModalProps  {
  title: string;
  onAgreeClick?: () => void;
  onDeclineClick?: () => void;
}

const ConfirmationModal = ({  title, onAgreeClick, onDeclineClick }: ConfirmationModalProps) => {

  const { closeModal } = useModalStore()

  return (
    <div className="bg-white flex flex-col gap-4">
     <div className="flex flex-col items-center justify-center " >
         <QuestionMarkCircleIcon className="w-16" />
          <h2 className="text-[20px] text-inherit">Atenção</h2>
          {title && <h4 className=" text-[14px]">{title}</h4>}
     </div>
     <div className="flex gap-4" >
      <Button onClick={() => {
        closeModal();
        onDeclineClick && onDeclineClick();
      }} className= "text-white">
        Não
      </Button>
      <Button onClick={() => {
        closeModal();
        onAgreeClick && onAgreeClick();
        
      }} className="text-white bg-green-500">
        Sim
      </Button>
      </div>
    </div>
  );
};

export { ConfirmationModal };
