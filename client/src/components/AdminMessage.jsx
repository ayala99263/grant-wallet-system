const AdminMessage = ({ title, content }) => {
    return (
        <div style={{ marginBottom: '12px', padding: '12px 14px', background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', borderRight: '3px solid var(--primary)' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--primary)' }}>{title}</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text)' }}>{content}</p>
        </div>
    );
};

export default AdminMessage;
