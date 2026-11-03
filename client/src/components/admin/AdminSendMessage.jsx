import { useState } from 'react';
import { useResource } from '../../hooks/useResource';
import './AdminStyles.css';

const AdminSendMessage = () => {
    const [message, setMessage] = useState({ title: '', content: '' });
    const { request, isLoading } = useResource('/admin');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await request('POST', '/messages', message);
        if (response?.success) {
            alert('ההודעה נשלחה בהצלחה!');
            setMessage({ title: '', content: '' });
        }
    };

    return (
        <div className="admin-card" style={{ maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '6px' }}>הודעה חדשה למשתמשים</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px' }}>הודעה זו תופיע באזור האישי של כל הזכאים במערכת.</p>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" 
                    placeholder="נושא ההודעה" 
                    value={message.title}
                    onChange={(e) => setMessage({...message, title: e.target.value})}
                    required 
                    className="admin-input"
                />
                <textarea 
                    placeholder="תוכן ההודעה..." 
                    value={message.content}
                    onChange={(e) => setMessage({...message, content: e.target.value})}
                    required 
                    rows="6"
                    className="admin-input"
                />
                <button type="submit" disabled={isLoading} className="btn-submit">
                    {isLoading ? 'שולח...' : 'שגר הודעה לכלל המערכת'}
                </button>
            </form>
        </div>
    );
};
export default AdminSendMessage;
