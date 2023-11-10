import { Route, Routes, Navigate } from 'react-router-dom';
import Collections from './list';
import AddCollection from './add';
import EditCollection from './edit';

export function Collection() {
    return (
		<Routes>
			<Route index element={<Navigate to='list' />} />
			<Route path='/list' element={<Collections />} />
			<Route path="/add" element={<AddCollection />} />
			<Route path="/:collectionID/edit" element={<EditCollection />} />
		</Routes>
    );
}
