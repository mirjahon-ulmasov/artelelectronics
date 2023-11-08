import { Route, Routes, Navigate } from 'react-router-dom';
import NewsList from './list';
import EditNews from './edit';
import AddNews from './add';

export function News() {
    return (
		<Routes>
			<Route index element={<Navigate to='list' />} />
			<Route path='/list' element={<NewsList />} />
			<Route path="/add" element={<AddNews />} />
			<Route path="/:newsID/edit" element={<EditNews />} />
		</Routes>
    );
}
