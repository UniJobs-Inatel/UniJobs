import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cpfValidator, onlyNumbers, requiredString } from "@/utils";
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
import { Experience } from "@/domain/student";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { formatDate, isoFormatter } from "@/lib/cn";
import { ICreateStudentProfileRequest } from "@/services/student/interface";
import {
  createStudentProfile,
  getAllTags,
  getStudentProfile,
  updateStudentProfile,
} from "@/services";
import { useModalStore } from "@/stores/modalStore";
import { FeedBackModal } from "@/components/ui/feedbackModal.";
import { AuthResponse, UserStatus } from "@/domain/user";
import { getTypedLocalStorage } from "@/utils/typedLocalStorage";

const StudentProfile = () => {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedExperience, setSelectedExperience] = useState<{
    selectedExperience: ExperienceData | null;
    index?: number;
  } | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const [tags, setTags] = useState<Tag[]>([]);

  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { openModal } = useModalStore();

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
    reset,
    formState: { errors },
  } = useForm<CompleteRegistrationData>({
    resolver: zodResolver(completeRegistrationSchema),
    defaultValues: {
      cpf: "",
      first_name: "",
      last_name: "",
    },
  });

  const handleCompleteRegistration = async (data: CompleteRegistrationData) => {
    const experiencesFormatted = experiences.map(
      (experience) =>
        ({
          ...experience,
          start_date: isoFormatter(experience.start_date),
          end_date: isoFormatter(experience.end_date),
        }) as Experience
    );

    const creationData: ICreateStudentProfileRequest = {
      student: { ...data, cpf: onlyNumbers(data.cpf) },
      experiences: experiencesFormatted,
      proficiencies: selectedTags.map((tag) => ({ id: tag.id })),
    };

    if (user?.status == UserStatus.COMPLETE) {
      delete creationData.student.cpf
      const updateResponse = await updateStudentProfile(creationData);
      if (!updateResponse.success) {
        openModal({
          children: (
            <FeedBackModal title={updateResponse.error} variant={"error"} />
          ),
          contentClassName: "w-[86vw]",
        });
        return;
      }
    }

    const creationResponse = await createStudentProfile(creationData);

    if (!creationResponse.success) {
      openModal({
        children: (
          <FeedBackModal title={creationResponse.error} variant={"error"} />
        ),
        contentClassName: "w-[86vw]",
      });
      return;
    }

    openModal({
      children: (
        <FeedBackModal
          onOkayClick={() => {
            const auth = getTypedLocalStorage<{
              user: AuthResponse;
              accessToken: string;
              refreshToken: string;
            }>("session");
            if (auth) {
              localStorage.setItem(
                "session",
                JSON.stringify({
                  user: { ...auth.user, status: UserStatus.COMPLETE },
                  accessToken: auth.accessToken,
                  refreshToken: auth.refreshToken,
                })
              );
            }
          }}
          title="Perfil salvo com sucesso"
          variant={"success"}
        />
      ),
      contentClassName: "w-[86vw]",
    });
    
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

  const getStudentInfo = async () => {
    const tagsResponse = await getAllTags();

    if (!tagsResponse.success) {
      openModal({
        children: (
          <FeedBackModal variant={"error"} title={tagsResponse.error} />
        ),
      });
      return;
    }

    setTags(tagsResponse.tags);

    if (user?.status == UserStatus.COMPLETE) {
      const response = await getStudentProfile();

      if (!response.success) {
        openModal({
          children: <FeedBackModal variant={"error"} title={response.error} />,
        });

        return;
      }

      reset({
        cpf: response.cpf,
        first_name: response.first_name,
        last_name: response.last_name,
      });

      setExperiences(
        response.experiences.map(
          (experience) =>
            ({
              ...experience,
              end_date: formatDate(experience.end_date ?? ""),
              start_date: formatDate(experience.start_date ?? ""),
            }) as ExperienceData
        )
      );

      setSelectedTags(
        tagsResponse.tags.filter((tag) =>
          response.proficiencies.some(
            (proficiencie) => proficiencie.tag_id === tag.id
          )
        ) ?? []
      );
    }
  };

  useEffect(() => {
    getStudentInfo();
  }, []);

  return (
    <div className="pb-5">
      <h3 className=" text-2xl font-bold mb-6">Meu perfil</h3>
      <section>
        <h4 className=" text-[16px] font-bold mb-4">Informações Pessoais</h4>
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
        <h4 className=" text-[16px] font-bold">Experiências</h4>
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(true)}>
          <DialogTrigger asChild>
            <Button className=" mt-3 mb-3" variant="outline">
              Adicionar Experiência
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white w-[96vw] max-w-[425px] max-h-[85vh] overflow-y-scroll rounded-lg">
            <DialogHeader>
              <X className="w-4 h-4 self-end" onClick={() => closeModal()} />
              <DialogTitle className=" ">Adicionar Experiência</DialogTitle>
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
              data-cy="experiences"
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
                    className="w-5 h-5 "
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
          onClick={handleSubmit(handleCompleteRegistration)}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default StudentProfile;
