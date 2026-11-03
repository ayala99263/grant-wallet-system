import { useState } from 'react';
import { useResource } from '../hooks/useResource';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
    const [password, setPassword] = useState('');
    const { request, isLoading, error } = useResource('/admin');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await request('POST', '/login', { password });
            if (response.success) navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login failed');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '32px 16px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '380px' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔐</div>
                    <h2 style={{ fontSize: '22px', marginBottom: '6px' }}>כניסת הנהלה</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>גישה מורשית בלבד</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label className="form-label">סיסמת מנהל</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="הזן סיסמת מנהל"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
                        {isLoading ? 'בודק הרשאות...' : 'היכנס לפאנל'}
                    </button>
                </form>

                {error && <p className="error-text" style={{ marginTop: '14px', textAlign: 'center' }}>{error}</p>}
            </div>
        </div>
    );
};

export default AdminLoginPage;
