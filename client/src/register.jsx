import { useState } from 'react';
import authService from './authService';
import './auth.css';
export default function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.register(username, password);
      onRegister(); // עדכון מצב לאחר הרישום
    } catch (error) {
      setErrorMessage('Username already exists'); // אם המשתמש כבר קיים
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        {errorMessage && <div>{errorMessage}</div>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
