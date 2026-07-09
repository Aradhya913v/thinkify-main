import React from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1>Thinkify</h1>
      
      <h2>Login</h2>
      <LoginForm />

      <h2>Register</h2>
      <RegisterForm />
    </div>
  );
}

export default App;
