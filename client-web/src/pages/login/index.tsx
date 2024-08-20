import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const loginSchema = z.object({
  email: z.string().nonempty('O e-mail é obrigatório').email('E-mail inválido'),
  password: z.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
    .regex(/[@$!%*?&#]/, 'A senha deve conter pelo menos um caractere especial'),
});

const registerSchema = loginSchema.extend({
  confirmPass: z.string().nonempty('Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPass, {
  message: 'As senhas não coincidem',
  path: ['confirmPass'], 
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerRegisterForm,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleLogin = (data: LoginFormData) => {
    console.log('Login data:', data);
  };

  const handleRegister = (data: RegisterFormData) => {
    console.log('Register data:', data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg min-h-[28rem] max-h-[40rem]">
        <Tabs defaultValue="login" className="mb-6">
          <TabsList>
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar-se</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleSubmit(handleLogin)}>
              <h1 className="mb-6 text-2xl font-bold text-center">Entrar</h1>
              <Label htmlFor="email">E-mail:</Label>
              <Input
                type="email"
                id="email"
                {...register('email')}
                placeholder="Entre com seu e-mail"
                className="mb-4"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              
              <Label htmlFor="password">Senha:</Label>
              <Input
                type="password"
                id="password"
                {...register('password')}
                placeholder="Entre com sua senha"
                className="mb-4"
              />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              
              <Button type="submit" className="w-full text-white bg-black hover:bg-gray-800">
                Entrar
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit(handleRegister)}>
              <h1 className="mb-6 text-2xl font-bold text-center">Cadastrar-se</h1>
              <Label htmlFor="email">E-mail:</Label>
              <Input
                type="email"
                id="email"
                {...registerRegisterForm('email')}
                placeholder="Entre com seu e-mail"
                className="mb-4"
              />
              {registerErrors.email && <p className="text-red-500">{registerErrors.email.message}</p>}
              
              <Label htmlFor="password">Senha:</Label>
              <Input
                type="password"
                id="password"
                {...registerRegisterForm('password')}
                placeholder="Entre com sua senha"
                className="mb-4"
              />
              {registerErrors.password && <p className="text-red-500">{registerErrors.password.message}</p>}
              
              <Label htmlFor="confirm-pass">Confirmar senha:</Label>
              <Input
                type="password"
                id="confirm-pass"
                {...registerRegisterForm('confirmPass')}
                placeholder="Confirme sua senha"
                className="mb-4"
              />
              {registerErrors.confirmPass && <p className="text-red-500">{registerErrors.confirmPass.message}</p>}
              
              <Button type="submit" className="w-full text-white bg-black hover:bg-gray-800">
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