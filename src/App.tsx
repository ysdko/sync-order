import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';

interface Order {
  _id: string;
  itemName: string;
  quantity: number;
}

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrderName, setNewOrderName] = useState('');
  const [newOrderQuantity, setNewOrderQuantity] = useState(1);

  useEffect(() => {
    axios.get('http://localhost:3001/orders')
      .then(response => {
        setOrders(response.data);
      });

    const ws = new WebSocket('ws://localhost:3001');

    ws.onmessage = (event: MessageEvent) => {
      const order: Order = JSON.parse(event.data);

      setOrders(prevOrders => {
        const index = prevOrders.findIndex(o => o._id === order._id);
        if (index !== -1) {
          return prevOrders.map((o, i) => i === index ? order : o);
        } else {
          return [...prevOrders, order];
        }
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  const createOrder = (event: MouseEvent<HTMLButtonElement>) => {
    axios.post('http://localhost:3001/orders', { itemName: newOrderName, quantity: newOrderQuantity })
      .then(response => {
        setNewOrderName('');
        setNewOrderQuantity(1);
      });
  };

  const increaseQuantity = (order: Order) => {
    axios.put(`http://localhost:3001/orders/${order._id}`, { quantity: order.quantity + 1 });
  };

  return (
    <div>
      <h1>Orders</h1>
      {orders.map(order => (
        <div key={order._id}>
          <h2>{order.itemName}</h2>
          <p>Quantity: {order.quantity}</p>
          <button onClick={() => increaseQuantity(order)}>Increase quantity</button>
        </div>
      ))}
      <h2>Create a new order</h2>
      <input value={newOrderName} onChange={e => setNewOrderName(e.target.value)} placeholder="Item name" />
      <input type="number" value={newOrderQuantity} onChange={e => setNewOrderQuantity(Number(e.target.value))} placeholder="Quantity" />
      <button onClick={createOrder}>Create order</button>
    </div>
  );
};

export default App;
