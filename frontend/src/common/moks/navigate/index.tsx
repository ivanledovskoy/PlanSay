import {CalendarMonth, AlarmOn, HomeOutlined} from '@mui/icons-material';

export const navMenu = [
    {
        name: 'Главная',
        icon: <HomeOutlined />,
        path: '/',
        id: 1,
    },
    {
        name: 'Сегодня',
        icon: <AlarmOn />,
        path: '/today',
        id: 2,
    },
    {
        name: 'Календарь',
        icon: <CalendarMonth />,
        path: '/calendar',
        id: 3
    }
]