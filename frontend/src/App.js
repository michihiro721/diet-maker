import React from 'react';
import Header from './components/Home/Header.jsx';
import Footer from './components/Home/Footer.jsx';
import Calender from './components/Home/Calender.jsx';
import TrainingRecord from './components/Home/training record.jsx';

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