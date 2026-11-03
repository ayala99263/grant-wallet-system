import { useState, useEffect } from 'react';
import { useResource } from '../../hooks/useResource';
import './AdminStyles.css';

const AdminAllUsers = () => {
    const [users, setUsers] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [search, setSearch] = useState('');
    const { request, isLoading } = useResource('/admin');

    useEffect(() => {
        const load = async () => {
            const response = await request('GET', '/all-users');
            if (response?.success) setUsers(response.data);
        };
        load();
    }, [request]);

    const filtered = users.filter(u =>
        `${u.first_name} ${u.last_name} ${u.id_number} ${u.email}`.includes(search)
    );

    return (
        <div className="admin-card">
            <h3>כל המשתמשים הפעילים</h3>
            <input
                type="text"
                placeholder="חיפוש לפי שם / ת.ז / אימייל..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="admin-input"
                style={{ width: '100%', marginBottom: '15px', boxSizing: 'border-box' }}
            />
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>שם מלא</th>
                        <th>ת.ז</th>
                        <th>טלפון</th>
                        <th>עיסוק</th>
                        <th>פרטים</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && filtered.length === 0 ? <tr><td colSpan="5">טוען...</td></tr> : null}
                    {!isLoading && filtered.length === 0 ? <tr><td colSpan="5">לא נמצאו משתמשים.</td></tr> : null}
                    {filtered.map(user => (
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
                            </tr>
                            {expandedId === user.user_id && (
                                <tr key={`${user.user_id}-details`}>
                                    <td colSpan="5" style={{ background: 'var(--bg)', padding: '20px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                            <DetailItem label="תאריך לידה" value={user.birth_date?.split('T')[0]} />
                                            <DetailItem label="אימייל" value={user.email} />
                                            <DetailItem label="כתובת" value={`${user.city}, ${user.street} ${user.house_number}`} />
                                            <DetailItem label="עיסוק נוסף" value={user.additional_occupation || '—'} />
                                            <DetailItem label="שם בן/בת זוג" value={user.spouse_name || '—'} />
                                            <DetailItem label="ת.ז בן/בת זוג" value={user.spouse_id_number || '—'} />
                                            <DetailItem label="עיסוק בן/בת זוג" value={user.spouse_occupation || '—'} />
                                            <DetailItem label="תאריך הצטרפות" value={new Date(user.created_at).toLocaleDateString('he-IL')} />
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

export default AdminAllUsers;
