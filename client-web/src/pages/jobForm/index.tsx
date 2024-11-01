import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectValue, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { requiredString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { createJob } from "@/services/repositories";
import { useNavigate } from "react-router-dom";
//import { MultiSelectInput } from "@/components/ui/multiSelectInput";
//import { Tag } from '@/domain/tags';
/*
const jobTags = [
  { id: 1, name: "React" },
  { id: 2, name: "JavaScript" },
  { id: 3, name: "Modelagem 3D" },
  { id: 4, name: "Excel" },
];*/

const jobSchema = z.object({
  job_name: requiredString(),
  description: requiredString(),
  location: requiredString(),
  type: z.enum(["freelance", "trainee", "clt", "pj", "internship"]),
  mode: z.enum(["on_site", "hybrid", "remote"]),
  weekly_hours: z.number().min(1, "Informe a carga horária semanal"),
  benefits: requiredString(),
  salary: z.number().min(1, "O salário é obrigatório"),
  requirements: requiredString(),
  //tags: z.array(z.object({ id: z.number(), name: z.string() })).optional(),
  field_id: z.number().min(1, "Campo obrigatório"),
  company_id: z.number().min(1, "Campo obrigatório"),
});

export type JobData = z.infer<typeof jobSchema>;

const JobForm = () => {
  //const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JobData>({
    resolver: zodResolver(jobSchema),
  });

  const jobTypeMapping: Record<string, string> = {
    "Estágio": "internship",
    "Freelancer": "freelance",
    "Trainee": "trainee",
    "CLT": "clt",
    "PJ": "pj",
  };

  const modalityMapping: Record<string, string> = {
    "Presencial": "on_site",
    "Híbrido": "hybrid",
    "Remoto": "remote"
  };

  const jobTypes = Object.keys(jobTypeMapping) as Array<keyof typeof jobTypeMapping>;
  const modalities = Object.keys(modalityMapping) as Array<keyof typeof modalityMapping>;

  const onSubmit = async (data: JobData) => {
    setLoading(true);
    try {
      const jobData = {
        ...data,
        //tags: selectedTags.map(tag => ({ id: tag.id, name: tag.name })),
      };
      await createJob(jobData);
      alert("Vaga cadastrada com sucesso!");
      navigate("/jobList");
    } catch (error) {
      alert("Erro ao cadastrar a vaga. Tente novamente.");
      console.error("Erro ao cadastrar vaga:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xxl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl text-primary font-bold mb-4">Cadastro de Vaga</h2>
      <form className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Nome da Vaga:" {...register("job_name")} error={errors.job_name?.message} />
        <Input label="Local:" {...register("location")} error={errors.location?.message} />

        <Label className="text-primary">Tipo de vaga:
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de vaga" />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((option) => (
                  <SelectItem key={option} value={jobTypeMapping[option]}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        </Label>

        <Label className="text-primary">Modalidade:
        <Controller
          name="mode"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a modalidade" />
              </SelectTrigger>
              <SelectContent>
                {modalities.map((option) => (
                  <SelectItem key={option} value={modalityMapping[option]}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        </Label>

        <Input label="Carga Horária Semanal:" type="number" {...register("weekly_hours", { valueAsNumber: true })} error={errors.weekly_hours?.message} />
        <Input label="Faixa Salarial:" type="number" {...register("salary", { valueAsNumber: true })} error={errors.salary?.message} />

        {/*<MultiSelectInput label="Tags" options={jobTags} selectedOptions={selectedTags} onChange={setSelectedTags} error={errors.tags?.message} />*/}
        <Textarea label="Descrição:" {...register("description")} error={errors.description?.message} />
        <Textarea label="Requisitos:" {...register("requirements")} error={errors.requirements?.message} />
        <Textarea label="Benefícios:" {...register("benefits")} error={errors.benefits?.message} />

        {/*<Input label="ID da Área:" type="number" {...register("field_id", { valueAsNumber: true })} error={errors.field_id?.message} />
        <Input label="ID da Empresa:" type="number" {...register("company_id", { valueAsNumber: true })} error={errors.company_id?.message} />*/}

        <Button type="submit" className="w-full md:col-span-2" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar Vaga"}
        </Button>
      </form>
    </div>
  );
};

export default JobForm;