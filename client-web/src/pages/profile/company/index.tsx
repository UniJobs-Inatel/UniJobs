import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cnpjValidator, onlyNumbers, requiredString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";
import { JobCard } from "@/components/ui/jobCard";
import { Job, JobPublication } from "@/domain/job";
import { useEffect, useState } from "react";
import {
  createCompanyProfile,
  deleteJob,
  getAllJobToValidate,
  getCompanyData,
  getJobsByCompany,
  unpublishJob,
  validateJob,
} from "@/services";
import { ICreateCompanyProfileRequest } from "@/services/company/interface";
import { useModalStore } from "@/stores/modalStore";
import IesSelectModal from "./components/IesSelectModal";
import { UserStatus, UserType } from "@/domain/user";
import { FeedBackModal } from "@/components/ui/feedbackModal.";
import { ConfirmationModal } from "@/components/ui/confirmationModal";
import {
  UnpublishJobRequest,
  ValidateJobRequest,
} from "@/services/job/interface";
import { JobStatus } from "@/utils/mappers";

const CompanyProfile = () => {
  const { user } = useAuthStore();
  const { openModal } = useModalStore();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsToValidate, setJobsToValidate] = useState<JobPublication[]>([]);

  const completeRegistrationSchema = z.object({
    name: requiredString(),
    description: requiredString(),
    field_of_activity: requiredString(),
    contact_website: requiredString(),
    cnpj: requiredString().refine(cnpjValidator, {
      message: "Digite um CNPJ válido.",
    }),
  });

  type CompleteRegistrationData = z.infer<typeof completeRegistrationSchema>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CompleteRegistrationData>({
    resolver: zodResolver(completeRegistrationSchema),
    defaultValues: {
      cnpj: "",
      name: "",
    },
  });

  const getJobToValidation = async () => {
    const response = await getAllJobToValidate();

    if (!response.success) {
      openModal({
        children: <FeedBackModal title={response.error} variant={"error"} />,
      });
      return;
    }

    setJobsToValidate(response.jobPublications);
  };

  const getJobs = async () => {
    const jobResponse = await getJobsByCompany();
    if (!jobResponse?.success) return;

    setJobs(jobResponse.jobs);
  };

  const getCompanyInfo = async () => {
    const response = await getCompanyData();
    if (response?.status !== 200) return;

    reset({
      cnpj: response.data.cnpj,
      name: response.data.name,
      contact_website: response.data.contact_website,
      description: response.data.description,
      field_of_activity: response.data.field_of_activity,
    });

    if (!response.data.id) return;

    await getJobs();
    user?.type == UserType.COLLEGE && (await getJobToValidation());
  };

  useEffect(() => {
    getCompanyInfo();
  }, []);

  const removeJob = async (jobId?: number) => {
    if (!jobId) {
      return;
    }
    const response = await deleteJob(jobId);

    if (response) {
      openModal({
        children: <FeedBackModal title={"Vaga removida com sucesso"} />,
      });
      return;
    }

    openModal({
      children: (
        <FeedBackModal variant={"error"} title={"Erro ao apagar a vaga"} />
      ),
    });
  };

  const onSubmit = async (data: CompleteRegistrationData) => {
    const creationData: ICreateCompanyProfileRequest = {
      ...data,
      cnpj: onlyNumbers(data.cnpj),
      user_id: 11,
    };

    const response = await createCompanyProfile(creationData);

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
          title={"Empresa salva com sucesso"}
        />
      ),
    });
  };

  const publishJob = ({ jobId }: { jobId: number }) => {
    openModal({
      children: <IesSelectModal getJobs={getJobs} jobId={jobId} />,
    });
  };

  const handleValidateJobClick = async (
    validateJobRequest: ValidateJobRequest
  ) => {
    const response = await validateJob(validateJobRequest);
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
          title={
            validateJobRequest.status == JobStatus.approved
              ? "Vaga validada com sucesso"
              : "Vagas reprovada com sucesso"
          }
        />
      ),
    });

    await getJobToValidation();
  };

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

    await getJobToValidation();
  };

  return (
    <div className="pb-5">
      <h3 className=" text-2xl font-bold mb-6">Meu perfil</h3>
      <section>
        <h4 className=" text-[16px] font-bold mb-4">
          Informações Empresariais
        </h4>
        <form className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-x-2 gap-y-4 md:flex-row">
            <Input
              label="Nome da Empresa:"
              id="name"
              {...register("name")}
              placeholder="Nome da empresa"
              error={errors.name?.message}
            />
            <Controller
              control={control}
              name="cnpj"
              render={({ field }) => (
                <Input
                  label="CNPJ:"
                  mask=" 99.999.999/9999-99"
                  inputMode="numeric"
                  id="cnpj"
                  {...field}
                  placeholder="Seu CNPJ"
                  error={errors.cnpj?.message}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-x-2 gap-y-4 md:flex-row">
            <Input label="E-mail:" id="email" value={user?.email} disabled />
            <Input
              label="Descrição:"
              id="description"
              placeholder="Entre com a descrição"
              {...register("description")}
              error={errors.description?.message}
            />
          </div>
          <div className="flex flex-col gap-x-2 gap-y-4 md:flex-row">
            <Input
              label="Área de atuação:"
              id="field_of_activity"
              placeholder="Entre a área de atuação"
              {...register("field_of_activity")}
              error={errors.field_of_activity?.message}
            />
            <Input
              label="Site:"
              id="contact_website"
              placeholder="Entre com o site da empresa"
              {...register("contact_website")}
              error={errors.contact_website?.message}
            />
          </div>
        </form>
        {user?.status == UserStatus.COMPLETE && (
          <section className="mt-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className=" text-[16px] font-bold mb-4">Vagas</h4>
              <Button
                onClick={() => navigate("/cadastrar-vaga")}
                variant={"outline"}
                className="h-[32px] w-36 text-sm"
                prefixIcon={<PlusIcon className="fill-primary w-[18px]" />}
              >
                Nova Vaga
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              {jobs &&
                jobs.map((job, index) => (
                  <div data-cy={`publish-card-${index}`} >
                    <JobCard
                      onDeleteClick={() =>
                        openModal({
                          children: (
                            <ConfirmationModal
                              onAgreeClick={() => removeJob(job.id)}
                              title={"Deseja remover essa vaga?"}
                            />
                          ),
                        })
                      }
                      publishJob={publishJob}
                      key={job.id}
                      job={job}
                    />
                  </div>
                ))}
            </div>
          </section>
        )}

        {user?.type == UserType.COLLEGE && (
          <section>
            <h4 className="text-[16px] font-bold mb-4">Validação</h4>

            <div className="flex flex-col gap-4">
              {jobsToValidate &&
                jobsToValidate.map((jobToValidate) => (
                  <JobCard
                    key={jobToValidate.id}
                    onDeleteClick={() =>
                      openModal({
                        children: (
                          <ConfirmationModal
                            onAgreeClick={() =>
                              handleUnpublishClick({
                                status: "removed",
                                jobPublicationId: jobToValidate.id,
                              })
                            }
                            title={"Deseja despublicar essa vaga?"}
                          />
                        ),
                      })
                    }
                    status={jobToValidate.status}
                    validateJobFromCard={() =>
                      openModal({
                        children: (
                          <ConfirmationModal
                            onAgreeClick={() =>
                              handleValidateJobClick({
                                status: "approved",
                                jobPublicationId: jobToValidate.id,
                              })
                            }
                            onDeclineClick={() =>
                              handleValidateJobClick({
                                status: "reproved",
                                jobPublicationId: jobToValidate.id,
                              })
                            }
                            title={"Deseja validar essa vaga?"}
                          />
                        ),
                      })
                    }
                    job={jobToValidate.job}
                  />
                ))}
            </div>
          </section>
        )}

        <div className="flex justify-end mt-4 ">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="w-[160px] h-10 text-white bg-primary"
          >
            Salvar
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CompanyProfile;
