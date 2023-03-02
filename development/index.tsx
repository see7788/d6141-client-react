import React, { FC, Suspense,lazy } from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter } from "react-router-dom";
const App = lazy(() => import('../mcu-spiffs/App'))
// import App from "./Routers"
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