import {CalendarMonth, AlarmOn, Inbox, Logout, AccountBox} from '@mui/icons-material';

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
        name: 'Аккаунт',
        icon: <AccountBox />,
        path: '/account',
        id: 2,
    },
    {
        name: 'Выйти',
        icon: <Logout />,
        path: '/logout',
        id: 1,
    }
]