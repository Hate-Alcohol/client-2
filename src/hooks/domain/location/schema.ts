import {z} from 'zod';

export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90), // 위도 범위: -90 ~ 90
  longitude: z.number().min(-180).max(180), // 경도 범위: -180 ~ 180
  timestamp: z.number().positive(), // 유효한 타임스탬프 (밀리초 기준)
});

export type Location = z.infer<typeof locationSchema>;
