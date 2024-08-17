import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import './index.css';

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
    <div className="login-container">
      <div className="login-card">
        <Tabs defaultValue="login" className="tabs">
          <TabsList>
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar-se</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleSubmit(handleLogin)}>
              <h1 className="title">Entrar</h1>
              <Label htmlFor="email">E-mail:</Label>
              <Input
                type="email"
                id="email"
                {...register('email')}
                placeholder="Entre com seu e-mail"
                className="input-field"
              />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
              
              <Label htmlFor="password">Senha:</Label>
              <Input
                type="password"
                id="password"
                {...register('password')}
                placeholder="Entre com sua senha"
                className="input-field"
              />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
              
              <Button type="submit" className="full-width-button">
                Entrar
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit(handleRegister)}>
              <h1 className="title">Cadastrar-se</h1>
              <Label htmlFor="email">E-mail:</Label>
              <Input
                type="email"
                id="email"
                {...registerRegisterForm('email')}
                placeholder="Entre com seu e-mail"
                className="input-field"
              />
              {registerErrors.email && <p className="error-message">{registerErrors.email.message}</p>}
              
              <Label htmlFor="password">Senha:</Label>
              <Input
                type="password"
                id="password"
                {...registerRegisterForm('password')}
                placeholder="Entre com sua senha"
                className="input-field"
              />
              {registerErrors.password && <p className="error-message">{registerErrors.password.message}</p>}
              
              <Label htmlFor="confirm-pass">Confirmar senha:</Label>
              <Input
                type="password"
                id="confirm-pass"
                {...registerRegisterForm('confirmPass')}
                placeholder="Confirme sua senha"
                className="input-field"
              />
              {registerErrors.confirmPass && <p className="error-message">{registerErrors.confirmPass.message}</p>}
              
              <Button type="submit" className="full-width-button">
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