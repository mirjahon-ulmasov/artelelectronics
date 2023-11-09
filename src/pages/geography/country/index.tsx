import { Route, Routes, Navigate } from 'react-router-dom';
import CountryList from './list';
import AddCountry from './add';
import EditCountry from './edit';

export function Country() {
    return (
		<Routes>
			<Route index element={<Navigate to='list' />} />
			<Route path='/list' element={<CountryList />} />
			<Route path="/add" element={<AddCountry />} />
			<Route path="/:countryID/edit" element={<EditCountry />} />
		</Routes>
    );
}
