import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { ChevronDownIcon, TrashIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/cn";
import { Job } from "@/domain/job";
import { currencyFormatter } from "@/utils";
import { deleteJob } from "@/services";
import { useModalStore } from "@/stores/modalStore";
import { FeedBackModal } from "./feedbackModal.";
import { StatusBadge } from "./badge";
import { JobStatus, jobStatusMapper } from "@/utils/mappers";

interface JobCardProps {
  job: Job;
  validateJobFromCard?: () => void;
  publishJob?: ({
    jobId,
    companyId,
  }: {
    jobId: number;
    companyId: number;
  }) => void;
  onDeleteClick?: () => Promise<void>;
  status?: JobStatus;
}

const JobCard = ({
  job,
  publishJob,
  onDeleteClick,
  validateJobFromCard,
  status,
}: JobCardProps) => {
  const [accordionValue, setAccordionValue] = useState<string | null>(null);
  const { openModal } = useModalStore();

  const removeJob = async (jobId: number) => {
    const response = await deleteJob(jobId);

    if (response) {
      openModal({
        children: (
          <FeedBackModal
            onOkayClick={async () => onDeleteClick && (await onDeleteClick())}
            title={"Vaga removida com sucesso"}
          />
        ),
      });
      return;
    }

    openModal({
      children: (
        <FeedBackModal variant={"error"} title={"Erro ao apagar a vaga"} />
      ),
    });
  };

  return (
    <Accordion
      value={accordionValue ?? ""}
      onValueChange={setAccordionValue}
      className="rounded-lg border border-primary"
      type="single"
      collapsible
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="m-0 px-2 py-4 border-primary">
          <div className="flex flex-col gap-1">
            {status && (
              <StatusBadge
              className="self-end"
                label={jobStatusMapper[status].label}
                variant={jobStatusMapper[status].variant}
              />
            )}
            <div className="flex w-full justify-between">
              <div className="text-left w-[60%]">
                <h2 className=" lg:text-[20px] ">{job.job_name}</h2>
                <div>
                  <h4 className="text-[12px] lg:text-[14px] ">
                    {job.job_name} - {job.location}
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!job.isPublishedOnAllColleges && (
                  <div
                    onClick={() => {
                      setAccordionValue("");
                      validateJobFromCard && validateJobFromCard();
                      publishJob &&
                        publishJob({
                          jobId: job.id ?? 0,
                          companyId: job.company.id ?? 0,
                        });
                    }}
                    className="bg-primary py-1 px-4 text-white border-2 border-primary-300 rounded-md"
                  >
                    Publicar
                  </div>
                )}
                <TrashIcon
                  onClick={() => {
                    setAccordionValue("");
                    removeJob(job.id ?? 0);
                  }}
                  className="w-5 fill-red-500"
                />
                <ChevronDownIcon
                  className={cn(
                    "h-7 w-7 shrink-0 transition-transform duration-200  fill-primary",
                    accordionValue == "item-1" && "rotate-180"
                  )}
                />
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col px-2 justify-center gap-4 md:!pb-0 ">
          <div className="flex justify-start gap-2 ">
            <p className="bg-primary-50 border border-primary  px-2 py-0.5 pb-[6px] rounded-md">
              {job.mode}
            </p>
            <p className="bg-primary-50 border border-primary  px-2 py-0.5 pb-[6px] rounded-md">
              {job.type}
            </p>
            <p className="bg-primary-50 border border-primary  px-2 py-0.5 pb-[6px] rounded-md">
              {job.weekly_hours}hrs
            </p>
          </div>
          <p className="text-center">{job.description}</p>
          <div>
            <h6 className="font-bold mb-0.5">Requisitos</h6>
            <p>{job.requirements}</p>
            <h6 className="font-bold mb-0.5 mt-1">Benefícios</h6>
            <p>{job.benefits}</p>
          </div>
          <p className="self-end font-bold  pe-2 text-[18px]">
            {currencyFormatter(job.salary)}
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { JobCard };
