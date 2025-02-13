import type {StackScreenProps} from '@react-navigation/stack';
import type {Paths} from '@/src/navigation/paths';

export type RootStackParamList = {
  [Paths.Home]: undefined;
  [Paths.Example]: undefined;
  [Paths.Map]: {userId: string; role: 'host' | 'shared'; hostUserId?: string};
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;
