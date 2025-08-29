import HomeScreen from '../screens/HomeScreen';
import RoomsScreen from '../screens/RoomsScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type TabRoute = {
  name: string;
  component: React.ComponentType<any>;
  label: string;
};

export const tabRoutes: TabRoute[] = [
  { name: 'Home', component: HomeScreen, label: 'Início' },
  { name: 'Rooms', component: RoomsScreen, label: 'Salas' },
  { name: 'Settings', component: SettingsScreen, label: 'Perfil' },
];