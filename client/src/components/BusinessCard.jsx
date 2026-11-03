const BusinessCard = ({ business }) => {
    return (
        <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0, transition: 'all 0.18s', cursor: 'default' }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
            <div style={{ height: '160px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {business.logo_url ? (
                    <img src={business.logo_url} alt={`לוגו של ${business.business_name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🏪</div>
                )}
            </div>

            <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '17px' }}>{business.business_name}</h3>
                <span className="badge badge-blue" style={{ marginBottom: '10px', alignSelf: 'flex-start' }}>{business.category}</span>
                <p style={{ margin: '0 0 14px 0', color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5, flex: 1 }}>
                    {business.description || 'עסק זה טרם הזין תיאור.'}
                </p>
                {business.website_url && (
                    <a href={business.website_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '14px' }}>
                        לאתר העסק ←
                    </a>
                )}
            </div>
        </div>
    );
};

export default BusinessCard;
