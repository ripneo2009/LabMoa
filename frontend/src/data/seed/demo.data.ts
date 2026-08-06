// 발표 시나리오용 데모 데이터 — revision 계획서 1건, approved 계획서 1건,
// 리뷰 코멘트 3건, 채팅 5건. lab/mentor id는 labs.data.ts, mentors.data.ts와 맞춰져 있다.
import type {
  MaterialItem,
  ProposalStatus,
  ReviewSeverity,
  ReviewTargetField,
} from "@/types/proposal";

export interface SeedStudent {
  id: string;
  name: string;
  email: string;
  org: string;
  phone: string;
}

export const demoStudents: SeedStudent[] = [
  {
    id: "user-student-kim-haeun",
    name: "김하은",
    email: "haeun.kim@student.example.com",
    org: "대전과학고등학교",
    phone: "010-2222-3001",
  },
  {
    id: "user-student-lee-subin",
    name: "이수빈",
    email: "subin.lee@student.example.com",
    org: "충남과학고등학교",
    phone: "010-2222-3002",
  },
];

export interface SeedProposal {
  id: string;
  studentId: string;
  labId: string;
  mentorId: string;
  title: string;
  motivation: string;
  hypothesis: string;
  method: string;
  neededMaterials: MaterialItem[];
  neededEquipment: string[];
  durationHours: number;
  safetyNotes: string;
  status: ProposalStatus;
  version: number;
}

export const demoProposals: SeedProposal[] = [
  {
    id: "proposal-demo-revision",
    studentId: "user-student-kim-haeun",
    labId: "lab-kaist-chem",
    mentorId: "mentor-kaist-chem-1",
    title: "저온 조건에서 구리 촉매의 반응 수율 비교 실험",
    motivation:
      "화학 동아리에서 촉매 반응을 배운 뒤, 실제 실험실에서 온도 조건에 따른 수율 차이를 직접 확인해보고 싶었습니다.",
    hypothesis:
      "반응 온도를 낮추면 부반응이 줄어들어 목표 생성물의 수율이 높아질 것이다.",
    method:
      "동일한 반응물로 20도, 40도, 60도 세 조건에서 각각 반응시킨 뒤 HPLC로 생성물 비율을 비교한다.",
    neededMaterials: [
      { name: "구리 촉매 시약", unitPrice: 45000, qty: 1 },
      { name: "반응 용매(에탄올)", unitPrice: 12000, qty: 2 },
    ],
    neededEquipment: ["HPLC", "전자저울", "흄후드"],
    durationHours: 4,
    safetyNotes: "흄후드 내에서만 시약을 다루고, 보호경과 장갑을 착용하겠습니다.",
    status: "revision",
    version: 2,
  },
  {
    id: "proposal-demo-approved",
    // 데모 로그인(lib/auth/current-user.ts)이 고정된 학생 계정 하나만 지원하므로,
    // 두 데모 계획서 모두 같은 학생 소유로 두어야 두 화면(검토 루프/예약) 모두 시연 가능하다.
    studentId: "user-student-kim-haeun",
    labId: "lab-kribb-enviro",
    mentorId: "mentor-kribb-enviro-1",
    title: "학교 인근 하천 퇴적토의 미생물 분해능 조사",
    motivation:
      "동네 하천이 예전보다 깨끗해진 이유가 궁금해서, 퇴적토 속 미생물이 오염물질을 분해하는지 확인하고 싶습니다.",
    hypothesis:
      "하천 퇴적토에는 유기 오염물질을 분해할 수 있는 미생물 군집이 존재할 것이다.",
    method:
      "현장에서 퇴적토 시료를 채취해 배양한 뒤, 오염물질 분해 전후 농도 변화를 비교 측정한다.",
    neededMaterials: [{ name: "배양 배지", unitPrice: 20000, qty: 3 }],
    neededEquipment: ["오토클레이브", "인큐베이터", "수질분석기"],
    durationHours: 6,
    safetyNotes:
      "현장 채취 시 보호장갑을 착용하고, 배양 작업은 반드시 클린벤치에서 진행하겠습니다.",
    status: "approved",
    version: 1,
  },
];

export interface SeedReviewNote {
  id: string;
  proposalId: string;
  authorId: string; // mentor user id
  targetField: ReviewTargetField;
  comment: string;
  severity: ReviewSeverity;
}

export const demoReviewNotes: SeedReviewNote[] = [
  {
    id: "review-demo-1",
    proposalId: "proposal-demo-revision",
    authorId: "user-mentor-kaist-chem-1",
    targetField: "hypothesis",
    comment:
      "온도 구간을 20~60도로 잡으면 실험실 냉각 장치로 20도를 안정적으로 유지하기 어렵습니다. 30~70도로 조정해 주세요.",
    severity: "blocker",
  },
  {
    id: "review-demo-2",
    proposalId: "proposal-demo-revision",
    authorId: "user-mentor-kaist-chem-1",
    targetField: "materials",
    comment: "구리 촉매 시약은 소량 포장 제품이 있어 더 저렴하게 구매할 수 있어요.",
    severity: "info",
  },
  {
    id: "review-demo-3",
    proposalId: "proposal-demo-revision",
    authorId: "user-mentor-kaist-chem-1",
    targetField: "safety",
    comment:
      "에탄올은 인화성이 있어 흄후드 내 화기 사용 여부도 함께 명시해 주세요.",
    severity: "warning",
  },
];

export interface SeedMessage {
  id: string;
  proposalId: string;
  senderId: string; // user id (student or mentor)
  content: string;
}

export const demoMessages: SeedMessage[] = [
  {
    id: "message-demo-1",
    proposalId: "proposal-demo-revision",
    senderId: "user-student-kim-haeun",
    content: "안녕하세요! 계획서 검토해주셔서 감사합니다. 온도 구간 수정해서 다시 제출할게요.",
  },
  {
    id: "message-demo-2",
    proposalId: "proposal-demo-revision",
    senderId: "user-mentor-kaist-chem-1",
    content: "네 좋습니다. 30도부터 시작하면 냉각 장치로 충분히 유지 가능해요.",
  },
  {
    id: "message-demo-3",
    proposalId: "proposal-demo-revision",
    senderId: "user-student-kim-haeun",
    content: "혹시 실험 당일 흄후드 예약도 따로 해야 할까요?",
  },
  {
    id: "message-demo-4",
    proposalId: "proposal-demo-revision",
    senderId: "user-mentor-kaist-chem-1",
    content: "예약 페이지에서 함께 신청하면 됩니다. 별도 예약은 필요 없어요.",
  },
  {
    id: "message-demo-5",
    proposalId: "proposal-demo-revision",
    senderId: "user-student-kim-haeun",
    content: "감사합니다! 수정본 오늘 중으로 다시 제출하겠습니다.",
  },
];
