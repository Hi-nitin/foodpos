import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { SocketProvider } from "./context/SocketContext";

ReactDOM.createRoot(document.getElementById("root")).render(

    <AuthProvider>
      <SocketProvider>
        <OrderProvider>
          <App />
        </OrderProvider>
      </SocketProvider>
    </AuthProvider>

);
