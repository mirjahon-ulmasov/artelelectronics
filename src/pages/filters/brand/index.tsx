import { Route, Routes, Navigate } from 'react-router-dom';
import Brands from './list';
import AddBrand from './add';
import EditBrand from './edit';

export function Brand() {
    return (
		<Routes>
			<Route index element={<Navigate to='list' />} />
			<Route path='/list' element={<Brands />} />
			<Route path="/add" element={<AddBrand />} />
			<Route path="/:brandID/edit" element={<EditBrand />} />
		</Routes>
    );
}
