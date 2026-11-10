import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Bottom tabs hold the three "overview" screens.
export type TabParamList = {
  Inventory: undefined;
  Statistics: undefined;
  Settings: undefined;
};

// One typed stack sits above the tabs. Add/Edit and Details are pushed on top of it,
// so the tab bar is hidden on them and the form never sits behind the bottom navigation.
export type RootStackParamList = {
  Home: undefined;
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  /** No equipmentId = Add mode. With an equipmentId = Edit mode. */
  EquipmentForm: { equipmentId?: string } | undefined;
  EquipmentDetails: { equipmentId: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;
