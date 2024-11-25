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
import { useNavigate } from "react-router-dom";
import { createJob } from "@/services";
import { jobTypeMapping, modalityMapping, fieldMaping, jobTypes, modalities, fields } from '@/utils/mappings';
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
  //company_id: z.number().min(1, "Campo obrigatório"),
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
    resolver: zodResolver(jobSchema)
  });

  const onSubmit = async (data: JobData) => {
    setLoading(true);
    try {
      const jobData = {
        ...data,
        //tags: selectedTags.map(tag => ({ id: tag.id, name: tag.name })),
      };
      await createJob(jobData);
      alert("Vaga cadastrada com sucesso!");
      navigate("/vagas");
    } catch (error) {
      alert("Erro ao cadastrar a vaga. Tente novamente.");
      console.error("Erro ao cadastrar vaga:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10 ">
      <h2 className="text-2xl font-bold mb-4">Cadastro de Vaga</h2>
      <form className="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit, (error) => console.error(error))}>
        <Input placeholder="Exemplo: Desenvolvedor de Software Junior" label="Nome da Vaga:" {...register("job_name")} error={errors.job_name?.message} />
        <Input placeholder="Exemplo: São Paulo, SP, Brasil" label="Local:" {...register("location")} error={errors.location?.message} />

        <Label className="">Tipo de vaga:
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="mt-1" >
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

        <Label className="">Modalidade:
        <Controller
          name="mode"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="mt-1" >
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

        <Label className="mt-[7px]" >Área de atuação:
        <Controller
          name="field_id"
          control={control}
          render={({ field }) => (
            <Select  onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || ''}>
              <SelectTrigger className="mt-1" >
                <SelectValue placeholder="Selecione a área de atuação" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((option) => (
                  <SelectItem key={option} value={fieldMaping[option]}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        </Label>

        <Input placeholder="Exemplo: 40" label="Carga Horária Semanal:" type="number" {...register("weekly_hours", { valueAsNumber: true })} error={errors.weekly_hours?.message} />
        <Input placeholder="Exemplo: 2000" label="Salário:" type="number" {...register("salary", { valueAsNumber: true })} error={errors.salary?.message} />

        {/*<MultiSelectInput label="Tags" options={jobTags} selectedOptions={selectedTags} onChange={setSelectedTags} error={errors.tags?.message} />*/}
        
        <Textarea
        placeholder="Coloque também na descrição a forma de candidatura, por exemplo: link para aplicar, e-mail de contato com qual deve ser o assunto, telefone para contato..."
        label="Descrição:" {...register("description")} error={errors.description?.message} />
        
        
        <Textarea
        placeholder="Escreva aqui o que está procurando na pessoa que irá ocupar esta vaga, quais conhecimentos e skills ela precisa ter."
        label="Requisitos:" {...register("requirements")} error={errors.requirements?.message} />
        <Textarea 
        placeholder="Escreva aqui quais os benefícios o candidato será se ocupar esta vaga, por exemplo: vale alimentação, vale transporte, plano de saúde..."
        label="Benefícios:" {...register("benefits")} error={errors.benefits?.message} />

        <Button type="submit" className="w-full md:col-span-2" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar Vaga"}
        </Button>
      </form>
    </div>
  );
};

export default JobForm;