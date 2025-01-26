import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  // 추가할 새로운 props가 있다면
}>;

export default function SafeScreen({ children = undefined }: Props) {
  return <SafeAreaView>{children}</SafeAreaView>;
}
