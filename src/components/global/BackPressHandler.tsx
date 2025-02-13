import React, {useEffect} from 'react';
import {Alert, BackHandler, Platform} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

type BackPressHandlerProps = {
  onBackPress: () => void;
};

const BackPressHandler: React.FC<BackPressHandlerProps> = ({onBackPress}) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backAction = () => {
        onBackPress(); // ✅ 전달받은 함수 실행
        return true; // 기본 동작 방지
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPressHandler = () => {
        onBackPress();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPressHandler);

      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackPressHandler,
        );
      };
    }, []),
  );

  return null; // UI가 필요 없는 로직만 있는 컴포넌트
};

export default BackPressHandler;
