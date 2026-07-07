# Architecture

## 목표

- Nx 모노레포로 MSA 구조의 **뼈대**를 잡는다.
- Kubernetes(Minikube) 위에서 서비스 분리·배포·네트working 경계를 실습한다.
- API Gateway로 **외부 진입점을 단일화**하고, 리소스 사용 한계를 측정·제한한다.

## 서비스 경계

```
[외부] → api-gateway → user-auth
                    → board
```

- **api-gateway** — 유일한 외부 노출 지점 (Ingress / NodePort)
- **user-auth, board** — 클러스터 내부 전용, gateway를 통해서만 접근
- DB는 MySQL 단일 인스턴스, **서비스별 스키마·마이그레이션 분리**

## API Gateway — JWT 정책

gateway에서는 auth 서비스에 매 요청 introspection하지 않는다.

1. JWT 파싱
2. 기본 클레임(sub 등) 추출
3. **만료(exp) 검증**

1차 범위에서는 토큰 revoke(로그아웃·강제 만료)는 다루지 않는다. 짧은 access token + refresh는 auth 서비스에서 처리한다.

## 단계별 로드맵

### 1차 — NestJS gateway (현재)

- Nx 앱·공유 라이브러리 구조 확립
- user-auth, board, api-gateway 구현
- Minikube 배포 (Deployment, Service, Ingress, probe)
- gateway ↔ 내부 서비스 API 계약 확정

**완료 기준:** 외부에서 gateway 하나로 auth·board API 호출 가능, K8s 배포·기본 운영 요소 동작.

### 2차 — 리소스 측정 및 gateway 교체 검토

NestJS gateway에 **충분한 리소스를 먼저 할당**한 뒤, limit·HPA·rate limit을 적용해 병목을 측정한다.

측정 항목:

- idle / 요청당 memory·CPU
- 동시 연결·p95 latency
- OOMKilled 여부

**KrakenD 전환 검토 조건:**

- gateway pod 리소스가 limit에 자주 걸림
- gateway 역할이 프록시·JWT·rate limit 수준으로 얇게 유지됨
- 1차 API 계약이 안정되어 gateway만 교체 가능

KrakenD는 1차 필수가 아니라 **후속 학습·최적화 옵션**이다. 내부 서비스(user-auth, board)는 NestJS + Drizzle 그대로 유지한다.

## 리소스 제한 — 3영역

배포 계층이 아니라 **제한을 적용하는 관심사**를 나눈 것이다. api-gateway도 Minikube Pod이며, K8s 영역의 적용 대상에 포함된다.

| 영역 | 적용 대상 | 역할 |
|------|-----------|------|
| Kubernetes | gateway 포함 **모든 Pod** | requests/limits, HPA, ResourceQuota, LimitRange |
| Gateway (앱) | api-gateway Pod 내부 로직 | QPS, IP/user rate limit, payload size, timeout |
| Service / DB | user-auth, board, MySQL | connection pool, query timeout, pagination |

한 영역(gateway 앱 또는 K8s)에만 의존하지 않고, 영역별로 제한을 두어 어디서 병목이 생기는지 파악한다.

## 공유 vs 분리 (Nx)

**공유 라이브러리:** 타입, JWT 유틸, Drizzle 스키마, 공통 DTO

**서비스별 독립:** 비즈니스 로직, API, DB 마이그레이션, K8s Deployment
