import React, { FC, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, Route, Outlet, Router, BrowserRouter } from "react-router-dom";
import Pages from "./App"
ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
).render(
	<Suspense fallback={<>Loading..</>}>
		<React.StrictMode>
			<BrowserRouter>
				<Pages />
			</BrowserRouter>
		</React.StrictMode>
	</Suspense>
)