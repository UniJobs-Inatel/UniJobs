import { Button } from "@/components/ui/button";
import { FeedBackModal } from "@/components/ui/feedbackModal.";
import { getAvailablesIEsByJob, publishJob } from "@/services";
import { AvailablesIesResponse } from "@/services/job/interface";
import { useModalStore } from "@/stores/modalStore";
import { useEffect, useState } from "react";

const IesSelectModal = ({
  jobId,
  getJobs
}: {
  jobId: number;
  getJobs:() => Promise<void>
}) => {
  const [availablesIes, setAvailablesIes] = useState<AvailablesIesResponse[]>();
  const { openModal } = useModalStore();

  const getAvailablesIes = async () => {
    const response = await getAvailablesIEsByJob(jobId);
    if (response?.status !== 200) {
      return;
    }

    setAvailablesIes(response?.data);
  };

  const selectIes = async (college_id: number) => {
    const response = await publishJob({
      job_id: jobId,
      college_id,
    });
    let modalTitle = "Vaga publicada com sucesso";

    if (response.status != 201) {
      modalTitle = "Erro ao publicar a vaga";
    }

    openModal({ children: <FeedBackModal onOkayClick={getJobs}  title={modalTitle} variant={response.status != 201 ? 'error' : 'success'} /> });
  };

  useEffect(() => {
    getAvailablesIes();
  }, []);

  return (
    <div>
      <h2 className="mb-3 text-[20px] font-semibold">
        Selecione o IES para publicar sua vaga
      </h2>
      <div className="flex flex-col gap-3 justify-center">
        {(availablesIes ?? []).map((ies) => {
          return (
            <div className="flex justify-between items-center">
              <p className="">{ies.id}</p>
              <Button
                onClick={() => selectIes(ies.id)}
                className="w-[100px] h-8"
              >
                Publicar
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IesSelectModal;
