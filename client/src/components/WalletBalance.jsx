import TransactionList from './TransactionList';

const WalletBalance = ({ balance, transactions }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #1E40AF 100%)',
                color: 'white',
                borderRadius: 'var(--radius)',
                padding: '32px 24px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '8px'
            }}>
                <p style={{ opacity: 0.8, fontSize: '14px', fontWeight: 500, margin: 0 }}>יתרה למימוש בארנק</p>
                <div style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1 }}>₪{balance}</div>
                <p style={{ opacity: 0.7, fontSize: '13px', margin: 0 }}>זמין לשימוש</p>
            </div>

            <div className="card">
                <h3 style={{ fontSize: '16px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '2px solid var(--primary-light)' }}>
                    פעולות אחרונות בחשבון
                </h3>
                <TransactionList transactions={transactions} />
            </div>
        </div>
    );
};

export default WalletBalance;
