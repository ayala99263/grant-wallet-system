import { useResource } from '../hooks/useResource';

const RedeemBusinessCard = ({ business, onRedeemSuccess }) => {
    const { request, isLoading } = useResource('/coupons');
    const availableGrants = business.total_units - (business.used_units || 0);

    const handleRedeemClick = async () => {
        if (!window.confirm(`האם לממש מענק בסך ₪${business.grant_amount} מבית העסק "${business.business_name}"?\nהסכום ירד מיתרת הארנק שלך וקוד קופון יישלח אליך למייל.`)) return;

        try {
            const response = await request('POST', '/claim', {
                businessId: business.business_id,
                amount: business.grant_amount,
                businessName: business.business_name
            });
            if (response?.success) {
                alert('🎉 ' + response.message);
                if (onRedeemSuccess) onRedeemSuccess();
            }
        } catch (error) {
            alert('שגיאה: ' + (error.response?.data?.message || 'לא ניתן היה לממש את המענק כעת.'));
        }
    };

    return (
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0, transition: 'all 0.18s' }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
            <div style={{ height: '140px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {business.logo_url ? (
                    <img src={business.logo_url} alt={`לוגו של ${business.business_name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🏪</div>
                )}
            </div>

            <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '17px' }}>{business.business_name}</h3>
                <span className="badge badge-blue" style={{ marginBottom: '12px', alignSelf: 'flex-start' }}>{business.category}</span>

                <div style={{ background: 'var(--bg)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>גובה מענק: <strong style={{ color: 'var(--primary)' }}>₪{business.grant_amount}</strong></span>
                    <span style={{ fontSize: '13px', color: availableGrants > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                        {availableGrants > 0 ? `${availableGrants} זמינים` : 'אזל המלאי'}
                    </span>
                </div>

                <button
                    onClick={handleRedeemClick}
                    disabled={availableGrants <= 0 || isLoading}
                    className="btn"
                    style={{
                        marginTop: 'auto',
                        width: '100%',
                        padding: '10px',
                        fontSize: '15px',
                        background: availableGrants > 0 && !isLoading ? 'var(--primary)' : 'var(--border)',
                        color: availableGrants > 0 && !isLoading ? '#fff' : 'var(--text-muted)',
                        cursor: availableGrants <= 0 || isLoading ? 'not-allowed' : 'pointer',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)'
                    }}
                >
                    {isLoading ? 'מפיק קופון...' : availableGrants > 0 ? '💳 למימוש המענק' : 'לא נותרו מענקים'}
                </button>
            </div>
        </div>
    );
};

export default RedeemBusinessCard;
