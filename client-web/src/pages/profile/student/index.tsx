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
import { useEffect, useState } from "react";
import { EditIcon, Trash2Icon, X } from "lucide-react";
import { MultiSelectInput } from "@/components/ui/multiSelectInput";
import { Tag } from "@/domain/tags";
import { getAllTags } from "@/services/repositories/tags";
import { createStudentProfile } from "@/services/repositories";
import { Experience, ICreateStudentProfile } from "@/domain/student";
import { isoFormatter, onlyNumbers } from "@/lib/utils";
import useAuthStore from "@/stores/authStore";

const StudentProfile = () => {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedExperience, setSelectedExperience] = useState<{
    selectedExperience: ExperienceData | null;
    index?: number;
  } | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const [tags, setTags] = useState<Tag[]>([]);

  const {user} = useAuthStore()


  const completeRegistrationSchema = z.object({
    first_name: requiredString(),
    last_name: requiredString(),
    cpf: requiredString().refine(cpfValidator, {
      message: "Digite um CPF válido.",
    }),
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
      first_name: "",
      last_name: "",
    },
  });

  const handleLogin = async (data: CompleteRegistrationData) => {
    console.log("Tags:", selectedTags);
    console.log(":", experiences);
    console.log("Login data:", data);

    const experiencesFormatted = experiences.map(
      (experience) =>
        ({
          ...experience,
          start_date: isoFormatter(experience.start_date),
          end_date: isoFormatter(experience.end_date),
        }) as Experience
    );

    const creationData: ICreateStudentProfile = {
      student: { ...data, cpf: onlyNumbers(data.cpf) },
      userId: 8,
      experiences: experiencesFormatted,
      proficiencies: selectedTags.map((tag) => ({ id: tag.id })),
    };

    const response = await createStudentProfile(creationData);

    if (response?.status == 201) console.log("Deu certo");
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedExperience(null);
  };

  const addNewExperience = (data: ExperienceData) => {
    closeModal();

    setExperiences((experiences) => {
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

  useEffect(() => {
    getAllTags().then((response) => response && setTags(response));
  }, []);

  return (
    <div className="pb-5">
      <h3 className="text-primary text-[20px] font-bold mb-6">Meu perfil</h3>
      <section>
        <h4 className="text-primary text-[16px] font-bold mb-4">
          Informações Pessoais
        </h4>
        <form className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Input
            label="Nome:"
            id="firstName"
            {...register("first_name")}
            placeholder="Seu nome"
            error={errors.first_name?.message}
          />
          <Input
            label="Sobrenome:"
            id="lastName"
            {...register("last_name")}
            placeholder="Seu sobrenome"
            error={errors.last_name?.message}
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
            value={user?.email}
            disabled
          />

          <MultiSelectInput
            label="Competências:"
            selectedOptions={selectedTags}
            onChange={(value: Tag[]) => setSelectedTags(value)}
            options={tags}
          />
        </form>
      </section>

      <section className="mt-4">
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
              key={`${experience.position} ${experience.company_name} ${Math.random()}`}
            >
              <div className="flex justify-between">
                <h3 className="font-bold text-[18px]">{experience.position}</h3>
                <div className="text-[14px]">{`${experience.start_date} - ${experience.end_date == "" ? "Atual" : experience.end_date}`}</div>
              </div>
              <h4>{experience.company_name}</h4>
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
      <div className="flex justify-end mt-4 ">
        <Button
          className="w-[160px] h-10 text-white bg-primary"
          type="submit"
          onClick={handleSubmit(handleLogin)}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default StudentProfile;
