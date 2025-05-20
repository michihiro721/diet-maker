import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Home/Header/Header';
import Footer from './components/Home/Footer/Footer';
import Calender from './components/Home/Body/Calender/Calender';
import TrainingRecord from './components/Home/Body/TrainingRecord/TrainingTable/TrainingRecord';
import Achievements from './components/Achievements/Achievements';
import GoalSetting from './components/GoalSetting/GoalSetting';
import TrainingMenu from './components/TrainingMenu/TrainingMenu';
import BodyInfo from './components/BodyInfo/BodyInfo';
import CalorieInfo from './components/CalorieInfo/CalorieInfo';
import Weight from './components/Weight/Weight';
import DietMindset from './components/DietMindset/DietMindset';
import Posts from './components/Posts/Posts';
import TrainingRecordDetail from './components/Posts/TrainingRecordDetail';
import AppUsage from './components/AppUsage/AppUsage';
import Contact from './components/Contact/Contact';
import Terms from './components/Terms/Terms';
import Privacy from './components/Privacy/Privacy';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import OAuthCallback from './components/Auth/OAuthCallback';
import Profile from './components/Profile/Profile';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import './index.css';

// トークンをチェックして、24時間以上経過している場合は強制ログアウト（セキュリティーの観点）
const TokenChecker = () => {
  const navigate = useNavigate();
  const tokenCheckPerformed = useRef(false);

  useEffect(() => {
    if (!tokenCheckPerformed.current) {
      tokenCheckPerformed.current = true;
      checkTokenExpiration();
    }
  }, [navigate]);

  const checkTokenExpiration = () => {
    const token = localStorage.getItem('jwt');

    if (!token) return;

    try {
      const payload = token.split('.')[1];
      if (!payload) {
        handleLogout();
        return;
      }

      const decoded = JSON.parse(atob(payload));

      if (decoded.iat) {
        const issuedAt = decoded.iat * 1000;
        const now = Date.now();

        const timeLimit = 86400000; // 24時間

        if (now - issuedAt > timeLimit) {
          handleLogout();
        }
      }
    } catch (e) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userId');

    alert('有効期限が切れたので、再度ログインしてください。');

    navigate('/login');
  };

  return null;
};

const AppWithTokenChecker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="app-container">
      <TokenChecker />
      <Header />
      <div className="content-container">
        <Routes>
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/goal-setting" element={<GoalSetting />} />
          <Route path="/training-menu" element={<TrainingMenu />} />
          <Route path="/body-info" element={<BodyInfo />} />
          <Route path="/calorie-info" element={<CalorieInfo />} />
          <Route path="/weight" element={<Weight />} />
          <Route path="/diet-mindset" element={<DietMindset />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/training-details/:postId" element={<TrainingRecordDetail />} />
          <Route path="/app-usage" element={<AppUsage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/" element={
            <>
              <Calender onDateSelect={handleDateSelect} />
              <TrainingRecord selectedDate={selectedDate} />
            </>
          } />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppWithTokenChecker />
    </Router>
  );
}

export default App;