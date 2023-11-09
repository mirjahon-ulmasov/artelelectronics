import { Route, Routes, Navigate } from 'react-router-dom';
import Regions from './list';
import AddRegion from './add';
import EditRegion from './edit';

export function Region() {
    return (
		<Routes>
			<Route index element={<Navigate to='list' />} />
			<Route path='/list' element={<Regions />} />
			<Route path="/add" element={<AddRegion />} />
			<Route path="/:regionID/edit" element={<EditRegion />} />
		</Routes>
    );
}
