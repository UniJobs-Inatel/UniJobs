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

const loginSchema = z.object({
  email: z.string().nonempty("O e-mail é obrigatório").email("E-mail inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
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
  const navigate = useNavigate(); // Utilize o hook useNavigate
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

  const { setTokens } = useAuthStore();

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email: data.email,
          password: data.password,
        }
      );

      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      console.log("Login realizado com sucesso");
      navigate("/job-offers"); // Redireciona após login bem-sucedido
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/register",
        {
          email: data.email,
          password: data.password,
          type: data.role,
        }
      );

      console.log("Registro realizado com sucesso:", response.data.message);
      navigate("/profile"); // Redireciona após registro bem-sucedido
    } catch (error) {
      if (error && error.response  )
        if (axios.isAxiosError(error)) {
          console.error(
            "Erro no registro:",
            error.response?.data  || error.message
          );
        } else {
          console.error("Erro desconhecido:", error);
        }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg min-h-[28rem] max-h-[40rem]">
        <Tabs defaultValue="login" className="mb-6">
          <TabsList>
            <TabsTrigger className="text-primary" value="login">
              Entrar
            </TabsTrigger>
            <TabsTrigger className="text-primary" value="register">
              Cadastrar-se
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleSubmit(handleLogin)}>
              <h1 className="mb-6 text-2xl font-bold text-center text-primary">
                Entrar
              </h1>
              <Input
                label="E-mail:"
                type="email"
                id="email"
                {...register("email")}
                placeholder="Entre com seu e-mail"
                className="mb-4"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}

              <Label htmlFor="password">Senha:</Label>
              <Input
                label="Senha:"
                type="password"
                id="password"
                {...register("password")}
                placeholder="Entre com sua senha"
                className="mb-4"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}

              <Button
                type="submit"
                className="w-full text-white bg-black hover:bg-gray-800"
              >
                Entrar
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit(handleRegister)}>
              <h1 className="mb-6 text-2xl font-bold text-center text-primary">
                Cadastrar-se
              </h1>
              <Input
                label="E-mail:"
                type="email"
                id="email"
                {...registerRegisterForm("email")}
                placeholder="Entre com seu e-mail"
                className="mb-4"
              />
              {registerErrors.email && (
                <p className="text-red-500">{registerErrors.email.message}</p>
              )}

              <Input
                label="Senha:"
                type="password"
                id="password"
                {...registerRegisterForm("password")}
                placeholder="Entre com sua senha"
                className="mb-4"
              />
              {registerErrors.password && (
                <p className="text-red-500">
                  {registerErrors.password.message}
                </p>
              )}

              <Input
                label="Confirmar senha:"
                type="password"
                id="confirm-pass"
                {...registerRegisterForm("confirmPass")}
                placeholder="Confirme sua senha"
                className="mb-4"
              />
              {registerErrors.confirmPass && (
                <p className="text-red-500">
                  {registerErrors.confirmPass.message}
                </p>
              )}

              <Label className="flex items-center mb-4">
                Você é:
                <div className="flex items-center ml-4">
                  <Label className="flex items-center mr-4">
                    <Input
                      type="radio"
                      value="student"
                      {...registerRegisterForm("role")}
                      className="mr-2"
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
                <p className="text-red-500">{registerErrors.role.message}</p>
              )}

              <Button
                type="submit"
                className="w-full text-white bg-black hover:bg-gray-800"
              >
                Cadastrar-se
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
