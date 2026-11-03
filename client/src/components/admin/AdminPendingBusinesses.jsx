import { useState, useEffect } from 'react';
import { useResource } from '../../hooks/useResource';
import './AdminStyles.css';

const AdminPendingBusinesses = () => {
    const [businesses, setBusinesses] = useState([]);
    const { request, isLoading } = useResource('/admin');

    useEffect(() => { loadBusinesses(); }, [request]);

    const loadBusinesses = async () => {
        const response = await request('GET', '/pending-businesses');
        if (response?.success) setBusinesses(response.data);
    };

    const handleApprove = async (businessId) => {
        if (!window.confirm('האם לאשר עסק זה להצטרף למיזם ולהפעיל את המענקים שלו?')) return;
        
        const response = await request('POST', '/approve-business', { businessId });
        if (response?.success) {
            alert('העסק אושר ומופיע כעת באתר הפומבי!');
            loadBusinesses();
        }
    };

    return (
        <div className="admin-card">
            <h3 style={{ marginBottom: '6px' }}>עסקים הממתינים לאישור</h3>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>פרטי עסק</th>
                        <th>קטגוריה</th>
                        <th>מענק מוצע</th>
                        <th>סטטוס</th>
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && businesses.length === 0 ? <tr><td colSpan="5">טוען...</td></tr> : null}
                    {!isLoading && businesses.length === 0 ? <tr><td colSpan="5">אין עסקים הממתינים לאישור.</td></tr> : null}
                    
                    {businesses.map(biz => (
                        <tr key={biz.business_id}>
                            <td>
                                <strong>{biz.business_name}</strong><br/>
                                <small style={{ color: 'var(--text-muted)' }}>ח.פ: {biz.company_id} | טלפון: {biz.phone}</small><br/>
                                <small style={{ color: 'var(--text-muted)' }}>{biz.description?.substring(0, 30)}...</small>
                            </td>
                            <td>{biz.category}</td>
                            <td>
                                <strong>₪{biz.grant_amount}</strong><br/>
                                <small>{biz.total_units} יחידות למימוש</small>
                            </td>
                            <td><span className="badge badge-blue">ממתין</span></td>
                            <td>
                                <div className="action-buttons">
                                    <button onClick={() => handleApprove(biz.business_id)} className="btn-approve">
                                        אשר עסק
                                    </button>
                                    
                                    {/* כפתור יצירת הקשר החדש */}
                                    <a href={`mailto:${biz.email}`} className="btn-contact">
                                        צור קשר
                                    </a>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPendingBusinesses;