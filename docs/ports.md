# Ports

로컬 개발용 포트 규칙. Node 기본 `3000`은 사용하지 않는다.

## 앱 HTTP

| 서비스 | 포트 | 로컬 URL |
|--------|------|----------|
| api-gateway | 4000 | http://localhost:4000 |
| user-auth | 4001 | http://localhost:4001 |
| board | 4002 | http://localhost:4002 |

## 인프라

| 서비스 | 포트 |
|--------|------|
| MySQL | 3306 |

## 규칙

1. 런타임은 `process.env.PORT`를 사용한다. 미설정 시 각 앱 `main.ts` fallback이 로컬 기본값이다.
2. `.env.example` / `.env`의 `PORT`로 덮어쓸 수 있다 (`cp .env.example .env`).
3. 서비스 간 호출 URL은 env로 주입한다 (예: `USER_AUTH_URL`).
4. Kubernetes 배포 시 포트·URL은 매니페스트/ConfigMap env로 덮어쓴다.
