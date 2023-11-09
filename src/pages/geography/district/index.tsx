import { Route, Routes, Navigate } from 'react-router-dom';
import Districts from './list';
import AddDistrict from './add';
import EditDistrict from './edit';

export function District() {
    return (
		<Routes>
			<Route index element={<Navigate to='list' />} />
			<Route path='/list' element={<Districts />} />
			<Route path="/add" element={<AddDistrict />} />
			<Route path="/:districtID/edit" element={<EditDistrict />} />
		</Routes>
    );
}
