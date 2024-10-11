import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Cadastro de Vaga</h2>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((data: JobData) => addNewJob(data))}
      >
        <Input
          label="Nome da Vaga*"
          id="title"
          placeholder="Título da vaga"
          error={errors.title?.message}
          {...register("title")}
        />
        
        <Textarea
          label="Descrição*"
          error={errors.description?.message}
          placeholder="Descreva a vaga"
          {...register("description")}
        />

        <Input
          label="Local*"
          id="location"
          placeholder="Localização da vaga"
          error={errors.location?.message}
          {...register("location")}
        />
        
        <Controller
          name="jobType"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Vaga*</label>
              <select
                {...field}
                className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="estágio">Estágio</option>
                <option value="freelancer">Freelancer</option>
                <option value="trainee">Trainee</option>
                <option value="clt">CLT</option>
                <option value="pj">PJ</option>
                <option value="meio período">Meio Período</option>
                <option value="outro">Outro</option>
              </select>
              {errors.jobType?.message && (
                <p className="mt-1 text-xs text-red-500">{errors.jobType?.message}</p>
              )}
            </div>
          )}
        />

        <Input
          label="Modalidade*"
          id="modality"
          placeholder="Remoto, Presencial, Híbrido"
          error={errors.modality?.message}
          {...register("modality")}
        />

        <Textarea
          label="Benefícios*"
          error={errors.benefits?.message}
          placeholder="Quais são os benefícios?"
          {...register("benefits")}
        />

        <Input
          label="Faixa Salarial*"
          id="salaryRange"
          placeholder="Faixa salarial"
          error={errors.salaryRange?.message}
          {...register("salaryRange")}
        />

        <Input
          label="Tags*"
          id="tags"
          placeholder="Palavras-chave para a vaga"
          error={errors.tags?.message}
          {...register("tags")}
        />

        <Textarea
          label="Requisitos*"
          error={errors.requirements?.message}
          placeholder="Quais são os requisitos?"
          {...register("requirements")}
        />

        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md">
          Cadastrar Vaga
        </Button>
      </form>
    </div>
  );
};

export default  JobForm;
