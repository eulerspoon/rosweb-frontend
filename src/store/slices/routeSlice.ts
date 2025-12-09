import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { routesAPI, commandsAPI, routeCommandsAPI } from '../../utils/api';

interface RouteCommand {
  id: number;
  command: any;
  speed: number;
  value: number;
  quantity: number;
}

interface Route {
  id: number;
  status: string;
  creator: number;
  creator_name: string;
  created_at: string;
  formed_at: string | null;
  route_commands: RouteCommand[];
}

interface RouteState {
  currentRoute: Route | null;
  routes: Route[];
  cartItemsCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: RouteState = {
  currentRoute: null,
  routes: [],
  cartItemsCount: 0,
  loading: false,
  error: null,
};

// Async thunks
export const getCartIcon = createAsyncThunk('route/getCartIcon', async () => {
  const response = await routesAPI.getCartIcon();
  return response.data;
});

export const getRoutes = createAsyncThunk('route/getRoutes', async () => {
  const response = await routesAPI.getRoutes();
  return response.data;
});

export const getRoute = createAsyncThunk('route/getRoute', async (id: number) => {
  const response = await routesAPI.getRoute(id);
  return response.data;
});


export const addToRoute = createAsyncThunk(
  'route/addToRoute',
  async (commandId: number, { dispatch }) => {
    try {
      // Получаем информацию о текущей корзине
      const cartResponse = await routesAPI.getCartIcon();
      
      let routeId = cartResponse.data.route_id;
      
      // Если нет черновика, создаем новый
      if (!routeId || cartResponse.data.status === 'no_draft') {
        const createResponse = await routesAPI.createRoute();
        routeId = createResponse.data.id;
      }
      
      // Добавляем команду в маршрут
      await commandsAPI.addToRoute(commandId);
      
      // Обновляем счетчик в корзине
      await dispatch(getCartIcon());
      
      return { success: true, routeId, commandId };
    } catch (error) {
      console.error('Error adding to route:', error);
      throw error;
    }
  }
);


export const updateRouteCommand = createAsyncThunk(
  'route/updateRouteCommand',
  async ({ id, data }: { id: number; data: any }) => {
    const response = await routeCommandsAPI.updateRouteCommand(id, data);
    return response.data;
  }
);

export const deleteRouteCommand = createAsyncThunk(
  'route/deleteRouteCommand',
  async (id: number) => {
    await routeCommandsAPI.deleteRouteCommand(id);
    return id;
  }
);

export const formRoute = createAsyncThunk('route/formRoute', async (id: number) => {
  const response = await routesAPI.formRoute(id);
  return response.data;
});

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    setCartItemsCount: (state, action: PayloadAction<number>) => {
      state.cartItemsCount = action.payload;
    },
    clearRouteError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartIcon.fulfilled, (state, action) => {
        state.cartItemsCount = action.payload.items_count || 0;
      })
      .addCase(getRoutes.fulfilled, (state, action) => {
        state.routes = action.payload;
      })
      .addCase(getRoute.fulfilled, (state, action) => {
        state.currentRoute = action.payload;
      })
      .addCase(addToRoute.fulfilled, (state, action) => {
        state.cartItemsCount += 1;
      });
  },
});

export const { setCartItemsCount, clearRouteError } = routeSlice.actions;
export default routeSlice.reducer;