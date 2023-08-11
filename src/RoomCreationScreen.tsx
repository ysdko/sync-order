// RoomCreationScreen.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Note the useNavigate import

const RoomCreationScreen: React.FC = () => {
  const navigate = useNavigate(); // Use useNavigate hook instead of useHistory
  const [roomName, setRoomName] = useState<string>('');

  const createRoom = () => {
    // Send roomName to the backend to create a new room
    // Once the room is created, navigate to the room page
    navigate(`/room/${roomName}`); // Use navigate function
  };

  return (
    <div>
      <h1>Create a Room</h1>
      <input
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Enter room name"
      />
      <button onClick={createRoom}>Create Room</button>
    </div>
  );
};

export default RoomCreationScreen;

