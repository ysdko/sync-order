import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode.react';
// import './RoomScreen.css'; 
interface Order {
  _id?: string;
  itemName: string;
  quantity: number;
}


const RoomScreen: React.FC = () => {
const params = useParams();
const roomName = params.roomName;
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrderName, setNewOrderName] = useState('');
  const [newOrderQuantity, setNewOrderQuantity] = useState(1);
  const [showQRCode, setShowQRCode] = useState(false);
  const toggleQRCode = () => setShowQRCode(!showQRCode);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/orders/${roomName}`)
      .then(response => {
        setOrders(response.data);
      });

    const ws = new WebSocket(`wss://${import.meta.env.VITE_BACKEND_API_HOST}/${roomName}`);

    ws.onmessage = (event: MessageEvent) => {
      const order: Order = JSON.parse(event.data);
      const existingOrderIndex = orders.findIndex(o => o._id === order._id);

      if (existingOrderIndex !== -1) {
        const updatedOrders = [...orders];
        updatedOrders[existingOrderIndex] = order;
        setOrders(updatedOrders);
      } else {
        setOrders(prev => [...prev, order]);
      }
    };      

    return () => {
      ws.close();
    };
  }, [roomName, orders]);

  const createOrder = () => {
    const newOrder: Order = {
      itemName: newOrderName,
      quantity: newOrderQuantity,
    };

    axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/orders?roomName=${roomName}`, newOrder)
      .then(() => {
        setNewOrderName('');
        setNewOrderQuantity(1);
      });
  };

  const increaseQuantity = (orderId: string, currentQuantity: number) => {
    const updatedQuantity = currentQuantity + 1;

    axios.put(`${import.meta.env.VITE_BACKEND_API_URL}/orders/${orderId}`, { quantity: updatedQuantity })
    .then(() => {});
  };

  return (
    <div>
      <button onClick={toggleQRCode}>QRコードを表示</button>  {/* 追加 */}
      
      {showQRCode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
          }}>
          <QRCode value={window.location.href} />
          <button onClick={toggleQRCode}>閉じる</button>
          </div>
        </div>
      )}
      <h1>Room: {roomName}</h1>
      {orders.map(order => (
        <div key={order._id}>
        <h2>{order.itemName}</h2>
        <p>Quantity: {order.quantity}</p>
        <button onClick={() => increaseQuantity(order._id!, order.quantity)}>Increase Quantity</button>
      </div>
      ))}
      <h2>Create a new order</h2>
      <input
        value={newOrderName}
        onChange={e => setNewOrderName(e.target.value)}
        placeholder="Item name"
      />
      <input
        type="number"
        value={newOrderQuantity}
        onChange={e => setNewOrderQuantity(Number(e.target.value))}
        placeholder="Quantity"
      />
      <button onClick={createOrder}>Create order</button>
    </div>
  );
};

export default RoomScreen;
