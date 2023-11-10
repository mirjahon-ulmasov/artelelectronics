import { Route, Routes, Navigate } from 'react-router-dom';
import Categories from './list';
import AddCategory from './add';
import EditCategory from './edit';

export function Category() {
    return (
		<Routes>
			<Route index element={<Navigate to='list' />} />
			<Route path='/list' element={<Categories />} />
			<Route path="/add" element={<AddCategory />} />
			<Route path="/:categoryID/edit" element={<EditCategory />} />
		</Routes>
    );
}
