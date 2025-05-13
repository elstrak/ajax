import Container from "@/components/ui/Container";

const steps = [
  {
    number: "01",
    title: "Загрузите контракт",
    description: "Загрузите код вашего смарт-контракта на Solidity или другом поддерживаемом языке."
  },
  {
    number: "02",
    title: "Запустите анализ",
    description: "Наша система проведет комплексный анализ кода с использованием нейронных сетей."
  },
  {
    number: "03",
    title: "Получите результаты",
    description: "Просмотрите подробный отчет о найденных уязвимостях и рекомендации по их устранению."
  },
  {
    number: "04",
    title: "Исправьте проблемы",
    description: "Внесите необходимые изменения в код и повторите анализ для подтверждения безопасности."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Как это работает</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Простой процесс анализа вашего смарт-контракта в четыре шага
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-5xl font-bold text-blue-600/20 mb-4">{step.number}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-16 h-0.5 bg-blue-600/20 -ml-8 transform -translate-x-full">
                  <div className="absolute right-0 w-2 h-2 rounded-full bg-blue-600 -mt-0.5"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}