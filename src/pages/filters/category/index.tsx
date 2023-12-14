import { Route, Routes, Navigate } from 'react-router-dom';
import Categories from './list';
import AddCategory from './add';
import EditCategory from './edit';
import CategoryType from './type';
import CategoryColor from './color';
import CategoryProperty from './property';

export function Category() {
    return (
		<Routes>
			<Route index element={<Navigate to='list' />} />
			<Route path='/list' element={<Categories />} />
			<Route path="/add" element={<AddCategory />} />
			<Route path="/:categoryID/edit" element={<EditCategory />} />
			<Route path="/:categoryID/type" element={<CategoryType />} />
			<Route path="/:categoryID/color" element={<CategoryColor />} />
			<Route path="/:categoryID/property/*" element={<CategoryProperty />} />
		</Routes>
    );
}
