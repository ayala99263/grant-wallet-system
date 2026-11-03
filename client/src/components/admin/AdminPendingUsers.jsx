import { useState, useEffect } from 'react';
import { useResource } from '../../hooks/useResource';
import './AdminStyles.css';

const AdminPendingUsers = () => {
    const [users, setUsers] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const { request, isLoading } = useResource('/admin');

    useEffect(() => { loadUsers(); }, [request]);

    const loadUsers = async () => {
        const response = await request('GET', '/pending-users');
        if (response?.success) setUsers(response.data);
    };

    const handleApprove = async (userId, firstName, lastName) => {
        const amount = prompt(`הכנס סכום מענק ראשוני עבור ${firstName} ${lastName} (בשקלים):`, '500');
        if (!amount || isNaN(amount)) return;

        const response = await request('POST', '/approve-user', { userId, initialAmount: parseFloat(amount) });
        if (response?.success) {
            alert('המשתמש אושר ותוקצב בהצלחה!');
            loadUsers();
        }
    };

    return (
        <div className="admin-card">
            <h3>זכאים הממתינים לאישור</h3>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>שם מלא</th>
                        <th>ת.ז</th>
                        <th>טלפון</th>
                        <th>עיסוק</th>
                        <th>פרטים</th>
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && users.length === 0 ? <tr><td colSpan="6">טוען...</td></tr> : null}
                    {!isLoading && users.length === 0 ? <tr><td colSpan="6">אין ממתינים.</td></tr> : null}
                    {users.map(user => (
                        <>
                            <tr key={user.user_id}>
                                <td>{user.first_name} {user.last_name}</td>
                                <td>{user.id_number}</td>
                                <td>{user.phone}</td>
                                <td>{user.occupation}</td>
                                <td>
                                    <button
                                        onClick={() => setExpandedId(expandedId === user.user_id ? null : user.user_id)}
                                        className="btn-ghost btn"
                                        style={{ fontSize: '13px', padding: '5px 12px' }}
                                    >
                                        {expandedId === user.user_id ? '▲ סגור' : '▼ פרטים'}
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => handleApprove(user.user_id, user.first_name, user.last_name)} className="btn-approve">אשר ותקצב</button>
                                </td>
                            </tr>
                            {expandedId === user.user_id && (
                                <tr key={`${user.user_id}-details`}>
                                    <td colSpan="6" style={{ background: 'var(--bg)', padding: '20px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                            <DetailItem label="תאריך לידה" value={user.birth_date?.split('T')[0]} />
                                            <DetailItem label="אימייל" value={user.email} />
                                            <DetailItem label="כתובת" value={`${user.city}, ${user.street} ${user.house_number}`} />
                                            <DetailItem label="עיסוק נוסף" value={user.additional_occupation || '—'} />
                                            <DetailItem label="שם בן/בת זוג" value={user.spouse_name || '—'} />
                                            <DetailItem label="ת.ז בן/בת זוג" value={user.spouse_id_number || '—'} />
                                            <DetailItem label="עיסוק בן/בת זוג" value={user.spouse_occupation || '—'} />
                                            <DetailItem label="תאריך הרשמה" value={new Date(user.created_at).toLocaleDateString('he-IL')} />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const DetailItem = ({ label, value }) => (
    <div>
        <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '12px' }}>{label}: </span>
        <span style={{ color: 'var(--text-heading)', fontSize: '13px' }}>{value}</span>
    </div>
);

export default AdminPendingUsers;
