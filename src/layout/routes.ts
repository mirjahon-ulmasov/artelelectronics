import { ROLE, Route } from 'types/index'
import {
    SCarIcon, SClientIcon, SOrderIcon,
} from 'components'

const routes: Route[] = [
    {
        path: '/order',
        title: 'Buyurtmalar',
        icon: SOrderIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/client',
        title: 'Mijozlar',
        icon: SClientIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    },
    {
        path: '/car',
        title: 'Avtomobillar',
        icon: SCarIcon,
        roles: [ROLE.ADMIN, ROLE.OPERATOR],
    }
]

export default routes
