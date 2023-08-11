import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RoomCreationScreen from './RoomCreationScreen';
import RoomScreen from './RoomScreen';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoomCreationScreen />} />
        <Route path="/room/:roomName" element={<RoomScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
