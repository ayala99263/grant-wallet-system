import { useState, useEffect } from 'react';
import { useResource } from '../../hooks/useResource';
import TransactionList from '../TransactionList'; // ייבוא הקומפוננטה המשותפת

const AdminRecentTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const { request, isLoading } = useResource('/admin');

    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await request('GET', '/transactions');
            if (response?.success) setTransactions(response.data);
        };
        fetchTransactions();
    }, [request]);

    return (
        <div className="admin-card">
            <h3 style={{ marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid var(--primary-light)' }}>
                📊 יומן סליקות ותנועות מערכת (Ledger)
            </h3>
            
            {isLoading ? (
                <p>טוען נתונים...</p>
            ) : (
                <TransactionList transactions={transactions} isAdminView={true} />
            )}
        </div>
    );
};

export default AdminRecentTransactions;