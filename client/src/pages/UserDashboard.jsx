import { useState, useEffect } from 'react';
import { useResource } from '../hooks/useResource';
import { useNavigate } from 'react-router-dom';
import WalletBalance from '../components/WalletBalance';
import AdminMessage from '../components/AdminMessage';
import BusinessRequestForm from '../components/BusinessRequestForm';

const UserDashboard = () => {
    const [dashboardData, setDashboardData] = useState({ balance: 0, messages: [], transactions: [] });
    const { request, isLoading } = useResource('/users');
    const navigate = useNavigate();

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const response = await request('GET', '/dashboard');
                if (response.success) setDashboardData(response.data);
            } catch (err) {
                navigate('/login');
            }
        };
        loadDashboard();
    }, [navigate, request]);

    if (isLoading && dashboardData.balance === 0) return (
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>טוען נתונים אישיים...</div>
    );

    return (
        <div className="page-container" style={{ display: 'grid', gap: '24px' }}>

            <WalletBalance balance={dashboardData.balance} transactions={dashboardData.transactions} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="card">
                    <h3 style={{ fontSize: '17px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid var(--primary-light)' }}>
                        📬 הודעות מההנהלה
                    </h3>
                    {dashboardData.messages.length === 0
                        ? <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>אין הודעות חדשות.</p>
                        : dashboardData.messages.map((msg, i) => <AdminMessage key={i} title={msg.title} content={msg.content} />)
                    }
                </div>
                <BusinessRequestForm />
            </div>

            <div style={{ textAlign: 'center' }}>
                <button
                    onClick={() => navigate('/user/businesses')}
                    className="btn btn-primary"
                    style={{ padding: '14px 36px', fontSize: '17px' }}
                >
                    💳 לצפייה בקטלוג העסקים ומימוש מענקים
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;
