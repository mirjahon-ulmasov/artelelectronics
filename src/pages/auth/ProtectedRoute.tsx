import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from 'hooks/redux'
import MainLayout from 'layout/Layout'
import { ROLE } from 'types/others/api'

interface PropTypes {
    roles: ROLE[]
    isRoot?: boolean
}

export function ProtectedRoute({ isRoot = false }: PropTypes) {
    const location = useLocation()
    const { isLoggedIn, user } = useAppSelector(state => state.auth)

    if (!isLoggedIn || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if(!isRoot) return <Outlet />

    return (
        <MainLayout role={ROLE.ADMIN}>
            <Outlet />
        </MainLayout>
    )
}
