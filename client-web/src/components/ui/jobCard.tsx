import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/cn";
import { Job } from "@/domain/job";
import { currencyFormatter } from "@/utils";

const JobCard = ({ job }: { job: Job }) => {
  const [accordionValue, setAccordionValue] = useState<string | null>(null);

  return (
    <Accordion
      value={accordionValue ?? ""}
      onValueChange={setAccordionValue}
      className="rounded-lg border border-primary"
      type="single"
      collapsible
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="m-0 px-2 py-4">
          <div className="flex w-full justify-between">
            <div className="text-left w-[60%]">
              <h2 className=" lg:text-[20px]">{job.job_name}</h2>
              <div>
                <h4 className="text-[12px] lg:text-[14px]">
                  {job.job_name} - {job.location}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-primary py-1 px-4 text-white border-2 border-primary-300 rounded-md">
                Publicar
              </div>
              <ChevronDownIcon
                className={cn(
                  "h-7 w-7 shrink-0 transition-transform duration-200",
                  accordionValue == "item-1" && "rotate-180"
                )}
              />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col px-2 justify-center gap-4 md:!pb-0 text-primary">
          <div className="flex justify-start gap-2 ">
            <p className="bg-primary-50 border border-primary text-primary px-2 py-0.5 pb-[6px] rounded-md">
              {job.mode}
            </p>
            <p className="bg-primary-50 border border-primary text-primary px-2 py-0.5 pb-[6px] rounded-md">
              {job.type}
            </p>
            <p className="bg-primary-50 border border-primary text-primary px-2 py-0.5 pb-[6px] rounded-md">
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
          <p className="self-end font-bold text-primary pe-2 text-[18px]">
            {currencyFormatter(job.salary)}
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { JobCard };
