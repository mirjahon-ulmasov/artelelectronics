import { ROLE, Route } from 'types/index'
import { SReportIcon } from 'components'

const routes: Route[] = [
    {
        path: '/main',
        title: 'Главная',
        icon: SReportIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/admin/report',
        title: 'Отчеты',
        icon: SReportIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    }
]

export default routes
