import React from 'react'
import { Routes, Route } from "react-router-dom";
export default  ()=>(
	<Routes>
		<Route path="1" element={<>1</>} />
		<Route path='*' element={<>index</>} />
	</Routes>
)