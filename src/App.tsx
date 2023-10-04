import { Navigate, Route, Routes } from 'react-router-dom';
import {
    Client, Car, Order, ProtectedRoute, 
    NotFound, PaymentCategoryPage, Login, DebtPage,
    CurrencyPage, Branch, Report, LogsPage, 
    NotificationsPage, Product
} from 'pages';
import { ROLE } from 'types/index';

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute isRoot={true} roles={[ROLE.ADMIN, ROLE.OPERATOR]} />}>
                <Route index element={<Navigate replace to='/order' />} />
                <Route path="product/*" element={<Product />} />
                <Route path="order/*" element={<Order />} />
                <Route path="client/*" element={<Client />} />
                <Route path="car/*" element={<Car />} />
                <Route path="currency" element={<CurrencyPage />} />
                <Route path="log" element={<LogsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="admin" element={<ProtectedRoute roles={[ROLE.ADMIN]} />}>
                    <Route path="branch/*" element={<Branch />} />
                    <Route path="report/*" element={<Report />} />
                    <Route path="debt" element={<DebtPage />} />
                    <Route path="payment-category" element={<PaymentCategoryPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

