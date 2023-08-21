import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App';
import './index.css';

const Provider = React.lazy(() => import('./platform/Provider'));
const View1 = React.lazy(() => import('./views/View1'));
const View2 = React.lazy(() => import('./views/View2'));

const root = ReactDOM.createRoot(
   document.getElementById('root') as HTMLElement
);
root.render(
   <React.StrictMode>
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<App />}></Route>
            <Route path="/views/view1" element={<View1 />}></Route>
            <Route path="/views/view2" element={<View2 />}></Route>
            <Route path="/platform/provider" element={<Provider />}></Route>
         </Routes>
      </BrowserRouter>
   </React.StrictMode>
);