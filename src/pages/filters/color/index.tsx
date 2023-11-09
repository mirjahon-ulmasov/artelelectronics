import { Route, Routes, Navigate } from 'react-router-dom';
import Colors from './list';
import AddColor from './add';
import EditColor from './edit';

export function Color() {
    return (
		<Routes>
			<Route index element={<Navigate to='list' />} />
			<Route path='/list' element={<Colors />} />
			<Route path="/add" element={<AddColor />} />
			<Route path="/:colorID/edit" element={<EditColor />} />
		</Routes>
    );
}
