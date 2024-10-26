import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { requiredString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@radix-ui/react-label";

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
          <Input
            id="title"
            label="Nome da Vaga*"
            placeholder="Título da vaga"
            {...register("title")}
            error={errors.title?.message}
          />
        </div>

        <div>
          <Textarea
            id="description"
            label="Descrição*"
            placeholder="Descreva a vaga"
            {...register("description")}
            error={errors.description?.message}
          />
        </div>

        <div>
          <Input
            id="location"
            label="Local*"
            placeholder="Localização da vaga"
            error={errors.location?.message}
            {...register("location")}
          />
        </div>

        <div>
          <Label htmlFor="jobType" className="block text-sm font-medium mb-1">
            Tipo de Vaga*
          </Label>
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
          <Input
            id="modality"
            label=' Modalidade*'
            error={errors.modality?.message}
            placeholder="Remoto, Presencial, Híbrido"
            {...register("modality")}
          />
          {errors.modality && <p className="mt-1 text-xs text-red-500">{}</p>}
        </div>

        <div>
          <Textarea
            id="benefits"
            placeholder="Quais são os benefícios?"
            error={errors.benefits?.message}
            label="Benefícios*"
            {...register("benefits")}
          />
        </div>

        <div>
          <Input
            id="salaryRange"
            label="Faixa Salarial*"
            placeholder="Faixa salarial"
            error={errors.salaryRange?.message}
            {...register("salaryRange")}

          />

        </div>

        <div>
          {/* TODO: Corrigir para input de tags */}
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
          <Textarea
            id="requirements"
            placeholder="Quais são os requisitos?"
            label="Requisitos*"
            error={errors.requirements?.message}
            {...register("requirements")}
          />

        </div>

        <Button type="submit" className="w-full">
          Cadastrar Vaga
        </Button>
      </form>
    </div>
  );
};

export default JobForm;