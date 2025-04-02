import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import Resources from './components/Resources';
import Profile from './components/Profile/Profile';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import './index.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <Router>
      <div className="app-container" >
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
            <Route path="/resources" element={<Resources />} />
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
    </Router>
  );
}

export default App;