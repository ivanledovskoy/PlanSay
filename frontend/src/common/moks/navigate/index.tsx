import {CalendarMonth, AlarmOn, Inbox, Logout, AccountBox, AdminPanelSettings, Telegram} from '@mui/icons-material';

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
        name: '@PlanSay_Bot',
        icon: <Telegram />,
        path: '/telegram-bot',
        id: 3,
    },
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

export const adminMenu = [
    {
        name: 'Админ-панель',
        icon: <AdminPanelSettings />,
        path: '/admin',
        id: 1,
    },
]