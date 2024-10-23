import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ICreateCompanyProfile } from "@/domain/company";
import { onlyNumbers } from "@/lib/utils";
import { createCompanyProfile } from "@/services/repositories";
import { cnpjValidator, requiredString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useAuthStore from "@/stores/authStore";


const CompanyProfile = () => {

  const {user} = useAuthStore()

  const completeRegistrationSchema = z.object({
    name: requiredString(),
    description: requiredString(),
    field_of_activity: requiredString(),
    contact_website: requiredString(),
    cnpj: requiredString().refine(cnpjValidator, {
      message: "Digite um CNPJ válido.",
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
      cnpj: "",
      name: "",
    },
  });

  const handleLogin = async (data: CompleteRegistrationData) => {

    const creationData: ICreateCompanyProfile = {
      ...data,
      cnpj:onlyNumbers(data.cnpj),
      user_id:11
    };


    const response = await createCompanyProfile(creationData);

    if (response?.status == 201) console.log("Deu certo");
  };

  return (
    <div className="pb-5">
      <h3 className="text-primary text-[20px] font-bold mb-6">Meu perfil</h3>
      <section>
        <h4 className="text-primary text-[16px] font-bold mb-4">
          Informações Empresariais
        </h4>
        <form className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Input
            label="Nome da Empresa:"
            id="lastName"
            {...register("name")}
            placeholder="Nome da empresa"
            error={errors.name?.message}
          />
          <Controller
            control={control}
            name="cnpj"
            render={({ field }) => (
              <Input
                label="CNPJ:"
                mask=" 99.999.999/0001-99"  
                inputMode="numeric"
                id="cnpj"
                {...field}
                placeholder="Seu CNPJ"
                error={errors.cnpj?.message}
              />
            )}
          />

          <Input
            label="E-mail:"
            id="email"
            value={user?.email}
            disabled
          />
          <Input
            label="Descrição:"
            id="description"
            placeholder="Entre com a descrição"
            {...register("description")}
            error={errors.description?.message}
          />
          <Input
            label="Área de atuação:"
            id="field_of_activity"
            placeholder="Entre a área de atuação"
            {...register("field_of_activity")}
            error={errors.field_of_activity?.message}
          />
          <Input
            label="Site:"
            id="contact_website"
            placeholder="Entre com o site da empresa"
            {...register("contact_website")}
            error={errors.contact_website?.message}
          />
        </form>
        <div className="flex justify-end mt-4 ">
          <Button
            onClick={handleSubmit(handleLogin)}
            className="w-[160px] h-10 text-white bg-primary"
          >
            Salvar
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CompanyProfile;
