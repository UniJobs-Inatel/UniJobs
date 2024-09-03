import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioButton } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { isValidDate, requiredString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const experienceSchema = z.object({
  position: requiredString(),
  companyName: requiredString(),
  description: requiredString(),
  start: requiredString().refine((val) => isValidDate(val), {
    message: "Formato de data inválido",
  }),
  end: z.string(),
  xpType: requiredString(),
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
      companyName: selectedExperience?.companyName ?? "",
      description: selectedExperience?.description ?? "",
      start: selectedExperience?.start ?? "",
      position: selectedExperience?.position ?? "",
      xpType: selectedExperience?.xpType ?? "academic",
      end: selectedExperience?.end ?? "",
    },
  });

  return (
    <form
      className="flex flex-col gap-4 items-center"
      onSubmit={handleSubmit((data:ExperienceData) => addNewExperience(data))}
    >
      <Controller
        name="xpType"
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
            {errors.xpType?.message && <p className="mt-1 text-[10px] text-red-500">{errors.xpType?.message}</p>}
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
        id="companyName"
        placeholder="Nome da empresa"
        error={errors.companyName?.message}
        {...register("companyName")}
      />
      <Controller
        control={control}
        name="start"
        render={({ field }) => (
          <Input
            mask="99/99/9999"
            label="Início*"
            id="start"
            placeholder="mm/dd/aaaa"
            error={errors.start?.message}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="end"
        render={({ field }) => (
          <Input
            mask="99/99/9999"
            label="Término"
            id="end"
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

      <Button className="w-full md:w-[120px] md:self-end ">Salvar</Button>
    </form>
  );
};

export { ExperienceForm };
