import axios from 'axios';
import {exampleSchema} from './schema';

export const ExampleService = {
  fetchTodos: async () => {
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/todos?_limit=3',
      );

      console.log('api 호출함!', response.data);

      return exampleSchema.parse(response.data);
    } catch (error) {
      // 에러 처리
      if (axios.isAxiosError(error)) {
        // Axios 에러일 경우
        throw new Error(
          error.response?.data?.message || error.message || 'todos api 에러',
        );
      } else {
        // Axios 외의 에러
        throw new Error('An unexpected error occurred');
      }
    }
  },
};
