import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioButton } from "@/components/ui/radioGroup";
import { Textarea } from "@/components/ui/textarea";
import { isValidDate, requiredString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const experienceSchema = z.object({
  position: requiredString(),
  company_name: requiredString(),
  description: requiredString(),
  start_date: requiredString().refine((val) => isValidDate(val), {
    message: "Formato de data inválido",
  }),
  end_date: z.string(),
  type: requiredString(),
});

export type ExperienceData = z.infer<typeof experienceSchema>;

interface ExperienceFormProps{
  addNewExperience: (data: ExperienceData) => void;
  selectedExperience:ExperienceData | null;
}

const ExperienceForm = ({addNewExperience, selectedExperience}:ExperienceFormProps) => {

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ExperienceData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company_name: selectedExperience?.company_name ?? "",
      description: selectedExperience?.description ?? "",
      start_date: selectedExperience?.start_date ?? "",
      position: selectedExperience?.position ?? "",
      type: selectedExperience?.type ?? "academic",
      end_date: selectedExperience?.end_date ?? "",
    },
  });

  return (
    <form
      className="flex flex-col gap-4 items-center"
      onSubmit={handleSubmit((data:ExperienceData) => addNewExperience(data))}
    >
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <div>
            <div className="flex gap-4 ">
              <RadioButton
                label="Acadêmica"
                {...field}
                value="academic"
                checked={field.value === "academic"}
              />
              <RadioButton
                label="Profissional"
                {...field}
                value="professional"
                checked={field.value === "professional"}
              />
            </div>
            {errors.type?.message && <p className="mt-1 text-[10px] text-red-500">{errors.type?.message}</p>}
          </div>
        )}
      />

      <Input
        label="Cargo*"
        type="position"
        id="position"
        placeholder="Seu cargo"
        error={errors.position?.message}
        {...register("position")}
      />
      <Input
        label="Nome da empresa*"
        id="company_name"
        placeholder="Nome da empresa"
        error={errors.company_name?.message}
        {...register("company_name")}
      />
      <Controller
        control={control}
        name="start_date"
        render={({ field }) => (
          <Input
            mask="99/99/9999"
            label="Início*"
            id="start_date"
            placeholder="mm/dd/aaaa"
            error={errors.start_date?.message}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="end_date"
        render={({ field }) => (
          <Input
            mask="99/99/9999"
            label="Término"
            id="end_date"
            placeholder="mm/dd/aaaa"
            {...field}
          />
        )}
      />
      <Textarea
        label="Descrição*"
        error={errors.description?.message}
        placeholder="Descreva um pouco sobre esse experiência"
        {...register("description")}
      />

      <Button data-cy='experience-button' className="w-full md:w-[120px] md:self-end_date ">Salvar</Button>
    </form>
  );
};

export { ExperienceForm };
