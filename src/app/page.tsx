'use client';
import { useRidoStore } from '@/store/ridoStore';
import Onboarding from '@/components/Onboarding';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const profile = useRidoStore((s) => s.profile);
  return profile ? <Dashboard /> : <Onboarding />;
}
