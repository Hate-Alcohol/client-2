import React from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Button,
} from 'react-native';
import SafeScreen from '@/src/components/global/templates/SafeScreen';
import {useExample} from '@/src/hooks/domain/example/useExample'; // 작성한 useExample 훅 사용
import {useNavigation} from '@react-navigation/native';

export default function Example() {
  const navigation = useNavigation();

  const {useFetchTodosQuery, invalidateTodosQuery} = useExample(); // useExample에서 todos 쿼리 훅 가져오기
  const {data: todos = [], isLoading, error, isFetching} = useFetchTodosQuery(); // todos 데이터를 가져오는 쿼리 실행

  if (todos) {
    console.log('data 있음ㅇㅇ');
  }

  if (isLoading || isFetching) {
    return (
      <SafeScreen>
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeScreen>
    );
  }

  if (error) {
    return (
      <SafeScreen>
        <View>
          <Text style={styles.error}>Error: {error.message}</Text>
        </View>
      </SafeScreen>
    );
  }

  if (!todos || todos.length === 0) {
    // 데이터가 없을 때 처리
    return (
      <SafeScreen>
        <View>
          <Text>No todos found.</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View>
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <Text style={styles.title}>{item.title}</Text>
          )}
          contentContainerStyle={{padding: 16}}
        />
        {/* 이 버튼을 누르면 데이터를 오래된 상태로 표시하면서 api 호출을 다시 하게 됨 */}
        <Button title="쿼리 무효화" onPress={() => invalidateTodosQuery()} />
      </View>
      <View>
        <Button title="뒤로 가기" onPress={() => navigation.goBack()} />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  todoItem: {
    marginBottom: 12,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
