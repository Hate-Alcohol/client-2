import {useQuery, useQueryClient} from '@tanstack/react-query';
import {ExampleService} from './exampleService';

const enum ExampleQueryKey {
  FetchTodos = 'fetchTodos',
}

export const useExample = () => {
  const client = useQueryClient();

  // todos 데이터를 가져오는 쿼리
  const useFetchTodosQuery = () =>
    useQuery({
      queryKey: [ExampleQueryKey.FetchTodos],
      queryFn: ExampleService.fetchTodos,
      staleTime: 1000 * 60 * 1, // 1분 동안 fresh 상태 유지
      gcTime: 1000 * 60 * 10, // 10분 동안 캐시에 유지
      // enabled: false, // 쿼리 비활성화, 컴포넌트가 마운트되거나
      // queryKey가 변경되더라도
      // queryFn이 실행되지 않음 (디폴트 true)
      // refetch를 명시적으로 호출해야 데이터를 가져올 수 있음
    });

  // 쿼리 무효화 (Invalidate)
  // 이건 특정 쿼리 Key와 연결된 데이터를 오래됨(Stale) 상태로 표시해서
  // 다음 번에 해당 데이터를 다시 요청하도록 트리거 역할을 함!
  // 캐시 자체는 삭제되지 않고, 이전 데이터를 queryClient 내부에 계속 보관함.
  // 그래서 stale 상태일 때라도 UI는 이전 데이터를 즉시 표시할 수 있음(이걸 Optimistic UI라고 함)
  // 현재, 여기의 queryKey 옵션을 "enabled: false"로 두어서
  // 이걸 실행해도 트리거가 발생하지 않음!
  const invalidateTodosQuery = () => {
    client.invalidateQueries({queryKey: [ExampleQueryKey.FetchTodos]});
  };

  // 캐시 삭제하는 함수는 client.removeQueries({queryKey: [ExampleQueryKey.FetchTodos]});

  return {
    useFetchTodosQuery,
    invalidateTodosQuery,
  };
};
