import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { requiredString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const jobSchema = z.object({
  title: requiredString(),
  description: requiredString(),
  location: requiredString(),
  jobType: requiredString(),
  modality: requiredString(),
  benefits: requiredString(),
  salaryRange: requiredString(),
  tags: requiredString(),
  requirements: requiredString(),
});

export type JobData = z.infer<typeof jobSchema>;

interface JobFormProps {
  addNewJob: (data: JobData) => void;
}

const JobForm = ({ addNewJob }: JobFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JobData>({
    resolver: zodResolver(jobSchema),
  });

  // Definindo jobTypes como um array de strings
  const jobTypes = ["Estágio", "Freelancer", "Trainee", "CLT", "PJ", "Meio Período", "Outro"];

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Cadastro de Vaga</h2>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((data: JobData) => addNewJob(data))}
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Nome da Vaga*
          </label>
          <Input
            id="title"
            placeholder="Título da vaga"
            {...register("title")}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Descrição*
          </label>
          <Textarea
            id="description"
            placeholder="Descreva a vaga"
            {...register("description")}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Local*
          </label>
          <Input
            id="location"
            placeholder="Localização da vaga"
            {...register("location")}
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>}
        </div>

        <div>
          <label htmlFor="jobType" className="block text-sm font-medium mb-1">
            Tipo de Vaga*
          </label>
          <Controller
            name="jobType"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={jobTypes}
              />
            )}
          />
          {errors.jobType && <p className="mt-1 text-xs text-red-500">{errors.jobType.message}</p>}
        </div>

        <div>
          <label htmlFor="modality" className="block text-sm font-medium mb-1">
            Modalidade*
          </label>
          <Input
            id="modality"
            placeholder="Remoto, Presencial, Híbrido"
            {...register("modality")}
            className={errors.modality ? "border-red-500" : ""}
          />
          {errors.modality && <p className="mt-1 text-xs text-red-500">{errors.modality.message}</p>}
        </div>

        <div>
          <label htmlFor="benefits" className="block text-sm font-medium mb-1">
            Benefícios*
          </label>
          <Textarea
            id="benefits"
            placeholder="Quais são os benefícios?"
            {...register("benefits")}
            className={errors.benefits ? "border-red-500" : ""}
          />
          {errors.benefits && <p className="mt-1 text-xs text-red-500">{errors.benefits.message}</p>}
        </div>

        <div>
          <label htmlFor="salaryRange" className="block text-sm font-medium mb-1">
            Faixa Salarial*
          </label>
          <Input
            id="salaryRange"
            placeholder="Faixa salarial"
            {...register("salaryRange")}
            className={errors.salaryRange ? "border-red-500" : ""}
          />
          {errors.salaryRange && (
            <p className="mt-1 text-xs text-red-500">{errors.salaryRange.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags*
          </label>
          <Input
            id="tags"
            placeholder="Palavras-chave para a vaga"
            {...register("tags")}
            className={errors.tags ? "border-red-500" : ""}
          />
          {errors.tags && <p className="mt-1 text-xs text-red-500">{errors.tags.message}</p>}
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium mb-1">
            Requisitos*
          </label>
          <Textarea
            id="requirements"
            placeholder="Quais são os requisitos?"
            {...register("requirements")}
            className={errors.requirements ? "border-red-500" : ""}
          />
          {errors.requirements && (
            <p className="mt-1 text-xs text-red-500">{errors.requirements.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Cadastrar Vaga
        </Button>
      </form>
    </div>
  );
};

export default JobForm;