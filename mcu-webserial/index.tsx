import React, { FC, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, Route, Outlet, Router, BrowserRouter } from "react-router-dom";
import App from "d6141-lib-react-usewebserial/demo/App"
ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
).render(
		<React.StrictMode>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</React.StrictMode>
)