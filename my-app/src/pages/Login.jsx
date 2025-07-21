import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_KEY, BASE_URL } from '../api';
import '../App.css'; // Import CSS file

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 1. Get request token
      const res1 = await fetch(`${BASE_URL}/authentication/token/new?api_key=${API_KEY}`);
      const { request_token } = await res1.json();

      // 2. Validate login
      await fetch(`${BASE_URL}/authentication/token/validate_with_login?api_key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, request_token }),
      });

      // 3. Create session
      const res3 = await fetch(`${BASE_URL}/authentication/session/new?api_key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_token }),
      });

      const { session_id } = await res3.json();

      // Lưu vào localStorage
      localStorage.setItem('session_id', session_id);

      navigate('/'); // điều hướng về trang chủ
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
      console.error(err);
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h2>Đăng nhập</h2>
      {error && <div className="error-message">{error}</div>}
      <input 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Username" 
      />
      <input 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
        type="password" 
      />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}

export default LoginPage;