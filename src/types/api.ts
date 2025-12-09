export interface Command {
  id: number;
  name: string;
  description: string;
  ros_command: string;
  status: string;
  image_url: string | null;
}

export interface Route {
  id: number;
  status: string;
  creator: number;
  creator_name: string;
  created_at: string;
  formed_at: string | null;
  approved_at: string | null;
  ended_at: string | null;
  comment: string | null;
  area: string | null;
  result: string | null;
  route_commands: RouteCommand[];
}

export interface RouteCommand {
  id: number;
  command: Command;
  command_name : string;
  speed: number;
  value: number;
  quantity: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: string;
}