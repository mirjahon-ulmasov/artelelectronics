import { Route, Routes, Navigate, useParams } from 'react-router-dom';
import Properties from './list';
import AddProperty from './add';
import EditProperty from './edit';
import { useFetchCategoryQuery } from 'services';
import { ID } from 'types/others/api';

export default function CategoryProperty() {
	const { categoryID } = useParams()
    const { data: category } = useFetchCategoryQuery(categoryID as ID)	

    return (
		<Routes>
			<Route index element={<Navigate to='list' />} />
			<Route path='/list' element={<Properties category={category} />} />
			<Route path="/add" element={<AddProperty category={category} />} />
			<Route path="/:propertyID/edit" element={<EditProperty />} />
		</Routes>
    );
}
