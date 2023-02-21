import React, { FC, Suspense, useState } from 'react';
import { BrowserRouter, Route, Routes, Link, useRoutes, useNavigate, useLocation } from 'react-router-dom'
import App4A from './App4_style_a'//林找的姑娘设计的
import App4B from './App4_style_b'//林找的姑娘设计的
import App from './App1'
import App2 from './App2'
import App3 from './App3'
import App4 from './App4'
function Ui() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/1" element={<App />} />
                <Route path="/2" element={<App2 />} />
                <Route path="/3" element={<App3 />} />
                <Route path="/4" element={<App4 />} />
                <Route path="/4a" element={<App4A />} />
                <Route path="/4b" element={<App4B />} />
                <Route path="*" element={<App />} />
            </Routes>
        </BrowserRouter>
    );
}
export default Ui