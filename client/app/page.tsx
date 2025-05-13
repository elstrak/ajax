import { BackgroundPaths } from "@/components/ui/background-paths"

export default function Home() {
  return (
    <main>
      <BackgroundPaths title="Анализ уязвимостей смарт-контрактов" />
    </main>
  );
}

// You can keep this if you need it elsewhere
export function DemoBackgroundPaths() {
  return <BackgroundPaths title="Background Paths" />
}