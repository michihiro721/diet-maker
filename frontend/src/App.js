import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Home/Header/Header.jsx';
import Footer from './components/Home/Footer/Footer.jsx';
import Calender from './components/Home/Body/Calender/Calender.jsx';
import TrainingRecord from './components/Home/Body/TrainingRecord/TrainingTable/TrainingRecord.jsx';
import Achievements from './components/Achievements/Achievements.jsx';
import GoalSetting from './components/GoalSetting/GoalSetting.jsx';
import TrainingMenu from './components/TrainingMenu/TrainingMenu.jsx';
import BodyInfo from './components/BodyInfo/BodyInfo.jsx';
import CalorieInfo from './components/CalorieInfo/CalorieInfo.jsx';
import Weight from './components/Weight/Weight.jsx';
import DietMindset from './components/DietMindset/DietMindset.jsx';
import Posts from './components/Posts/Posts.jsx';
import AppUsage from './components/AppUsage/AppUsage.jsx';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/goal-setting" element={<GoalSetting />} />
        <Route path="/training-menu" element={<TrainingMenu />} />
        <Route path="/body-info" element={<BodyInfo />} />
        <Route path="/calorie-info" element={<CalorieInfo />} />
        <Route path="/weight" element={<Weight />} />
        <Route path="/diet-mindset" element={<DietMindset />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/app-usage" element={<AppUsage />} />
        <Route path="/" element={
          <>
            <Calender />
            <TrainingRecord />
          </>
        } />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;