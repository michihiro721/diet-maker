import React from 'react';
import Header from './components/Home/Header/Header.jsx';
import Footer from './components/Home/Footer/Footer.jsx';
import Calender from './components/Home/Body/Calender/Calender.jsx';
import TrainingRecord from './components/Home/Body/TrainingRecord/TrainingRecord.jsx';

function App() {
  return (
    <div>
      <Header />
      <Calender />
      <TrainingRecord />
      <Footer />
    </div>
  );
}

export default App;