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
  route_commands: RouteCommand[];
}

export interface RouteCommand {
  id: number;
  command: Command;
  speed: number;
  value: number;
  quantity: number;
}

export interface ApiResponse<T> {
  data: T;
  status: string;
}