const TransactionList = ({ transactions, isAdminView = false }) => {
    if (!transactions || transactions.length === 0) {
        return <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>אין תנועות להצגה.</p>;
    }

    const sourceMap = { website: 'אתר', pos: 'קופה', phone: 'מענה קולי', admin: 'מערכת ניהול' };

    return (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {transactions.map((tx, idx) => {
                const isLoad = tx.amount > 0;
                const formattedDate = new Date(tx.created_at).toLocaleString('he-IL', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit'
                });

                return (
                    <li key={tx.transaction_id || idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 14px',
                        background: 'var(--bg)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)'
                    }}>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-heading)', marginBottom: '4px' }}>
                                {tx.description}
                            </div>
                            {isAdminView && tx.full_name && (
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                                    👤 {tx.full_name}
                                </div>
                            )}
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
                                <span>📅 {formattedDate}</span>
                                <span>📍 {sourceMap[tx.source] || tx.source}</span>
                            </div>
                        </div>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: isLoad ? 'var(--success)' : 'var(--danger)',
                            direction: 'ltr',
                            whiteSpace: 'nowrap'
                        }}>
                            {isLoad ? '+' : ''}{parseFloat(tx.amount).toFixed(2)} ₪
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default TransactionList;
