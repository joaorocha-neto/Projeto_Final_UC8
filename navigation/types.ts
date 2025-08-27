import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { tabRoutes } from './tabRoutes';

export type TabParamList = {
  [K in typeof tabRoutes[number]['name']]: undefined;
};

export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;
