import {locationSchema, Location} from '../location/schema';
import {z} from 'zod';

class LocationService {
  private webSocket: WebSocket | null = null;
  private readonly WEBSOCKET_URL = 'ws://192.168.45.215:8080/gps'; // 실제 서버 URL로 변경
  private locations: Record<string, Location> = {}; // ✅ 단순 위치 저장 (그룹 구분 필요 없음)
  private listeners: ((locations: Record<string, Location>) => void)[] = []; // ✅ 상태 업데이트 리스너
  private selfUserId: string | null = null; // ✅ 본인 ID 저장

  // ✅ 웹소켓 연결
  connect(userId: string, role: 'host' | 'shared', hostUserId?: string) {
    if (this.webSocket) {
      console.log('🔗 이미 웹소켓이 연결되어 있음');
      return;
    }

    this.selfUserId = userId;

    // 호스트/공유자에 따라 URL 설정
    const url =
      role === 'host'
        ? `${this.WEBSOCKET_URL}?role=host&userId=${userId}`
        : `${this.WEBSOCKET_URL}?role=shared&userId=${userId}&hostSessionId=${hostUserId}`;

    this.webSocket = new WebSocket(url);

    this.webSocket.onopen = () => console.log('✅ 웹소켓 연결 성공');
    this.webSocket.onclose = () => {
      console.log('❌ 웹소켓 연결 종료');
      this.webSocket = null;
    };
    this.webSocket.onerror = (error) =>
      console.error('🚨 웹소켓 오류 발생:', error);

    // ✅ 서버로부터 위치 데이터 수신
    this.webSocket.onmessage = (event: MessageEvent) => {
      try {
        const rawData = JSON.parse(event.data);
        const validatedLocation = locationSchema.parse(rawData);

        // ✅ 본인이 보낸 데이터인지 확인 (본인이 보낸 위치라면 userId로 저장)
        if (this.selfUserId) {
          this.locations[this.selfUserId] = validatedLocation;
        }

        this.listeners.forEach((callback) => callback(this.locations));

        console.log('📩 서버로부터 데이터 수신:', validatedLocation);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('❌ 데이터 검증 실패:', error.errors);
        } else {
          console.error('❌ 받은 데이터 파싱 오류:', error);
        }
      }
    };
  }

  // ✅ UI에서 위치 변경을 감지하고 반영하도록 구독하는 함수
  subscribeToLocationUpdates(
    callback: (locations: Record<string, Location>) => void,
  ) {
    this.listeners.push(callback);
  }

  // ✅ 위치 데이터 전송 (호스트만 가능)
  sendLocation(location: Location) {
    if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ 웹소켓이 열려있지 않음');
      return;
    }

    try {
      // Zod를 이용한 데이터 검증
      const validatedLocation = locationSchema.parse(location);

      this.webSocket.send(JSON.stringify(validatedLocation));
      console.log('📡 위치 데이터 전송:', validatedLocation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('❌ 위치 데이터 검증 실패:', error.errors);
      } else {
        console.error('❌ 위치 데이터 전송 중 오류 발생:', error);
      }
    }
  }

  // ✅ 웹소켓 종료
  disconnect() {
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }
  }
}

// 싱글턴 패턴으로 서비스 객체 생성 (전역적으로 사용 가능)
export const locationService = new LocationService();
