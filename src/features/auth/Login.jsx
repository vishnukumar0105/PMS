import { useState } from 'react';
import { USERS } from '../../shared/constants';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (USERS[normalized]) {
      setError('');
      onLogin(normalized);
      return;
    }
    setError('Email not authorized. Please use one of the 5 allowed Information Evolution IDs.');
  };

  return (
    <div className="login-page">
      <div className="login-card card border-0 shadow">
        <div className="card-body p-4 p-md-5">
          <h1 className="h4 mb-2">PMS Login</h1>
          <p className="text-secondary mb-4">Enter your official email ID to continue.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="form-label">Email ID</label>
            <input id="email" className="form-control form-control-lg" placeholder="name@informationevolution.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {error ? <div className="text-danger small mt-2">{error}</div> : null}
            <button className="btn btn-success w-100 mt-4" type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
