import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>ארנק המענקים</Link>
            <Link to="/businesses" className="navbar-link">עסקים משתתפים</Link>
            <Link to="/login" className="navbar-link">התחברות זכאים</Link>
            <Link to="/register" className="navbar-link">הרשמת זכאים</Link>
            <Link to="/register-business" className="navbar-link">הרשמת עסקים</Link>
            <Link to="/admin/login" className="navbar-link">הנהלה</Link>
            <button onClick={handleLogout} className="navbar-logout">יציאה</button>
        </nav>
    );
};

export default Navbar;
