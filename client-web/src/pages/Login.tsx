import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {

  };

  const handleRegister = () => {
    
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
            <>
              <h1 className="title">Entrar</h1>
              <Label htmlFor="email">E-mail:</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entre com seu e-mail"
                className="input-field"
              />
              <Label htmlFor="password">Senha:</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entre com sua senha"
                className="input-field"
              />
              <Button onClick={handleLogin} className="full-width-button">
                Entrar
              </Button>
            </>
          </TabsContent>

          <TabsContent value="register">
            <>
              <h1 className="title">Cadastrar-se</h1>
              <Label htmlFor="email">E-mail:</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entre com seu e-mail"
                className="input-field"
              />
              <Label htmlFor="password">Senha:</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entre com sua senha"
                className="input-field"
              />
              <Label htmlFor="password">Confirmar senha:</Label>
              <Input
                type="password"
                id="password-confirm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Confirme sua senha"
                className="input-field"
              />
              <Button onClick={handleRegister} className="full-width-button">
                Cadastrar-se
              </Button>
            </>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;