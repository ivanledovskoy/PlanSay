import {CalendarMonth, AlarmOn, Inbox, Logout} from '@mui/icons-material';

export const navMenu = [
    {
        name: 'Входящие',
        icon: <Inbox />,
        path: '/inbox',
        id: 1,
    },
    {
        name: 'Сегодня',
        icon: <AlarmOn />,
        path: '/today',
        id: 2,
    },
    {
        name: 'Планы',
        icon: <CalendarMonth />,
        path: '/calendar',
        id: 3
    }
]

export const accountMenu = [
    {
        name: 'Выйти',
        icon: <Logout />,
        path: '/logout',
        id: 1,
    }
]