# k8s-msa-base

Nx 모노레포 기반 NestJS MSA 사이드 프로젝트. Kubernetes(Minikube) 환경에서 서비스 분리, API Gateway 경계, 리소스 제한을 학습·실험한다.

## 서비스 구성

| 서비스 | 역할 |
|--------|------|
| `api-gateway` | 외부 진입점. 라우팅, JWT 검증, rate limit |
| `user-auth` | 사용자·인증 |
| `board` | 게시판 |

내부 서비스는 클러스터 내부(ClusterIP) 전용이며, 외부 접근은 gateway를 통해서만 허용한다.

## 기술 스택

- **Monorepo** — Nx
- **Runtime** — TypeScript, NestJS
- **ORM / DB** — Drizzle, MySQL
- **Infra** — Kubernetes, Minikube

## 현재 단계

**1차:** NestJS api-gateway로 전체 구조와 K8s 배포 흐름을 완성하고, 포트폴리오 최소 목표를 달성한다.

**2차(검토):** 리소스 측정 후 gateway를 KrakenD로 교체할 가능성을 검토한다.

→ 방향성, JWT 정책, 단계별 목표: [docs/architecture.md](./docs/architecture.md)

## 로컬 실행

> 아직 구성 중. 앱 스캐폴딩 및 Minikube 매니페스트 추가 후 업데이트 예정.
