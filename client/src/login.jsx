import { useState } from 'react';
import authService from './authService'; // הפונקציות של התחברות ורישום
import './auth.css';
export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login(username, password);
      localStorage.setItem('token', data.token); // שומרים את ה-token אם הוא נשלח
      onLogin(); // פונקציה שנשלחת מאת האפליקציה הראשית (למשל לעדכן את מצב ההתחברות)
    } catch (error) {
      setErrorMessage('Invalid username or password'); // אם יש שגיאה
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
