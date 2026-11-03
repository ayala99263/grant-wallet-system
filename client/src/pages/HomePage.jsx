import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="page-container">

            {/* Hero */}
            <section style={{
                textAlign: 'center',
                padding: '64px 32px',
                background: 'linear-gradient(135deg, var(--primary) 0%, #1E40AF 100%)',
                color: 'white',
                borderRadius: 'var(--radius)',
                marginBottom: '40px',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
                <h1 style={{ fontSize: '42px', color: 'white', marginBottom: '16px', fontWeight: 800 }}>
                    ברוכים הבאים לארנק המענקים
                </h1>
                <p style={{ fontSize: '20px', opacity: 0.88, marginBottom: '36px', maxWidth: '600px', margin: '0 auto 36px', lineHeight: 1.6 }}>
                    מועדון החברים שחוסך לכם כסף בדיוק במקומות שבהם אתם צריכים אותו.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/register')}
                        style={{ padding: '14px 32px', fontSize: '16px', fontWeight: 700, borderRadius: 'var(--radius-sm)', border: 'none', background: 'white', color: 'var(--primary)', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'transform 0.18s' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        הצטרפו עכשיו
                    </button>
                    <button
                        onClick={() => navigate('/user/businesses')}
                        style={{ padding: '14px 32px', fontSize: '16px', fontWeight: 700, borderRadius: 'var(--radius-sm)', border: '2px solid rgba(255,255,255,0.7)', background: 'transparent', color: 'white', cursor: 'pointer', transition: 'all 0.18s' }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                        קטלוג העסקים
                    </button>
                </div>
            </section>

            {/* How it works */}
            <section style={{ marginBottom: '48px' }}>
                <h2 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '32px' }}>איך זה עובד?</h2>
                <p style={{ textAlign: 'center', fontSize: '16px', color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto 36px', lineHeight: 1.7 }}>
                    לכל חבר מועדון מונפק <strong style={{ color: 'var(--text)' }}>ארנק אישי</strong> הנטען ביתרת זכאות. את היתרה תוכלו לממש כהנחות ישירות אצל נותני השירות, עד לגובה המענק המוטען בארנק.
                </p>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <HowCard icon="🛒" title="ברשתות וקופות רושמות"
                        desc="הכרטיס משמש כאמצעי זיהוי פיזי. מעבירים את הכרטיס בקופה והמערכת מדווחת על גובה העסקה בזמן אמת." />
                    <HowCard icon="💻" title="בבתי עסק ללא קופה"
                        desc="נכנסים לממשק האינטרנטי, מזינים את מספר העסק וסכום המימוש – ומקבלים קוד קופון מיידי." />
                </div>
            </section>

            {/* Categories */}
            <section style={{ background: 'var(--surface)', padding: '48px 32px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <h2 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '36px' }}>
                    עוטפים אתכם בכל תחומי החיים
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <CategoryCard icon="🏠" title="דיור ובנייה" desc="קבלנים, מתווכים, יועצי משכנתאות, אדריכלות ושיפוצים." />
                    <CategoryCard icon="🛒" title="צריכה שוטפת" desc="רשתות מזון, ביגוד והנעלה, כלי בית ופאות." />
                    <CategoryCard icon="💍" title="חתונות ואירועים" desc="אולמות שמחה, קייטרינג, תזמורות, צלמים ושמלות כלה." />
                    <CategoryCard icon="⚕️" title="בריאות" desc="רפואת שיניים, שתלים ואופטיקה מתקדמת." />
                    <CategoryCard icon="📚" title="קורסים והעשרה" desc="סדנאות לכלכלת הבית, חינוך ילדים, תזונה ובריאות." />
                    <CategoryCard icon="🚗" title="רכב ונופש" desc="שירותי ליסינג, השכרת רכב, מלונות ומתחמי אירוח." />
                </div>
            </section>
        </div>
    );
};

const HowCard = ({ icon, title, desc }) => (
    <div className="card" style={{ flex: 1, minWidth: '280px', maxWidth: '440px', textAlign: 'center', borderTop: '3px solid var(--primary)' }}>
        <div style={{ width: '56px', height: '56px', background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 16px' }}>{icon}</div>
        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '14px' }}>{desc}</p>
    </div>
);

const CategoryCard = ({ icon, title, desc }) => (
    <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border)', transition: 'all 0.18s', cursor: 'default' }}
        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
        <h3 style={{ fontSize: '16px', color: 'var(--primary)', marginBottom: '8px' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5 }}>{desc}</p>
    </div>
);

export default HomePage;
