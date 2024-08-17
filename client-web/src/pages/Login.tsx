import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Supondo que Tabs e Tab sejam fornecidos pela Shadcn

const Login: React.FC = () => {
  //const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const handleRegister = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    // Adicione lógica para cadastro
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <Tabs defaultValue="login" className="mb-6">
          <TabsList >
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar-se</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <>
              <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
              <Label htmlFor="email">Email:</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mb-4"
              />
              <Label htmlFor="password">Password:</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mb-4"
              />
              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
            </>
          </TabsContent>

          <TabsContent value="register">
            <>
              <h1 className="mb-6 text-2xl font-bold text-center">Cadastrar-se</h1>
              <Label htmlFor="email">Email:</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mb-4"
              />
              <Label htmlFor="password">Password:</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mb-4"
              />
              <Button onClick={handleRegister} className="w-full">
                Register
              </Button>
            </>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default Login;