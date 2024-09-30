import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cpfValidator, requiredString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { ExperienceData, ExperienceForm } from "../ExperienceForm";
import { useState } from "react";
import { EditIcon, Trash2Icon, X } from "lucide-react";

const CollegeProfile = () => {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedExperience, setSelectedExperience] = useState<{
    selectedExperience: ExperienceData | null;
    index?: number;
  } | null>(null);

  const completeRegistrationSchema = z.object({
    firstName: requiredString(),
    lastName: requiredString(),
    cpf: requiredString().refine(cpfValidator, {
      message: "Digite um CPF válido.",
    }),
    email: requiredString().email("Digite um email válido"),
  });

  type CompleteRegistrationData = z.infer<typeof completeRegistrationSchema>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CompleteRegistrationData>({
    resolver: zodResolver(completeRegistrationSchema),
    defaultValues: {
      cpf: "",
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  const handleLogin = (data: CompleteRegistrationData) => {
    console.log("Login data:", data);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedExperience(null);
  };

  const addNewExperience = (data: ExperienceData) => {
    closeModal();

    setExperiences((experiences) => {
      console.log(data);
      console.log(selectedExperience?.index);
      if (
        selectedExperience?.index == undefined ||
        selectedExperience?.index == null
      )
        return [...experiences, data];
      experiences[selectedExperience.index] = data;
      return experiences;
    });
  };

  const selectExperience = (experience: ExperienceData, index: number) => {
    setIsOpen(true);
    setSelectedExperience({
      selectedExperience: experience,
      index: index,
    });
  };

  const deleteExperience = (experienceIndex: number) => {
    setExperiences((experiences) =>
      experiences.filter((_, index) => index != experienceIndex)
    );
  };

  return (
    <div className="pb-5">
      <h3 className="text-primary text-[20px] font-bold mb-3">Meu perfil</h3>
      <section>
        <h4 className="text-primary text-[16px] font-bold">
          Informações Pessoais
        </h4>
        <form
          className="grid grid-cols-1 gap-4"
          onSubmit={handleSubmit(handleLogin)}
        >
          <Input
            label="Nome:"
            id="firstName"
            {...register("firstName")}
            placeholder="Seu nome"
            error={errors.firstName?.message}
          />
          <Input
            label="Sobrenome:"
            id="lastName"
            {...register("lastName")}
            placeholder="Seu sobrenome"
            error={errors.lastName?.message}
          />
          <Controller
            control={control}
            name="cpf"
            render={({ field }) => (
              <Input
                label="CPF:"
                mask="999.999.999-99"
                inputMode="numeric"
                id="cpf"
                {...field}
                placeholder="Seu cpf"
                error={errors.cpf?.message}
              />
            )}
          />

          <Input
            label="E-mail:"
            type="email"
            id="email"
            placeholder="Entre com seu e-mail"
            {...register("email")}
            error={errors.email?.message}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-[160px] h-10 text-white bg-primary"
            >
              Salvar
            </Button>
          </div>
        </form>
      </section>
      <section>
        <h4 className="text-primary text-[16px] font-bold">Experiências</h4>
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(true)}>
          <DialogTrigger asChild>
            <Button className="text-primary mt-3 mb-3" variant="outline">
              Adicionar Experiência
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white w-[96vw] max-w-[425px] max-h-[85vh] overflow-y-scroll rounded-lg">
            <DialogHeader>
              <X className="w-4 h-4 self-end" onClick={() => closeModal()} />
              <DialogTitle className="text-primary ">
                Adicionar Experiência
              </DialogTitle>
            </DialogHeader>
            {
              <ExperienceForm
                selectedExperience={
                  selectedExperience?.selectedExperience ?? null
                }
                addNewExperience={addNewExperience}
              />
            }
          </DialogContent>
        </Dialog>
        <div className="flex flex-col gap-4">
          {experiences.map((experience, index) => (
            <div
              className="flex flex-col justify-evenly w-full border border-primary-800 rounded-lg p-1 h-[120px]"
              key={`${experience.position} ${experience.companyName} ${Math.random()}`}
            >
              <div className="flex justify-between">
                <h3 className="font-bold text-[18px]">{experience.position}</h3>
                <div className="text-[14px]">{`${experience.start} - ${experience.end == "" ? "Atual" : experience.end}`}</div>
              </div>
              <h4>{experience.companyName}</h4>
              <div className="flex justify-between">
                <p className="text-[14px] break-all line-clamp-2 w-4/5 ">
                  {experience.description}
                </p>
                <div className="h-full flex flex-col justify-between items-end">
                  <EditIcon
                    onClick={() => selectExperience(experience, index)}
                    className="w-5 h-5 text-primary"
                  />
                  <Trash2Icon
                    onClick={() => deleteExperience(index)}
                    className="w-5 h-5 text-red-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CollegeProfile;
