import { Navigate, Route, Routes } from 'react-router-dom';
import {
    ProtectedRoute, NotFound, Login, Report, 
    Product, MainPage, Color, News, Store,
    Country, Region, District, Collection,
    Category, Brand
} from 'pages';
import { ROLE } from 'types/others/api';

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute isRoot={true} roles={[ROLE.ADMIN, ROLE.OPERATOR]} />}>
                <Route index element={<Navigate replace to='/main' />} />
                <Route path="main" element={<MainPage />} />
                <Route path="news/*" element={<News />} />
                <Route path="store/*" element={<Store />} />
                <Route path="product/*" element={<Product />} />

                {/* ---------- Filters ---------- */}
                <Route path="color/*" element={<Color />} />
                <Route path="collection/*" element={<Collection />} />
                <Route path="category/*" element={<Category />} />
                <Route path="brand/*" element={<Brand />} />

                {/* ---------- Geography ---------- */}
                <Route path="country/*" element={<Country />} />
                <Route path="region/*" element={<Region />} />
                <Route path="district/*" element={<District />} />

                <Route path="admin" element={<ProtectedRoute roles={[ROLE.ADMIN]} />}>
                    <Route path="report/*" element={<Report />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

