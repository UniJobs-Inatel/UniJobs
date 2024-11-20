import { ConfirmationModal } from "@/components/ui/confirmationModal";
import { FeedBackModal } from "@/components/ui/feedbackModal.";
import { JobCard } from "@/components/ui/jobCard";
import { JobPublication } from "@/domain/job";
import { getJobsPublicationByCompany, unpublishJob } from "@/services";
import { UnpublishJobRequest } from "@/services/job/interface";
import { useModalStore } from "@/stores/modalStore";
import { useEffect, useState } from "react";

const PublishedJobs = () => {
  const [publishedJobs, setPublishedJobs] = useState<JobPublication[]>([]);
  const { openModal } = useModalStore();

  const getPublichedJob = async () => {
    const response = await getJobsPublicationByCompany();
    if (!response.success) {
      if (!response.success) {
        openModal({
          children: <FeedBackModal title={response.error} variant={"error"} />,
        });
        return;
      }
      openModal({
        children: (
          <FeedBackModal
            variant={"success"}
            title={"Vagas despublicada com sucesso"}
          />
        ),
      });
      return;
    }
    setPublishedJobs(response.jobPublications);
  };

  useEffect(() => {
    getPublichedJob();
  }, []);

  const handleUnpublishClick = async (
    unpublishJobRequest: UnpublishJobRequest
  ) => {
    const response = await unpublishJob(unpublishJobRequest);
    if (!response.success) {
      openModal({
        children: <FeedBackModal title={response.error} variant={"error"} />,
      });
      return;
    }
    openModal({
      children: (
        <FeedBackModal
          variant={"success"}
          title={"Vaga despublicada com sucessos"} 
        />
      ),
    });

    await getPublichedJob();
  };

  return (
    <div>
      <section>
        <h3 className=" text-[20px] font-bold mb-6">Vagas publicadas</h3>
        <div className="flex flex-col gap-4">
          {publishedJobs &&
            publishedJobs.map((publishedJob) => (
              <JobCard
                onDeleteClick={() =>
                  openModal({
                    children: (
                      <ConfirmationModal
                        onAgreeClick={() =>
                          handleUnpublishClick({
                            status: "removed",
                            jobPublicationId: publishedJob.id,
                          })
                        }
                        title={"Deseja despublicar essa vaga?"}
                      />
                    ),
                  })
                }
                status={publishedJob.status}
                key={publishedJob.id}
                job={publishedJob.job}
              />
            ))}
        </div>
      </section>
    </div>
  );
};

export default PublishedJobs;
