import { useState } from 'react';
import { useResource } from '../hooks/useResource';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', idNumber: '', birthDate: '',
        city: '', street: '', houseNumber: '',
        email: '', phone: '', occupation: '', additionalOccupation: '',
        spouseName: '', spouseIdNumber: '', spouseOccupation: '', password: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const { create, isLoading, error: serverError } = useResource('/auth/register');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (validationErrors[e.target.name]) setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    };

    const validateForm = () => {
        const errors = {};
        if (!/^\d{9}$/.test(formData.idNumber)) errors.idNumber = 'תעודת זהות חייבת להכיל בדיוק 9 ספרות';
        if (formData.spouseIdNumber && !/^\d{9}$/.test(formData.spouseIdNumber)) errors.spouseIdNumber = 'תעודת זהות חייבת להכיל בדיוק 9 ספרות';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'אנא הזן כתובת אימייל תקינה';
        if (!/^[\d-]{9,11}$/.test(formData.phone)) errors.phone = 'מספר טלפון אינו תקין';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setValidationErrors({});
        const errors = validateForm();
        if (Object.keys(errors).length > 0) { setValidationErrors(errors); return; }
        try {
            const response = await create(formData);
            setSuccessMessage(response.message || 'ההרשמה בוצעה בהצלחה');
        } catch (err) {
            console.error('Registration failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 16px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '520px' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>📋</div>
                    <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>הרשמה לזכאים</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>מלאו את הפרטים ונחזור אליכם בהקדם</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Field label="שם פרטי" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        <Field label="שם משפחה" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>

                    <Field label="תעודת זהות" name="idNumber" value={formData.idNumber} onChange={handleChange} required error={validationErrors.idNumber} />
                    <Field label="תאריך לידה" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required />
                    <Field label="אימייל" name="email" type="email" value={formData.email} onChange={handleChange} required error={validationErrors.email} />
                    <Field label="טלפון" name="phone" value={formData.phone} onChange={handleChange} required error={validationErrors.phone} />

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1.5fr', gap: '8px' }}>
                        <Field label="עיר" name="city" value={formData.city} onChange={handleChange} required />
                        <Field label="רחוב" name="street" value={formData.street} onChange={handleChange} required />
                        <Field label="מס' בית" name="houseNumber" value={formData.houseNumber} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">עיסוק</label>
                        <select name="occupation" value={formData.occupation} onChange={handleChange} required className="form-input">
                            <option value="" disabled>בחר עיסוק...</option>
                            <option value="אברך">אברך</option>
                            <option value="שכיר">שכיר</option>
                            <option value="עצמאי">עצמאי</option>
                            <option value="אחר">אחר</option>
                        </select>
                    </div>

                    {formData.occupation === 'אברך' && (
                        <Field label="עיסוק נוסף" name="additionalOccupation" placeholder="האם יש עיסוק נוסף? (פרט או 'לא')" value={formData.additionalOccupation} onChange={handleChange} required />
                    )}

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', marginTop: '4px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>פרטי בן/בת הזוג (אופציונלי)</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Field label="שם בן/בת הזוג" name="spouseName" value={formData.spouseName} onChange={handleChange} />
                            <Field label="מספר זהות בן/בת הזוג" name="spouseIdNumber" value={formData.spouseIdNumber} onChange={handleChange} error={validationErrors.spouseIdNumber} />
                            <Field label="עיסוק בן/בת הזוג" name="spouseOccupation" value={formData.spouseOccupation} onChange={handleChange} />
                        </div>
                    </div>

                    <Field label="סיסמה" name="password" type="password" value={formData.password} onChange={handleChange} required />

                    <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%', padding: '12px', fontSize: '16px', marginTop: '6px' }}>
                        {isLoading ? 'שולח נתונים...' : 'שלח בקשת הרשמה'}
                    </button>
                </form>

                {serverError && <p className="error-text" style={{ marginTop: '14px', textAlign: 'center' }}>{serverError}</p>}
                {successMessage && <p className="success-text" style={{ marginTop: '14px', textAlign: 'center' }}>{successMessage}</p>}
            </div>
        </div>
    );
};

const Field = ({ label, name, type = 'text', placeholder, value, onChange, required, error }) => (
    <div className="form-group">
        {label && <label className="form-label">{label}</label>}
        <input className="form-input" type={type} name={name} placeholder={placeholder || label} value={value} onChange={onChange} required={required} />
        {error && <span className="error-text">{error}</span>}
    </div>
);

export default RegisterPage;
