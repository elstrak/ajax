import Container from "@/components/ui/Container";
import Card from "@/components/ui/card";

const features = [
  {
    title: "Глубокое обучение",
    description: "Используем передовые нейронные сети для анализа кода смарт-контрактов и выявления потенциальных уязвимостей.",
    icon: "🧠"
  },
  {
    title: "Статический анализ",
    description: "Проверка кода без его выполнения для обнаружения ошибок, уязвимостей и соответствия лучшим практикам.",
    icon: "🔍"
  },
  {
    title: "Динамический анализ",
    description: "Симуляция выполнения контракта для выявления уязвимостей, которые проявляются только во время работы.",
    icon: "⚡"
  },
  {
    title: "Отчеты и рекомендации",
    description: "Подробные отчеты с описанием найденных уязвимостей и рекомендациями по их устранению.",
    icon: "📊"
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-900/50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Возможности платформы</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Наша платформа предлагает комплексный подход к анализу безопасности смарт-контрактов
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col items-center text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}