import { useState, useEffect } from 'react';
import { useResource } from '../../hooks/useResource';

const AdminLoadBalance = () => {
    const [loadType, setLoadType] = useState('single');
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const { request, isLoading } = useResource('/admin');

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await request('GET', '/active-users');
            if (response?.success) setUsers(response.data);
        };
        fetchUsers();
    }, [request]);

    const filteredUsers = users.filter(user =>
        `${user.first_name} ${user.last_name}`.includes(searchTerm) ||
        user.id_number.includes(searchTerm)
    );

    const handleLoadBalance = async (e) => {
        e.preventDefault();
        if (!amount || amount <= 0) { alert('יש להזין סכום תקין גדול מאפס'); return; }

        if (loadType === 'single') {
            if (!selectedUser) { alert('יש לבחור משתמש מהרשימה'); return; }
            if (!window.confirm(`האם להטעין ₪${amount} למשתמש ${selectedUser.first_name} ${selectedUser.last_name}?`)) return;
            try {
                const response = await request('POST', '/load-balance', {
                    userId: selectedUser.user_id,
                    amount: parseFloat(amount),
                    description: description || 'הטענת יתרה על ידי הנהלה'
                });
                if (response?.success) finishLoad(response.message);
            } catch (error) {
                alert('שגיאה: ' + (error.response?.data?.message || 'פעולת ההטענה נכשלה'));
            }
        } else {
            if (!window.confirm(`פעולה זו תטעין ₪${amount} לכל ${users.length} המשתמשים הפעילים. להמשיך?`)) return;
            try {
                const response = await request('POST', '/load-balance-all', {
                    amount: parseFloat(amount),
                    description: description || 'מענק הנהלה מיוחד (קולקטיבי)'
                });
                if (response?.success) finishLoad(response.message);
            } catch (error) {
                alert('שגיאה: ' + (error.response?.data?.message || 'פעולת ההטענה נכשלה'));
            }
        }
    };

    const finishLoad = (msg) => {
        alert('✅ ' + msg);
        setSelectedUser(null);
        setSearchTerm('');
        setAmount('');
        setDescription('');
    };

    return (
        <div className="admin-card" style={{ maxWidth: '520px' }}>
            <h3 style={{ marginBottom: '6px' }}>מערכת הטענת יתרות</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>הטענת מענקים למשתמש בודד או לכלל המשתמשים</p>

            {/* Tab toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--bg)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                {[{ id: 'single', label: '👤 משתמש בודד' }, { id: 'collective', label: '👥 כולם' }].map(t => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setLoadType(t.id)}
                        style={{
                            flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer',
                            fontFamily: 'var(--font)', fontSize: '14px', fontWeight: 600, transition: 'all 0.18s',
                            background: loadType === t.id ? 'var(--surface)' : 'transparent',
                            color: loadType === t.id ? 'var(--primary)' : 'var(--text-muted)',
                            boxShadow: loadType === t.id ? 'var(--shadow-sm)' : 'none'
                        }}
                    >{t.label}</button>
                ))}
            </div>

            <form onSubmit={handleLoadBalance} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {loadType === 'single' && (
                    <div style={{ position: 'relative' }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>חיפוש משתמש (שם או ת"ז)</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setSelectedUser(null); }}
                            className="admin-input"
                            style={{ width: '100%' }}
                            placeholder="הקלד לחיפוש..."
                        />
                        {searchTerm && !selectedUser && (
                            <ul style={{ position: 'absolute', top: '100%', right: 0, left: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', maxHeight: '160px', overflowY: 'auto', padding: 0, margin: '4px 0 0', listStyle: 'none', zIndex: 10, boxShadow: 'var(--shadow)' }}>
                                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                                    <li
                                        key={user.user_id}
                                        onClick={() => { setSelectedUser(user); setSearchTerm(`${user.first_name} ${user.last_name} (${user.id_number})`); }}
                                        style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', fontSize: '14px', transition: 'background 0.15s' }}
                                        onMouseOver={e => e.currentTarget.style.background = 'var(--bg)'}
                                        onMouseOut={e => e.currentTarget.style.background = 'var(--surface)'}
                                    >
                                        <strong>{user.first_name} {user.last_name}</strong> — ת"ז: {user.id_number}
                                    </li>
                                )) : (
                                    <li style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: '14px' }}>לא נמצאו משתמשים</li>
                                )}
                            </ul>
                        )}
                    </div>
                )}

                {loadType === 'collective' && (
                    <div style={{ background: 'var(--primary-light)', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '14px', color: 'var(--primary)' }}>
                        ⚠️ פעולה זו תעניק את הסכום לכל <strong>{users.length}</strong> המשתמשים הפעילים במערכת.
                    </div>
                )}

                <div>
                    <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>סכום להטענה (₪)</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="1" className="admin-input" style={{ width: '100%' }} placeholder="לדוגמה: 500" />
                </div>

                <div>
                    <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>תיאור (יופיע ביומן)</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="admin-input" style={{ width: '100%' }} placeholder={loadType === 'single' ? 'לדוגמה: מענק הצטיינות' : 'לדוגמה: מענק חג מיוחד'} />
                </div>

                <button
                    type="submit"
                    disabled={isLoading || (loadType === 'single' && !selectedUser)}
                    className="btn-submit"
                    style={{ background: loadType === 'collective' ? '#D97706' : undefined }}
                >
                    {isLoading ? 'מבצע הטענה...' : (loadType === 'collective' ? 'בצע חלוקה קולקטיבית' : 'הטען יתרה')}
                </button>
            </form>
        </div>
    );
};

export default AdminLoadBalance;
