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
    <div className='register-container'>
      <h2 className='register-title'>Register</h2>
      <form onSubmit={handleRegister}>
        <div className='form-group'>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            class="form-input"
          />
        </div>
        <div className='form-group'>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="form-input"
          />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="submit" className='submit-button'>Register</button>
      </form>
    </div>
  );
}
