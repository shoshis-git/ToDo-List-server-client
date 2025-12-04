
import { useState } from 'react';
import Login from './login';
import Register from './register';
import Tasks from './tasks'; // אם אתה רוצה להציג משימות אחרי התחברות
import './auth.css';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true); // אם התחבר בהצלחה, עדכון המצב
  };

  const handleRegister = () => {
    setIsRegistering(false); // אחרי רישום, מעבירים את המשתמש לדף ההתחברות
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // אם רוצים לבצע יציאה, מסלקים את ה-token
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <Tasks /> {/* רכיב המשימות */}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : isRegistering ? (
        <Register onRegister={handleRegister} /> // אם אנחנו במצב רישום
      ) : (
        <Login onLogin={handleLogin} /> // אם אנחנו במצב התחברות
      )}
      {!isRegistering && !isLoggedIn && (
        <button onClick={() => setIsRegistering(true)}>Don't have an account? Register</button>
      )}
    </div>
  );
}

export default App;
