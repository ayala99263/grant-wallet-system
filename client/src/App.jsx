import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import RegisterBusinessPage from './pages/RegisterBusinessPage';
import BusinessDirectoryPage from './pages/BusinessDirectoryPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import UserBusinessesPage from './pages/UserBusinessesPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      {/* ה-Navbar ממוקם כאן כדי שיופיע באופן קבוע בכל העמודים */}
      <Navbar />
      
      {/* עטיפת התוכן המשתנה במיכל עם ריווח */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/register-business" element={<RegisterBusinessPage />} />
          <Route path="/businesses" element={<BusinessDirectoryPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/user/businesses" element={<UserBusinessesPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;