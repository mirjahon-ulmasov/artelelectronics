import { Navigate, Route, Routes } from 'react-router-dom';
import {
    ProtectedRoute, NotFound, Login, Report, 
    Product, MainPage, Color, News
} from 'pages';
import { ROLE } from 'types/index';

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute isRoot={true} roles={[ROLE.ADMIN, ROLE.OPERATOR]} />}>
                <Route index element={<Navigate replace to='/main' />} />
                <Route path="main" element={<MainPage />} />
                <Route path="color/*" element={<Color />} />
                <Route path="news/*" element={<News />} />
                <Route path="product/*" element={<Product />} />
                <Route path="admin" element={<ProtectedRoute roles={[ROLE.ADMIN]} />}>
                    <Route path="report/*" element={<Report />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

