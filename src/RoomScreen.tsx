import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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

  useEffect(() => {
    axios.get(`http://localhost:3001/orders/${roomName}`)
      .then(response => {
        setOrders(response.data);
      });

    const ws = new WebSocket(`ws://localhost:3001/${roomName}`);

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

    axios.post(`http://localhost:3001/orders?roomName=${roomName}`, newOrder)
      .then(() => {
        setNewOrderName('');
        setNewOrderQuantity(1);
      });
  };

  const increaseQuantity = (orderId: string, currentQuantity: number) => {
    const updatedQuantity = currentQuantity + 1;

    axios.put(`http://localhost:3001/orders/${orderId}`, { quantity: updatedQuantity })
    .then(() => {});
  };

  return (
    <div>
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
