import { Command, Route } from '../types/api';

export const mockCommands: Command[] = [
  {
    id: 1,
    name: 'Вперед',
    description: 'Движение робота вперед',
    ros_command: 'rosservice call /move "forward"',
    status: 'active',
    image_url: '/static/images/forward.png'
  },
  {
    id: 2,
    name: 'Назад',
    description: 'Движение робота назад',
    ros_command: 'rosservice call /move "backward"',
    status: 'active',
    image_url: '/static/images/backward.png'
  },
  {
    id: 3,
    name: 'Влево',
    description: 'Поворот робота влево',
    ros_command: 'rosservice call /rotate "left"',
    status: 'active',
    image_url: null // Тестируем изображение по умолчанию
  },
  // ... больше mock команд
];

export const mockRoutes: Route[] = [
  {
    id: 1,
    status: 'formed',
    creator: 1,
    creator_name: 'user1',
    created_at: '2024-01-15T10:30:00Z',
    formed_at: '2024-01-15T10:35:00Z',
    route_commands: [/* mock команды маршрута */]
  },
  // ... больше mock маршрутов
];