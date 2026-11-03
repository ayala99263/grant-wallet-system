import { useState } from 'react';
import { useResource } from '../hooks/useResource';

const BusinessRequestForm = () => {
    const [businessForm, setBusinessForm] = useState({ businessName: '', businessIdentifier: '', recommendation: '' });
    const { request, isLoading } = useResource('/users');

    const handleFormChange = (e) => setBusinessForm({ ...businessForm, [e.target.name]: e.target.value });

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await request('POST', '/request-business', businessForm);
            if (response.success) {
                alert(response.message);
                setBusinessForm({ businessName: '', businessIdentifier: '', recommendation: '' });
            }
        } catch (err) {
            alert('שגיאה בשליחת הבקשה');
        }
    };

    return (
        <div className="card">
            <h3 style={{ fontSize: '17px', marginBottom: '6px' }}>💡 המלצה על עסק חדש</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>מכירים עסק שמתאים לתוכנית? שלחו לנו פרטים:</p>
            <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input className="form-input" type="text" name="businessName" placeholder="שם העסק (חובה)" value={businessForm.businessName} onChange={handleFormChange} required />
                <input className="form-input" type="text" name="businessIdentifier" placeholder="ח.פ / מזהה (אם ידוע)" value={businessForm.businessIdentifier} onChange={handleFormChange} />
                <textarea className="form-input" name="recommendation" placeholder="למה כדאי להוסיף את העסק? (חובה)" value={businessForm.recommendation} onChange={handleFormChange} required rows="3" />
                <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
                    {isLoading ? 'שולח...' : 'שלח המלצה'}
                </button>
            </form>
        </div>
    );
};

export default BusinessRequestForm;
