import { ROLE, Route } from 'types/others/api'
import { SReportIcon } from 'components'

const routes: Route[] = [
    {
        path: '/main',
        title: 'Главная',
        icon: SReportIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/brands',
        title: 'Бренд',
        icon: SReportIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/collections',
        title: 'Коллекция',
        icon: SReportIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/categorys',
        title: 'Категория',
        icon: SReportIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/subcategorys',
        title: 'Подкатегория',
        icon: SReportIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/color',
        title: 'Цвета',
        icon: SReportIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/news',
        title: 'Новости',
        icon: SReportIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/store',
        title: 'Магазины',
        icon: SReportIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/country',
        title: 'Страна',
        icon: SReportIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/regions',
        title: 'Регион',
        icon: SReportIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/districts',
        title: 'Район',
        icon: SReportIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/admin/report',
        title: 'Отчеты',
        icon: SReportIcon,
        roles: [ROLE.ADMIN],
    }
]

export default routes
