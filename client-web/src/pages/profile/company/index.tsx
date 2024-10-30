import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ICreateCompanyProfile } from "@/domain/company";
import { onlyNumbers } from "@/lib/cn";
import { createCompanyProfile, getCompanyData, getJobsByCompany } from "@/services/repositories";
import { cnpjValidator, requiredString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";
import { JobCard } from "@/components/ui/jobCard";
import { Job } from "@/domain/job";
import { useEffect, useState } from "react";

const CompanyProfile = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([
    {
      job_name: "Software Engineer",
      description: "Develop and maintain software solutions.",
      location: "New York",
      type: "clt",
      weekly_hours: 40,
      mode: "remote",
      benefits: "Health insurance, 401k",
      salary: 80000,
      requirements: "3+ years experience with Node.js and React",
      id: 1
    }
  ])


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

  const getCompanyInfo = async () => {
    const response = await getCompanyData();
    if(response?.status !== 200) return;

    reset({
      cnpj:response.data.cnpj,
      name:response.data.name,
      contact_website:response.data.cnpj,
      description:response.data.description,
      field_of_activity:response.data.field_of_activity,
    })

    if(!response.data.id) return;

    const jobResponse = await getJobsByCompany(response.data.id)
    if(!jobResponse?.data) return;
    
    setJobs(jobResponse.data)

  } 

  useEffect(() => {
    getCompanyInfo()
  },[])

  const onSubmit = async (data: CompleteRegistrationData) => {
    const creationData: ICreateCompanyProfile = {
      ...data,
      cnpj: onlyNumbers(data.cnpj),
      user_id: 11,
    };

    const response = await createCompanyProfile(creationData);

    if (response?.status == 201) console.log("Deu certo");
  };


  return (
    <div className="pb-5">
      <h3 className="text-primary text-[20px] font-bold mb-6">Meu perfil</h3>
      <section>
        <h4 className="text-primary text-[16px] font-bold mb-4">
          Informações Empresariais
        </h4>
        <form className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-x-2 gap-y-4 md:flex-row">
            <Input
              label="Nome da Empresa:"
              id="lastName"
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
                  mask=" 99.999.999/0001-99"
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
        <section className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-primary text-[16px] font-bold mb-4">Vagas</h4>
            <Button
              onClick={() => navigate("/job-form")}
              variant={"outline"}
              className="h-[32px] w-36 text-sm"
              prefixIcon={<PlusIcon className="fill-primary w-[18px]" />}
            >
              Nova Vaga
            </Button>
          </div>
          <div>
            {jobs && jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
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
