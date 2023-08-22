// RoomCreationScreen.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Note the useNavigate import

import { v4 as uuidv4 } from 'uuid';  // uuidパッケージからv4関数をインポート

const RoomCreationScreen: React.FC = () => {
  const navigate = useNavigate();

  const createRoom = () => {
    const roomUUID = uuidv4();  // UUIDを生成

    // UUIDをバックエンドに送信して新しい部屋を作成するロジック（省略）

    navigate(`/room/${roomUUID}`);  // UUIDを用いて部屋に遷移
  };

  return (
    <div>
      <h1>Create a Room</h1>
      <button onClick={createRoom}>Create Room</button>
    </div>
  );
};

export default RoomCreationScreen;
