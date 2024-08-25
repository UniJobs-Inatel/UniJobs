import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cpfValidator } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Profile = () => {
  const completeRegistrationSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    cpf: z.string().refine(cpfValidator, {
      message: "Digite um CPF válido.",
    }),
  });

  type CompleteRegistrationData = z.infer<typeof completeRegistrationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteRegistrationData>({
    resolver: zodResolver(completeRegistrationSchema),
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
        <form className="grid grid-cols-1" onSubmit={handleSubmit(handleLogin)}>
          <Input
            label="Nome:"
            id="firstName"
            {...register("firstName")}
            placeholder="Seu nome"
            className="mb-4"
          />
          <Input
            label="Sobrenome:"
            id="lastName"
            {...register("lastName")}
            placeholder="Seu sobrenome"
            className="mb-4"
          />
          <Input
            label="CPF:"
            mask="999.999.999-99"
            inputMode="numeric"
            id="cpf"
            {...register("cpf")}
            placeholder="Seu nome"
            className="mb-4"
          />
          {errors.cpf && <p className="text-red-500">{errors.cpf.message}</p>}
          <Input
            label="E-mail:"
            type="email"
            disabled
            id="email"
            defaultValue={"Email"}
            placeholder="Entre com seu e-mail"
            className="mb-4"
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
          <DialogContent className="bg-white sm:max-w-[425px] max-h-[350px] overflow-y-scroll">
            <DialogHeader>
              <DialogTitle>Adicionar Experiência</DialogTitle>
            </DialogHeader>
            <form>
              <RadioGroup defaultValue="professional" className="mb-3 grid-cols-2" >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="professional" />
                  <Label htmlFor="professional">Profissional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="academic" id="academic" />
                  <Label htmlFor="academic">Acadêmica</Label>
                </div>
              </RadioGroup>
              <Input
                label="Cargo:"
                type="position"
                id="position"
                placeholder="Seu cargo"
                className="mb-4"
              />
              <Input
                label="Nome da empresa:"
                id="companyName"
                placeholder="Nome da empresa"
                className="mb-4"
              />
              <Input
                label="Início:"
                id="start"
                placeholder="Início"
                className="mb-4"
              />
              <Input
                label="Término:"
                id="start"
                placeholder="Término"
                className="mb-4"
              />
              <Input
                label="Descrição:"
                id="description"
                placeholder="Descrição"
                className="mb-4"
              />
            </form>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
};

export default Profile;
