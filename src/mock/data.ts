import { Command, Route } from '../types/api';

export const mockCommands: Command[] = [
  {
    id: 1,
    name: 'Вперед',
    description: 'Движение робота вперед на указанное расстояние',
    ros_command: 'rosservice call /move "forward"',
    status: 'active',
    image_url: null
  },
  {
    id: 2,
    name: 'Назад',
    description: 'Движение робота назад на указанное расстояние',
    ros_command: 'rosservice call /move "backward"',
    status: 'active',
    image_url: null
  },
  {
    id: 3,
    name: 'Влево',
    description: 'Поворот робота влево на указанный угол',
    ros_command: 'rosservice call /rotate "left"',
    status: 'active',
    image_url: null
  },
  {
    id: 4,
    name: 'Вправо',
    description: 'Поворот робота вправо на указанный угол',
    ros_command: 'rosservice call /rotate "right"',
    status: 'active',
    image_url: null
  },
  {
    id: 5,
    name: 'Остановка',
    description: 'Полная остановка робота',
    ros_command: 'rosservice call /stop',
    status: 'active',
    image_url: null
  },
  {
    id: 6,
    name: 'Плавное движение',
    description: 'Плавное движение с регулируемой скоростью',
    ros_command: 'rosservice call /move_smooth "forward"',
    status: 'active',
    image_url: null
  },
  {
    id: 7,
    name: 'Разворот',
    description: 'Разворот робота на 180 градусов',
    ros_command: 'rosservice call /rotate "180"',
    status: 'active',
    image_url: null
  },
  {
    id: 8,
    name: 'Зигзаг',
    description: 'Движение по зигзагообразной траектории',
    ros_command: 'rosservice call /zigzag',
    status: 'active',
    image_url: null
  }
];

export const mockRoutes: Route[] = [
  {
    id: 1,
    status: 'draft',
    creator: 1,
    creator_name: 'user1',
    created_at: '2024-01-15T10:30:00Z',
    formed_at: null,
    approved_at: null,
    ended_at: null,
    comment: null,
    area: null,
    result: null,
    route_commands: []
  },
];