import React, { FC, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter } from "react-router-dom";
import App from "./Routers"
ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
).render(
	<Suspense fallback={<>Loading..</>}>
		<React.StrictMode>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</React.StrictMode>
	</Suspense>
)