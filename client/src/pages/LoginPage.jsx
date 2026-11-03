import { useState } from 'react';
import { useResource } from '../hooks/useResource';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const { create: loginRequest, isLoading, error } = useResource('/auth/login');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginRequest(formData);
            if (response.success) navigate('/dashboard');
        } catch (err) {
            console.error('Login failed');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '32px 16px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>💳</div>
                    <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>התחברות למערכת</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>הזינו את פרטי הכניסה שלכם</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label className="form-label">תעודת זהות או אימייל</label>
                        <input className="form-input" type="text" name="identifier" placeholder="הזינו ת.ז. או אימייל" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">סיסמה</label>
                        <input className="form-input" type="password" name="password" placeholder="הזינו סיסמה" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%', padding: '12px', fontSize: '16px', marginTop: '4px' }}>
                        {isLoading ? 'מתחבר...' : 'כניסה לחשבון'}
                    </button>
                </form>

                {error && <p className="error-text" style={{ marginTop: '14px', textAlign: 'center' }}>{error}</p>}

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
                    עדיין לא חבר?{' '}
                    <a href="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>הרשמה כאן</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
