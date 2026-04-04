# Rido — AI Income Protection Platform

> Autonomous income protection for quick-commerce delivery workers

## Overview

Rido is a full-stack Next.js application that simulates an AI-powered insurance system for gig-economy delivery workers on platforms like Blinkit, Zepto, Swiggy Instamart, and others. It monitors real-time disruption signals and automatically triggers payouts — no manual claims required.

---

## Features

- **Risk Profiling** — Onboarding flow generating a Grit Score and Expected Income
- **Live ML Engine** — Sigmoid-based disruption probability model using weighted signals
- **Confidence Layer** — Multi-signal confidence score (threshold: 0.70 for payout)
- **Zero-Touch Payouts** — Auto-triggered after 7s disruption persistence validation
- **Dynamic Premium** — Formula: `P = baseRate + (risk × volatility) − (grit × discount)`
- **Simulation Console** — Force rain, traffic, delays, low orders
- **Real-Time Charts** — Income vs Actual, Risk Score over time, Premium fluctuation (Recharts)
- **Payout History** — Full log with confidence scores and loss tier

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + Tailwind CSS |
| State | Zustand (with localStorage persistence) |
| Charts | Recharts |
| Fonts | Syne + DM Sans + DM Mono (Google Fonts) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Unzip the archive
unzip rido.zip
cd rido

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
rido/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Entry point — routes onboarding ↔ dashboard
│   │   └── globals.css         # Design tokens + global styles
│   ├── components/
│   │   ├── Onboarding.tsx      # Risk profiling form
│   │   ├── Dashboard.tsx       # Shell with topbar + tab routing
│   │   ├── NotificationStack.tsx
│   │   ├── tabs/
│   │   │   ├── OverviewTab.tsx
│   │   │   ├── SimulateTab.tsx
│   │   │   └── HistoryTab.tsx
│   │   ├── ui/
│   │   │   ├── MetricCard.tsx
│   │   │   ├── WorkerCard.tsx  # Arc meter + disruption probability
│   │   │   ├── ConfidencePanel.tsx
│   │   │   ├── TriggerGrid.tsx
│   │   │   ├── AlertBanner.tsx
│   │   │   └── LiveTicker.tsx
│   │   └── charts/
│   │       ├── IncomeChart.tsx
│   │       ├── RiskChart.tsx
│   │       └── PremiumChart.tsx
│   ├── hooks/
│   │   └── useEngine.ts        # Main simulation loop (setInterval)
│   └── store/
│       └── ridoStore.ts        # Zustand store + ML math functions
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## ML Engine

The disruption probability uses a true sigmoid model, not if-else branching:

```typescript
function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }

function mlDisruptionScore(rain, traffic, latency, demand): number {
  const raw =
    0.8 * rainSignal +
    0.6 * trafficSignal +
    0.7 * latencySignal +
    0.75 * demandSignal;
  return sigmoid((raw - 1.2) * 3); // centered sigmoid → [0, 1]
}
```

### Payout Logic

| Income Loss | Payout Amount |
|---|---|
| < ₹80 | ₹50 |
| ₹80 – ₹180 | ₹150 |
| > ₹180 | ₹250 |

Payout only fires when:
1. Final confidence score > 0.70
2. Disruption has persisted for ≥ 7 seconds

### Premium Formula

```
P = 50 + (risk × 10 × zoneVolatility) - (grit × 0.3 × grit/100)

Zone Volatility: urban=1.0 | semi-urban=1.3 | high-risk=1.7
```

---

## How to Demo

1. Fill the Risk Profiling form and click **Generate My Protection Profile**
2. On the **Simulate** tab, click **Force Heavy Rain** + **Force High Traffic**
3. Watch the confidence score rise above 0.70 on the Overview tab
4. After ~7 seconds, a payout notification fires automatically
5. Check the **History** tab for the logged payout
6. Click **Reset All Conditions** to restore baseline

---

## Sample Data

| Worker | Platform | Zone | Grit Score | Expected Income |
|---|---|---|---|---|
| Ravi Kumar | Blinkit | Urban | 72 | ₹620/day |
| Priya Sharma | Zepto | High-Risk | 54 | ₹450/day |
| Arjun Singh | Swiggy Instamart | Semi-Urban | 90 | ₹800/day |

---

Built for hackathon demo purposes. All APIs and signals are simulated.
