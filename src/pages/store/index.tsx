import { Route, Routes, Navigate } from 'react-router-dom';
import Stores from './list';
import AddStore from './add';
import EditStore from './edit';

export function Store() {
    return (
		<Routes>
			<Route index element={<Navigate to='list' />} />
			<Route path='/list' element={<Stores />} />
			<Route path="/add" element={<AddStore />} />
			<Route path="/:colorID/edit" element={<EditStore />} />
		</Routes>
    );
}
