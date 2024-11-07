import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import useAuthStore from "@/stores/authStore";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate
import { Label } from "@/components/ui/label";
import { useModalStore } from "@/stores/modalStore";
import { FeedBackModal } from "@/components/ui/feedbackModal.";

const loginSchema = z.object({
  email: z.string().nonempty("O e-mail é obrigatório").email("E-mail inválido"),
  password: z.string(),
  // .min(1, "A senha deve ter no mínimo 8 caracteres")
  // .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
  // .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
  // .regex(/[0-9]/, "A senha deve conter pelo menos um número")
  // .regex(
  //   /[@$!%*?&#]/,
  //   "A senha deve conter pelo menos um caractere especial"
  // ),
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
  const navigate = useNavigate();
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

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL as string}auth/login`,
        {
          email: data.email,
          password: data.password,
        }
      );

      const { accessToken, refreshToken } = response.data;
      saveAuthResponse(accessToken, refreshToken);
      navigate("/vagas");
    } catch (error) {
      console.error("Erro no login:", error);
      openModal({
        children: (
          <FeedBackModal
            title={
              axios.isAxiosError(error)
                ? error.response?.data.message
                : "Erro ao abrir fazer login"
            }
            variant={"error"}
          />
        ),
      });
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL as string}auth/register`,
        {
          email: data.email,
          password: data.password,
          type: data.role,
        }
      );
    } catch (error) {
      openModal({
        children: (
          <FeedBackModal
            title={
              axios.isAxiosError(error)
                ? error.response?.data.message
                : "Erro ao abrir fazer registro"
            }
            variant={"error"}
          />
        ),
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white ">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg min-h-[28rem] max-h-[40rem]">
        <Tabs defaultValue="login" className="mb-6">
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
              <div className="flex flex-col gap-2" >
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
              
              <div className="flex flex-col gap-3" >
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
                  <Label className="flex items-center">
                    Você é:
                    <div className="flex items-center ml-4">
                      <Label className="flex items-center mr-4">
                        <Input
                          type="radio"
                          value="student"
                          {...registerRegisterForm("role")}
                        />
                        Aluno
                      </Label>
                      <Label className="flex items-center">
                        <Input
                          type="radio"
                          value="company"
                          {...registerRegisterForm("role")}
                          className="mr-2"
                        />
                        Empresa
                      </Label>
                    </div>
                  </Label>
                  {registerErrors.role && (
                    <p className="text-red-500 text-[12px]">{registerErrors.role.message}</p>
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
