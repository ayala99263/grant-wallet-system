import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResource } from '../hooks/useResource';

import AdminPendingUsers from '../components/admin/AdminPendingUsers';
import AdminPendingBusinesses from '../components/admin/AdminPendingBusinesses';
import AdminSendMessage from '../components/admin/AdminSendMessage';
import AdminBusinessRecommendations from '../components/admin/AdminBusinessRecommendations';
import AdminRecentTransactions from '../components/admin/AdminRecentTransactions';
import AdminLoadBalance from '../components/admin/AdminLoadBalance';
import AdminAllUsers from '../components/admin/AdminAllUsers';

const TABS = [
    { id: 'pending_users',        label: '⏳ זכאים ממתינים' },
    { id: 'pending_businesses',   label: '🏪 עסקים ממתינים' },
    { id: 'business_recs',        label: '💡 המלצות משתמשים' },
    { id: 'send_message',         label: '📢 שליחת הודעה גורפת' },
    { id: 'recent_transactions',  label: '📊 יומן סליקות' },
    { id: 'load_balance',         label: '💰 הטענת יתרה ידנית' },
    { id: 'all_users',            label: '👥 כל המשתמשים' },
];

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('pending_users');
    const { request } = useResource('/admin');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await request('GET', '/pending-users');
            } catch (err) {
                navigate('/admin/login');
            }
        };
        checkAuth();
    }, [navigate, request]);

    const renderContent = () => {
        switch (activeTab) {
            case 'pending_users':       return <AdminPendingUsers />;
            case 'pending_businesses':  return <AdminPendingBusinesses />;
            case 'send_message':        return <AdminSendMessage />;
            case 'business_recs':       return <AdminBusinessRecommendations />;
            case 'recent_transactions': return <AdminRecentTransactions />;
            case 'load_balance':        return <AdminLoadBalance />;
            case 'all_users':           return <AdminAllUsers />;
            default:                    return <AdminPendingUsers />;
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', direction: 'rtl' }}>

            {/* Sidebar */}
            <aside style={{
                width: '240px',
                flexShrink: 0,
                background: 'var(--primary)',
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
            }}>
                <div style={{ color: 'white', fontWeight: 800, fontSize: '17px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                    🛡️ לוח בקרה
                </div>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '10px 14px',
                            background: activeTab === tab.id ? 'rgba(255,255,255,0.18)' : 'transparent',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            textAlign: 'right',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: activeTab === tab.id ? 700 : 400,
                            fontFamily: 'var(--font)',
                            transition: 'background 0.18s',
                            borderRight: activeTab === tab.id ? '3px solid white' : '3px solid transparent'
                        }}
                        onMouseOver={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                        onMouseOut={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent'; }}
                    >
                        {tab.label}
                    </button>
                ))}
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, padding: '28px', background: 'var(--bg)', overflowY: 'auto' }}>
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;
