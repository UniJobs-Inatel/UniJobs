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
import { ExperienceForm } from "./ExperienceForm";

const Profile = () => {
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
    defaultValues:{
      cpf:'',
      email:'',
      firstName:'',
      lastName:''
    }
  });

  const handleLogin = (data: CompleteRegistrationData) => {
    console.log("Login data:", data);
  };

  return (
    <div>
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-primary" variant="outline">
              Adicionar Experiência
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white w-[96vw] max-w-[425px] max-h-[85vh] overflow-y-scroll rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-primary">
                Adicionar Experiência
              </DialogTitle>
            </DialogHeader>
            {<ExperienceForm />}
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
};

export default Profile;
