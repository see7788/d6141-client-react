import React, { FC, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import Route from "./Route"
import { Routes, BrowserRouter } from "react-router-dom";
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
         <BrowserRouter>
            <Suspense fallback={<h2>Loading..</h2>}>
                <Routes>
                    <Route />
                </Routes>
            </Suspense>
        </BrowserRouter>
    </React.StrictMode>
)