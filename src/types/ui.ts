import type { ComponentProps, ComponentRef } from 'react';
import type { TextInput } from 'react-native';
import type { Ionicons } from '@expo/vector-icons';

/** Valid Ionicons glyph name, checked by the compiler. */
export type IconName = ComponentProps<typeof Ionicons>['name'];

/** The object a TextInput ref points at (has focus(), blur(), ...). */
export type TextInputHandle = ComponentRef<typeof TextInput>;

export type NoticeType = 'success' | 'info' | 'error';

export interface Notice {
  /** Changes for every notice so the banner restarts its dismiss timer. */
  id: number;
  type: NoticeType;
  message: string;
}
