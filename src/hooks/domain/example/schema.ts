import {z} from 'zod';

// 이런 식으로 날라오는 데이터를 받을 거임
// {
//     "userId": 1,
//     "id": 1,
//     "title": "delectus aut autem",
//     "completed": false
//  }

// 여러 개를 받을 거니까 z.array
export const exampleSchema = z.array(
  z.object({
    // userId: z.number(), -> 얘는 필요 없음. 무시 가능
    id: z.number(),
    title: z.string(),
    completed: z.boolean(),
  }),
);

export type Example = z.infer<typeof exampleSchema>;
