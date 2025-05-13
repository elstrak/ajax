import Container from "@/components/ui/Container";
import Card from "@/components/ui/card";

const stats = [
  { value: "500M+", label: "Средств украдено из-за уязвимостей в 2023" },
  { value: "78%", label: "Смарт-контрактов содержат уязвимости" },
  { value: "95%", label: "Точность обнаружения с нашей системой" },
  { value: "3000+", label: "Проанализированных контрактов" }
];

export default function SecurityStats() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Статистика безопасности</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Почему анализ безопасности смарт-контрактов критически важен
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}