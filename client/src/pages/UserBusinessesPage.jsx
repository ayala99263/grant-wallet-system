import { useState, useEffect, useCallback } from 'react';
import { useResource } from '../hooks/useResource';
import { useNavigate } from 'react-router-dom';
import RedeemBusinessCard from '../components/RedeemBusinessCard';

const UserBusinessesPage = () => {
    const [businesses, setBusinesses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('הכל');
    
    // אני מניח שבהוק שלך ה-URL הבסיסי הוא ריק או שאת משתמשת בכתובת המלאה
    const { request, isLoading } = useResource('');
    const navigate = useNavigate();

    // 1. הוצאנו את הפונקציה החוצה ועטפנו אותה ב-useCallback
    const fetchBusinesses = useCallback(async () => {
        const response = await request('GET', '/businesses/public');
        if (response?.success) {
            setBusinesses(response.data);
        }
    }, [request]);

    // 2. ה-useEffect עכשיו רק קורא לפונקציה מבחוץ
    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);

    const categories = ['הכל', 'בניה', 'מזון', 'ביגוד', 'אלקטרוניקה', 'שירותים', 'אחר'];
    
    const filteredBusinesses = selectedCategory === 'הכל'
        ? businesses
        : businesses.filter(biz => biz.category === selectedCategory);

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <h2 style={{ margin: 0 }}>קטלוג עסקים ומענקים</h2>
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="btn btn-outline"
                    style={{ fontSize: '14px' }}
                >
                    ← חזרה לאזור האישי
                </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
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

            {isLoading && businesses.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>טוען עסקים...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {filteredBusinesses.length > 0 ? (
                        filteredBusinesses.map(biz => (
                            <RedeemBusinessCard 
                                key={biz.business_id} 
                                business={biz} 
                                onRedeemSuccess={fetchBusinesses} 
                            />
                        ))
                    ) : (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>
                            לא נמצאו עסקים בקטגוריה "{selectedCategory}".
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserBusinessesPage;