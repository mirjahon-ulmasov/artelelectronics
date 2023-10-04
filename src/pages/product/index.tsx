import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Products from './list';
import AddProduct from './add';
import EditProduct from './edit';

export function Product() {
    const { search } = useLocation()

    return (
		<Routes>
			<Route index element={<Navigate to={`list${search}`} />} />
			<Route path='/list' element={<Products />} />
			<Route path="/add" element={<AddProduct />} />
			<Route path="/:productID/edit" element={<EditProduct />} />
		</Routes>
    );
}
