import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Zone = 'urban' | 'semi-urban' | 'high-risk';
export type Experience = 'beginner' | 'intermediate' | 'expert';

export interface WorkerProfile {
  name: string;
  platform: string;
  zone: Zone;
  exp: Experience;
  hours: number;
}

export interface Payout {
  id: string;
  time: string;
  reason: string;
  confidence: number;
  amount: number;
  type: 'small' | 'medium' | 'large';
}

export interface Triggers {
  rain: boolean;
  traffic: boolean;
  delay: boolean;
  orders: boolean;
}

export interface ConfidenceScores {
  weather: number;
  traffic: number;
  latency: number;
  demand: number;
}

export interface LiveSignals {
  rain: number;
  traffic: 'Low' | 'Medium' | 'High';
  latency: 'Normal' | 'Slow' | 'Critical';
  demand: number;
}

export interface TimeSeriesPoint {
  label: string;
  risk: number;
  premium: number;
  expected: number;
  actual: number;
}

interface RidoState {
  profile: WorkerProfile | null;
  gritScore: number;
  incomeStabilityScore: number;
  expectedIncome: number;
  actualIncome: number;
  riskScore: number;
  premium: number;
  coverage: number;
  disruptionProbability: number;
  triggers: Triggers;
  confidence: ConfidenceScores;
  finalConfidence: number;
  signals: LiveSignals;
  payouts: Payout[];
  totalPayouts: number;
  timeSeries: TimeSeriesPoint[];
  disrupting: boolean;
  disruptionStart: number | null;
  payoutCooldown: boolean;
  notifications: { id: string; title: string; msg: string; type: string }[];
  activeTab: 'overview' | 'simulate' | 'history';

  setProfile: (p: WorkerProfile) => void;
  setTrigger: (key: keyof Triggers, val: boolean) => void;
  resetTriggers: () => void;
  tick: () => void;
  addPayout: (p: Payout) => void;
  setPayoutCooldown: (v: boolean) => void;
  addNotification: (title: string, msg: string, type: string) => void;
  removeNotification: (id: string) => void;
  setActiveTab: (tab: 'overview' | 'simulate' | 'history') => void;
  setDisruptionStart: (v: number | null) => void;
}

export const useRidoStore = create<RidoState>()(
  persist(
    (set, get) => ({
      profile: null,
      gritScore: 0,
      incomeStabilityScore: 0,
      expectedIncome: 0,
      actualIncome: 0,
      riskScore: 0,
      premium: 50,
      coverage: 50,
      disruptionProbability: 0,
      triggers: { rain: false, traffic: false, delay: false, orders: false },
      confidence: { weather: 0, traffic: 0, latency: 0, demand: 0 },
      finalConfidence: 0,
      signals: { rain: 0, traffic: 'Low', latency: 'Normal', demand: 12 },
      payouts: [],
      totalPayouts: 0,
      timeSeries: [],
      disrupting: false,
      disruptionStart: null,
      payoutCooldown: false,
      notifications: [],
      activeTab: 'overview',

      setProfile: (p) => {
        const grit = calcGrit(p.exp, p.hours);
        const expected = EXP_INCOME[p.exp];
        const stability = Math.round(50 + grit * 0.4);
        set({ profile: p, gritScore: grit, expectedIncome: expected, incomeStabilityScore: stability });
      },

      setTrigger: (key, val) => {
        const triggers = { ...get().triggers, [key]: val };
        const disrupting = Object.values(triggers).some(Boolean);
        set({ triggers, disrupting, disruptionStart: disrupting ? (get().disruptionStart ?? Date.now()) : null });
      },

      resetTriggers: () => {
        set({
          triggers: { rain: false, traffic: false, delay: false, orders: false },
          disrupting: false,
          disruptionStart: null,
          payoutCooldown: false,
        });
      },

      tick: () => {
        const s = get();
        if (!s.profile) return;

        const signals = getCurrentSignals(s.triggers);
        const prob = mlDisruptionScore(signals.rain, signals.traffic, signals.latency, signals.demand);
        const conf = getConfidenceScores(signals.rain, signals.traffic, signals.latency, signals.demand);
        const finalConf = roundTo2((conf.weather + conf.traffic + conf.latency + conf.demand) / 4);
        const risk = Math.round(prob * 100);
        const actualMod = s.disrupting ? 0.5 + Math.random() * 0.25 : 0.82 + Math.random() * 0.18;
        const actual = Math.round(s.expectedIncome * actualMod);
        const premium = calcPremium(prob * 10, s.profile.zone, s.gritScore);
        const incomeLoss = Math.max(0, s.expectedIncome - actual);
        const coverage = incomeLoss < 80 ? 50 : incomeLoss < 180 ? 150 : 250;

        const now = new Date();
        const label = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        const newPoint: TimeSeriesPoint = { label, risk, premium, expected: s.expectedIncome, actual };
        const series = [...s.timeSeries, newPoint].slice(-20);

        set({
          signals, disruptionProbability: prob, confidence: conf, finalConfidence: finalConf,
          riskScore: risk, actualIncome: actual, premium, coverage, timeSeries: series,
        });
      },

      addPayout: (p) => {
        set((s) => ({ payouts: [p, ...s.payouts], totalPayouts: s.totalPayouts + p.amount }));
      },

      setPayoutCooldown: (v) => set({ payoutCooldown: v }),

      addNotification: (title, msg, type) => {
        const id = Math.random().toString(36).slice(2);
        set((s) => ({ notifications: [{ id, title, msg, type }, ...s.notifications] }));
        setTimeout(() => get().removeNotification(id), 5500);
      },

      removeNotification: (id) => {
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) }));
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
      setDisruptionStart: (v) => set({ disruptionStart: v }),
    }),
    { name: 'rido-storage', partialize: (s) => ({ profile: s.profile, payouts: s.payouts, totalPayouts: s.totalPayouts }) }
  )
);

// ─── ML / Math utils ────────────────────────────────────────────────────────

export const PLATFORMS = [
  'Blinkit', 'Zepto', 'Swiggy Instamart', 'BigBasket', 'Dunzo',
  'JioMart', 'Flipkart Minutes', 'Amazon Fresh', 'Tata Neu', 'Myntra M-Now',
];

const EXP_INCOME: Record<Experience, number> = { beginner: 450, intermediate: 620, expert: 800 };
const ZONE_VOLATILITY: Record<Zone, number> = { urban: 1.0, 'semi-urban': 1.3, 'high-risk': 1.7 };
const WEIGHTS = { rain: 0.8, traffic: 0.6, latency: 0.7, demand: 0.75 };

function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }
function roundTo2(n: number) { return Math.round(n * 100) / 100; }

export function calcGrit(exp: Experience, hours: number): number {
  const expMap: Record<Experience, number> = { beginner: 30, intermediate: 60, expert: 90 };
  const hoursBonus = Math.min(((hours - 4) / 10) * 30, 30);
  return Math.round(expMap[exp] + hoursBonus);
}

export function calcPremium(risk: number, zone: Zone, grit: number): number {
  const volatility = ZONE_VOLATILITY[zone] ?? 1.0;
  const discount = grit / 100;
  const P = 50 + risk * 10 * volatility - grit * 0.3 * discount;
  return Math.max(20, Math.round(Math.min(P, 200)));
}

export function mlDisruptionScore(
  rain: number, traffic: 'Low' | 'Medium' | 'High',
  latency: 'Normal' | 'Slow' | 'Critical', demand: number
): number {
  const rVal = rain > 0 ? Math.min(rain / 40, 1) : 0;
  const tMap = { Low: 0, Medium: 0.5, High: 1 };
  const lMap = { Normal: 0.1, Slow: 0.6, Critical: 1 };
  const tVal = tMap[traffic] ?? 0;
  const lVal = lMap[latency] ?? 0.1;
  const dVal = demand < 8 ? 1 : demand < 13 ? 0.4 : 0.1;
  const raw = WEIGHTS.rain * rVal + WEIGHTS.traffic * tVal + WEIGHTS.latency * lVal + WEIGHTS.demand * dVal;
  return roundTo2(sigmoid((raw - 1.2) * 3));
}

export function getConfidenceScores(
  rain: number, traffic: 'Low' | 'Medium' | 'High',
  latency: 'Normal' | 'Slow' | 'Critical', demand: number
): ConfidenceScores {
  const rVal = rain > 0 ? Math.min(rain / 40, 1) * 0.95 : 0.05;
  const tMap = { Low: 0.08, Medium: 0.55, High: 0.9 };
  const lMap = { Normal: 0.1, Slow: 0.65, Critical: 0.95 };
  const dVal = demand < 8 ? 0.88 : demand < 13 ? 0.45 : 0.12;
  return {
    weather: roundTo2(rVal),
    traffic: tMap[traffic] ?? 0.08,
    latency: lMap[latency] ?? 0.1,
    demand: roundTo2(dVal),
  };
}

export function getCurrentSignals(triggers: Triggers): LiveSignals {
  const rain = triggers.rain ? 28 + Math.random() * 15 : Math.random() * 3;
  const traffic = triggers.traffic ? 'High' : (Math.random() > 0.7 ? 'Medium' : 'Low');
  const latency = triggers.delay ? (Math.random() > 0.4 ? 'Critical' : 'Slow') : 'Normal';
  const demand = triggers.orders ? 4 + Math.random() * 4 : 10 + Math.random() * 6;
  return {
    rain: Math.round(rain * 10) / 10,
    traffic: traffic as LiveSignals['traffic'],
    latency: latency as LiveSignals['latency'],
    demand: Math.round(demand),
  };
}
