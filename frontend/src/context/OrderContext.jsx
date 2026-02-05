import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const addOrder = (order) => {
    setOrders(prev => [...prev, order]);
  };

  const removeOrder = (id) => {
    setOrders(prev => prev.filter(o => o._id !== id));
  };

  const updateOrders = (newOrders) => {
    setOrders(newOrders);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, removeOrder, updateOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
