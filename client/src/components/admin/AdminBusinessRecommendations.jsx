import { useState, useEffect } from 'react';
import { useResource } from '../../hooks/useResource';
import './AdminStyles.css';

const AdminBusinessRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const { request, isLoading } = useResource('/admin');

    useEffect(() => {
        const fetchRecs = async () => {
            const response = await request('GET', '/business-requests');
            if (response?.success) setRecommendations(response.data);
        };
        fetchRecs();
    }, [request]);

    return (
        <div className="admin-card">
            <h3 style={{ marginBottom: '6px' }}>המלצות משתמשים לעסקים חדשים</h3>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ממליץ (אימייל)</th>
                        <th>שם העסק </th>
                        <th>מזהה/ח.פ</th>
                        <th>סיבת ההמלצה</th>
                        <th>תאריך</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? <tr><td colSpan="5">טוען...</td></tr> : null}
                    {!isLoading && recommendations.length === 0 ? <tr><td colSpan="5">אין בקשות.</td></tr> : null}
                    {recommendations.map(rec => (
                        <tr key={rec.request_id}>
                            <td>{rec.full_name}<br/><small style={{ color: 'var(--text-muted)' }}>{rec.email}</small></td>
                            <td>{rec.business_name}</td>
                            <td>{rec.business_identifier || '-'}</td>
                            <td>{rec.recommendation}</td>
                            <td>{new Date(rec.created_at).toLocaleDateString('he-IL')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default AdminBusinessRecommendations;