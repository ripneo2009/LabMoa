// 문제 정의 3카드 — Reveal 80ms 간격으로 순차 등장
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Reveal } from "@/components/motion";

const PROBLEMS = [
  {
    title: "장비가 없어요",
    description: "학교에는 없는 전문 장비가 필요한데, 대학이나 연구소는 문턱이 너무 높아요.",
  },
  {
    title: "검증해줄 사람이 없어요",
    description: "이 실험이 안전한지, 실현 가능한지 봐줄 전문가를 찾기 어려워요.",
  },
  {
    title: "어디서 시작할지 모르겠어요",
    description: "연구실을 찾아도 무슨 연구를 하는 곳인지, 나와 맞는지 알기 어려워요.",
  },
];

const STAGGER_DELAY = 0.08;

function ProblemCards() {
  return (
    <section className="container-app py-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PROBLEMS.map((problem, i) => (
          <Reveal key={problem.title} delay={i * STAGGER_DELAY}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{problem.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export { ProblemCards };
