import { useState, useEffect } from 'react';
import { useResource } from '../hooks/useResource';
import BusinessCard from '../components/BusinessCard'; // ודאי שהנתיב תואם למיקום הקובץ שלך

const BusinessDirectoryPage = () => {
    const [businesses, setBusinesses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('הכל');
    
    // יש להתאים את הנתיב '/active-businesses' לנתיב ה-GET שיצרת בשרת לשליפת העסקים המאושרים
    const { request, isLoading } = useResource('/businesses'); 

    useEffect(() => {
        const fetchBusinesses = async () => {
           const response = await request('GET', '/public');
           // השורה הבאה חסרה אצלך - היא זו שמזריקה את הנתונים לתצוגה
           if (response?.success) {
               setBusinesses(response.data);
           }
        };
        fetchBusinesses();
    }, [request]);

    // רשימת הקטגוריות הזמינות (תואם למה שהגדרנו ב-ENUM במסד הנתונים)
    const categories = ['הכל', 'בניה', 'מזון', 'ביגוד', 'אלקטרוניקה', 'שירותים', 'אחר'];

    // סינון העסקים: אם נבחרה "הכל" נציג את כל המערך, אחרת נסנן לפי הקטגוריה
    const filteredBusinesses = selectedCategory === 'הכל' 
        ? businesses 
        : businesses.filter(biz => biz.category === selectedCategory);

    return (
        <div className="page-container">
            <h2 style={{ textAlign: 'center', marginBottom: '28px' }}>אינדקס העסקים</h2>
            
            {/* סרגל בחירת קטגוריות */}
            <div style={{ 
                display: 'flex', 
                gap: '8px', 
                flexWrap: 'wrap', 
                marginBottom: '28px',
                justifyContent: 'center'
            }}>
                {categories.map(category => (
                    <button 
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        style={{
                            padding: '7px 18px',
                            borderRadius: '20px',
                            border: '2px solid var(--primary)',
                            background: selectedCategory === category ? 'var(--primary)' : 'transparent',
                            color: selectedCategory === category ? '#fff' : 'var(--primary)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 600,
                            fontFamily: 'var(--font)',
                            transition: 'all 0.18s'
                        }}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* תצוגת כרטיסיות העסקים המסוננים */}
            {isLoading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>טוען עסקים...</p>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: '20px' 
                }}>
                    {filteredBusinesses.length > 0 ? (
                        filteredBusinesses.map(biz => (
                            <BusinessCard key={biz.business_id} business={biz} />
                        ))
                    ) : (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', fontSize: '16px' }}>
                            לא נמצאו עסקים בקטגוריה "{selectedCategory}" כרגע.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default BusinessDirectoryPage;