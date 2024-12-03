import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App';
import withScript from './platform/WithScript';
import './index.css';

const Provider = React.lazy(() => import('./platform/Provider'));
const View1 = React.lazy(() => import('./views/View1'));
const View2 = React.lazy(() => import('./views/View2'));
const View3 = React.lazy(() => import('./views/View3'));
const AnywhereShim = "https://built-on-openfin.github.io/web-starter/web/v19.1.0/web-client-api/js/shim.api.bundle.js";
const View1WithScript = withScript(View1, AnywhereShim);
const View2WithScript = withScript(View2, AnywhereShim);

const root = ReactDOM.createRoot(
   document.getElementById('root') as HTMLElement
);
root.render(
   <React.StrictMode>
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<App />}></Route>
            <Route path="/views/view1" element={<View1WithScript />}></Route>
            <Route path="/views/view2" element={<View2WithScript />}></Route>
            <Route path="/views/view3" element={<View3 />}></Route>
            <Route path="/platform/provider" element={<Provider />}></Route>
         </Routes>
      </BrowserRouter>
   </React.StrictMode>
);