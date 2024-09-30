import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cnpjValidator, requiredString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const CompanyProfile = () => {
  const completeRegistrationSchema = z.object({
    companyName: requiredString(),
    cnpj: requiredString().refine(cnpjValidator, {
      message: "Digite um CNPJ válido.",
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
      cnpj: "",
      email: "",
      companyName:''
    },
  });

  const handleLogin = (data: CompleteRegistrationData) => {
    console.log("Login data:", data);
  };

  return (
    <div className="pb-5">
      <h3 className="text-primary text-[20px] font-bold mb-3">Meu perfil</h3>
      <section>
        <h4 className="text-primary text-[16px] font-bold">
          Informações Empresariais
        </h4>
        <form
          className="grid grid-cols-1 gap-4"
          onSubmit={handleSubmit(handleLogin)}
        >
          <Input
            label="Nome da Empresa:"
            id="lastName"
            {...register("companyName")}
            placeholder="Nome da empresa"
            error={errors.companyName?.message}
          />
          <Controller
            control={control}
            name="cnpj"
            render={({ field }) => (
              <Input
                label="CNPJ:"
                mask=" 99.999.999/0001-9"
                inputMode="numeric"
                id="cnpj"
                {...field}
                placeholder="Seu cpf"
                error={errors.cnpj?.message}
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
    </div>
  );
};

export default CompanyProfile;
