import { useState } from 'react';
import { useResource } from '../hooks/useResource';
import { useNavigate } from 'react-router-dom';

const RegisterBusinessPage = () => {
    const [formData, setFormData] = useState({
        businessName: '', companyId: '', email: '', password: '',
        phone: '', websiteUrl: '', logoUrl: '', category: 'מזון', description: '',
        grantAmount: '', grantUnits: ''
    });
    const { request, isLoading } = useResource('/businesses');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // השרת צריך להיות מוכן לקבל את כל האובייקט הזה
            const response = await request('POST', '/register', formData);
            if (response.success) {
                alert('בקשת ההצטרפות נשלחה בהצלחה! מנהל המערכת יאשר אותה בקרוב.');
                navigate('/');
            }
        } catch (err) {
            alert('שגיאה בהרשמה: ' + err);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 16px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '560px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>🏢</div>
                    <h2 style={{ fontSize: '22px', marginBottom: '6px' }}>בקשת הצטרפות לעסק חדש</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>הצטרפו למיזם המענקים והציעו הטבות למשתמשים.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>פרטי העסק</p>
                    <input type="text" name="businessName" placeholder="שם העסק" required onChange={handleChange} className="form-input" />
                    <input type="text" name="companyId" placeholder="ח.פ. / עוסק מורשה" required onChange={handleChange} className="form-input" />
                    <input type="email" name="email" placeholder="אימייל להתחברות" required onChange={handleChange} className="form-input" />
                    <input type="password" name="password" placeholder="סיסמה" required onChange={handleChange} className="form-input" />
                    <input type="text" name="phone" placeholder="טלפון ליצירת קשר" required onChange={handleChange} className="form-input" />
                    <input type="url" name="websiteUrl" placeholder="קישור לאתר (אופציונלי)" onChange={handleChange} className="form-input" />
                    <input type="url" name="logoUrl" placeholder="קישור לתמונת לוגו (URL) - אופציונלי" onChange={handleChange} className="form-input" />

                    <select name="category" value={formData.category} onChange={handleChange} className="form-input">
                        <option value="בניה">בניה</option>
                        <option value="מזון">מזון</option>
                        <option value="ביגוד">ביגוד</option>
                        <option value="אלקטרוניקה">אלקטרוניקה</option>
                        <option value="שירותים">שירותים</option>
                        <option value="אחר">אחר</option>
                    </select>

                    <textarea name="description" placeholder="תיאור קצר של העסק" onChange={handleChange} className="form-input" rows="3" />

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>פרטי המענק</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <input type="number" name="grantAmount" placeholder="גובה מענק למשתמש (₪)" required onChange={handleChange} className="form-input" />
                            <input type="number" name="grantUnits" placeholder="כמות מענקים (יחידות)" required onChange={handleChange} className="form-input" />
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '16px', marginTop: '6px' }}>
                        {isLoading ? 'שולח...' : 'שלח בקשת הצטרפות'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterBusinessPage;