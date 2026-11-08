# NexTech AI — Injection Molding Solution (IM-SOLUTION Suite)

[![Website](https://img.shields.io/badge/Website-nextech315.github.io-00E5FF?style=flat&logo=googlechrome&logoColor=white)](https://nextech315.github.io/Injection-Molding-Solution/)
[![YouTube Channel](https://img.shields.io/badge/YouTube-@nextech--315-FF0000?style=flat&logo=youtube&logoColor=white)](https://www.youtube.com/@nextech-315)
[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)](https://nextech315.github.io/Injection-Molding-Solution/)

> **NexTech AI 사출 솔루션 플랫폼 (IM-SOLUTION Suite v1.2)**  
> 10대 사출 불량 실시간 진단부터 Moldflow 연동 자동 최적화(LHS 30건 DoE), AI 대리 모델, Edge AI 자율 제어, 도메인 RAG 지식 허브까지 — 현장 데이터와 AI 기술을 융합한 엔터프라이즈 사출 성형 최적화 통합 플랫폼입니다.

---

## 🌐 Official Links

- **공식 웹사이트**: [https://nextech315.github.io/Injection-Molding-Solution/](https://nextech315.github.io/Injection-Molding-Solution/)
- **공식 유튜브 채널**: [https://www.youtube.com/@nextech-315](https://www.youtube.com/@nextech-315)
- **도입 문의 및 데모 신청**: `nextech315@gmail.com` | `010-6418-7472`

---

## 🧩 IM-SOLUTION 8대 모듈 통합 아키텍처

| 모듈 코드 | 모듈명 | 영문 표기 | 핵심 기능 |
|:---:|:---|:---|:---|
| **MOD-01** | **사출 불량 종합 솔루션 AI** | Total Defect Solution AI | 설비·금형·원자재·공정 조건 기반 10대 사출 불량 동시 진단 및 원인 처방 |
| **MOD-02** | **Moldflow CAE 연동 최적화** | Moldflow OptiSolution AI | CAE 수치와 실제 사출 성형 데이터 융합 분석, 잠재 결함 사전 감지 |
| **MOD-03** | **AI 대리 모델 시뮬레이션** | Moldflow Surrogate AI | 고차원 유동해석 데이터 기반 AI 대리 모델(Surrogate)을 통한 초고속 가상 시뮬레이션 |
| **MOD-04** | **Moldflow 자동 최적화** | LHS 30-Case DoE & Auto-Solver | Moldflow 해석 1건 기준 LHS 30건 자동 설계, 실시간 자동 해석 루프 및 AI 최적 공정 도출 |
| **MOD-05** | **사출 특화 RAG 지식 허브** | Injection Domain RAG Hub | 심야 자율 크롤링(Nightly RAG Crawler) 및 물리 연산 기반 정량 수치 처방전 |
| **MOD-06** | **사출 CT 정밀 분석 시스템** | Auto-AI Cycle Time Predictor | 앙상블 머신러닝 엔진(NOPRECT) 기반 사이클 타임(CT) 정밀 산출 및 생산성 극대화 |
| **MOD-07** | **공정 작업순서 최적화 엔진** | Sequence GA Optimizer | 사출 설비와 후공정 타임테이블 연동, 유전 알고리즘 기반 작업자 배치 및 최대 CAPA 계산 |
| **MOD-08** | **사출기 원시 데이터 변환기** | Machine Log ETL Converter | 다양한 사출기 원본 로그(CSV/TXT) 고속 정제 및 엔터프라이즈 표준 XLSX 리포트 변환 |

---

## 🚀 MOD-04 Moldflow 자동 최적화 6단계 파이프라인

```text
[01] Moldflow 실행 폴더 / 표준 해석 (Baseline Setup)
   ↓
[02] 사출 불량 항목 / 변수 & 타겟 설정 (Target & Factors)
   ↓
[03] 최적 실험 계획법 생성 (LHS 30 Cases)
   ↓
[04] 실시간 자동 해석 (Background Solver Engine)
   ↓
[05] AI 머신러닝 최적화 조건 도출 (Multi-Objective Optimization)
   ↓
[06] Moldflow 최종 검증 (Validation Closed-Loop)
```

1. **표준 해석 로드**: Moldflow 작업 폴더에서 1회차 베이스라인 해석 데이터를 자동 인지합니다.
2. **타겟 및 변수 설정**: 웰드라인, 수축, 미성형 등 목표 불량과 용융온도, 금형온도, 사출속도, 보압 범위를 지정합니다.
3. **LHS 30건 DoE 자동 설계**: 다변량 공정 공간을 빈틈없이 균일하게 탐색하는 라틴 하이퍼큐브 샘플링(LHS) 30건을 생성합니다.
4. **실시간 자동 해석 루프**: Moldflow API/VBScript와 백그라운드 연동하여 30건의 해석을 자동 완료합니다.
5. **AI 머신러닝 최적화**: 30건의 고정밀 데이터를 학습해 목표 불량을 최소화하는 수렴 완료 파라미터를 도출합니다.
6. **최종 검증 및 리포트**: 최적 조건을 Moldflow에 재입력해 최종 검증을 완료하고 현장 사출기 적용 리포트를 생성합니다.

---

## ⚡ 주요 검증 성과 (Proven Case Results)

- **화장품 캡(Cosmetic Cap) 웰드라인 불량 90% 저감**:
  - 기존 공정 위험도: `80%` → AI 최적화 후: `8%` (▼ 72%p 감소)
  - 최적 조건 도출 시간: **5초 이내** (기존 수일간의 시행착오 대체)
- **10대 불량 트레이드오프 동시 균형 최적화**:
  - 특정 불량 개선 시 다른 불량이 악화되는 트레이드오프를 방지하고 전체 10개 불량이 고르게 감소하는 균형 최적 조건 도출 (60% → 39%).
- **Edge AI 실시간 자율 제어**:
  - 센서 이상으로 종합 위험도 `95.0%` 급등 시, 사람의 개입 없이 AI가 스스로 공정 파라미터를 재계산하여 **약 12초 만에 24.9%로 자율 복구**.

---

## 🎬 시연 동영상 및 유튜브 채널

- **유튜브 공식 채널**: [https://www.youtube.com/@nextech-315](https://www.youtube.com/@nextech-315)
- **데모 영상**:
  - NexTech AI 3분 시연 영상: [https://www.youtube.com/embed/htqqAATOg1E](https://www.youtube.com/embed/htqqAATOg1E)
  - Edge AI 실시간 자율 제어 데모: [https://www.youtube.com/embed/Kub_MypZVxU](https://www.youtube.com/embed/Kub_MypZVxU)
  - 사출 특화 RAG AI 진단 솔루션: [https://www.youtube.com/embed/iOXkFUcBjCU](https://www.youtube.com/embed/iOXkFUcBjCU)
  - 실시간 사출 지식 수집 대시보드: [https://www.youtube.com/embed/x2Gni_Pp26c](https://www.youtube.com/embed/x2Gni_Pp26c)

---

## 📞 도입 문의 및 기술 상담

- **이메일**: `nextech315@gmail.com`
- **전화번호**: `010-6418-7472`
- **웹사이트**: [https://nextech315.github.io/Injection-Molding-Solution/](https://nextech315.github.io/Injection-Molding-Solution/)
- **저작권**: © 2026 NexTech AI. All rights reserved.
