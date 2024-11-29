import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import useAuthStore from "@/stores/authStore";
import { Label } from "@/components/ui/label";
import { useModalStore } from "@/stores/modalStore";
import { FeedBackModal } from "@/components/ui/feedbackModal.";
import { loginUser, registerUser } from "@/services/auth";

const loginSchema = z.object({
  email: z.string().nonempty("O e-mail é obrigatório").email("E-mail inválido"),
  password: z.string()
  .min(1, "A senha deve ter no mínimo 8 caracteres")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número")
  .regex(
    /[@$!%*?&#]/,
    "A senha deve conter pelo menos um caractere especial"
  ),
});

const registerSchema = loginSchema
  .extend({
    confirmPass: z.string().nonempty("Confirmação de senha é obrigatória"),
    role: z.enum(["student", "company"], {
      errorMap: () => ({ message: "Selecione uma opção: aluno ou empresa" }),
    }),
  })
  .refine((data) => data.password === data.confirmPass, {
    message: "As senhas não coincidem",
    path: ["confirmPass"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const Login: React.FC = () => {
  const { openModal } = useModalStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerRegisterForm,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { saveAuthResponse } = useAuthStore();

  const handleLogin = async ({ email, password }: LoginFormData) => {
    const response = await loginUser({ email, password });
    if (!response.success) {
      openModal({
        children: <FeedBackModal title={response.error} variant={"error"} />,
      });
      return;
    }

    saveAuthResponse(response.accessToken, response.refreshToken);
  };

  const handleRegister = async (data: RegisterFormData) => {
    
      const response = await registerUser({
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if(!response.success){
        openModal({
          children: (
            <FeedBackModal
              title={response.error
              }
              variant={"error"}
            />
          ),
          contentClassName: "w-[86vw]",
        });
        return;
      }
      openModal({
        children: (
          <FeedBackModal
            title='Cadastro realizado com sucesso'
            variant={"success"}
          />
        ),
        contentClassName: "w-[86vw]",
      });
      
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-primary-800 to-primary-400 ">
      <div className="w-[86vw] max-w-[26rem] p-4 md:p-8 bg-white rounded-lg shadow-lg max-h-[40rem]">
        <Tabs defaultValue="login">
          <TabsList>
            <TabsTrigger className="" value="login">
              Entrar
            </TabsTrigger>
            <TabsTrigger className="" value="register">
              Cadastrar-se
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleSubmit(handleLogin)}>
              <h1 className="mb-6 text-2xl font-bold text-center ">Entrar</h1>
              <div className="flex flex-col gap-2">
                <Input
                  label="E-mail:"
                  type="email"
                  id="email"
                  error={errors.email?.message}
                  {...register("email")}
                  placeholder="Entre com seu e-mail"
                />

                <Input
                  label="Senha:"
                  type="password"
                  id="password"
                  error={errors.password?.message}
                  {...register("password")}
                  placeholder="Entre com sua senha"
                />

                <Button
                  type="submit"
                  className="w-full mt-2 text-white bg-primary hover:bg-gray-800"
                >
                  Entrar
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit(handleRegister)}>
              <h1 className="mb-6 text-2xl font-bold text-center ">
                Cadastrar-se
              </h1>

              <div className="flex flex-col gap-3">
                <Input
                  label="E-mail:"
                  type="email"
                  id="email"
                  error={registerErrors.email?.message}
                  {...registerRegisterForm("email")}
                  placeholder="Entre com seu e-mail"
                />

                <Input
                  label="Senha:"
                  type="password"
                  id="password"
                  error={registerErrors.password?.message}
                  {...registerRegisterForm("password")}
                  placeholder="Entre com sua senha"
                />

                <Input
                  label="Confirmar senha:"
                  type="password"
                  id="confirm-pass"
                  error={registerErrors.confirmPass?.message}
                  {...registerRegisterForm("confirmPass")}
                  placeholder="Confirme sua senha"
                />

                <div>
                  <Label className="flex items-center gap-4">
                    Você é:
                    <div className="flex items-center gap-4">
                      <Label className="flex items-center gap-0.5  ">
                        <Input
                          type="radio"
                          value="student"
                          {...registerRegisterForm("role")}
                        />
                        Aluno
                      </Label>
                      <Label className="flex items-center gap-0.5">
                        <Input
                          type="radio"
                          value="company"
                          {...registerRegisterForm("role")}
                        />
                        Empresa
                      </Label>
                    </div>
                  </Label>
                  {registerErrors.role && (
                    <p className="text-red-500 text-[12px]">
                      {registerErrors.role.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2 text-white bg-primary hover:bg-gray-800"
                >
                  Cadastrar-se
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
