// TODO: 실제 조사 데이터로 교체 — 멘토 프로필은 데모용 가상 인물이다
import type { MentorDegree } from "@/types/lab";

export interface SeedMentor {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userOrg: string;
  userPhone: string;
  labId: string;
  degree: MentorDegree;
  field: string;
  bio: string;
  researchKeywords: string[];
  responseRate: number;
}

export const mentorsData: SeedMentor[] = [
  {
    id: "mentor-kaist-chem-1",
    userId: "user-mentor-kaist-chem-1",
    userName: "이서준",
    userEmail: "seojun.lee@kaist-lab.example.com",
    userOrg: "KAIST 화학과",
    userPhone: "010-1111-2001",
    labId: "lab-kaist-chem",
    degree: "박사",
    field: "촉매화학",
    bio: "친환경 촉매 반응 설계를 연구하는 박사과정 연구원입니다. 고등학생 눈높이의 안전한 실험 설계를 돕습니다.",
    researchKeywords: ["촉매", "유기합성", "친환경화학"],
    responseRate: 92,
  },
  {
    id: "mentor-kaist-bio-1",
    userId: "user-mentor-kaist-bio-1",
    userName: "박지현",
    userEmail: "jihyun.park@kaist-lab.example.com",
    userOrg: "KAIST 생명과학과",
    userPhone: "010-1111-2002",
    labId: "lab-kaist-bio",
    degree: "석사",
    field: "분자세포생물학",
    bio: "세포 내 신호전달을 형광 이미징으로 관찰하는 실험을 지도합니다.",
    researchKeywords: ["세포생물학", "형광이미징", "신호전달"],
    responseRate: 88,
  },
  {
    id: "mentor-kaist-bio-2",
    userId: "user-mentor-kaist-bio-2",
    userName: "최민재",
    userEmail: "minjae.choi@kaist-lab.example.com",
    userOrg: "KAIST 생명과학과",
    userPhone: "010-1111-2003",
    labId: "lab-kaist-bio",
    degree: "박사후",
    field: "발생생물학",
    bio: "박사후연구원으로 초보 연구자의 실험 설계 검증을 주로 맡고 있습니다.",
    researchKeywords: ["발생생물학", "유전자발현"],
    responseRate: 95,
  },
  {
    id: "mentor-kriss-physics-1",
    userId: "user-mentor-kriss-physics-1",
    userName: "정하윤",
    userEmail: "hayoon.jung@kriss-lab.example.com",
    userOrg: "한국표준과학연구원(KRISS)",
    userPhone: "010-1111-2004",
    labId: "lab-kriss-physics",
    degree: "박사",
    field: "정밀계측",
    bio: "레이저 기반 정밀 측정 실험을 지도하며 안전 수칙을 엄격히 관리합니다.",
    researchKeywords: ["광학계측", "레이저", "정밀공학"],
    responseRate: 90,
  },
  {
    id: "mentor-krict-material-1",
    userId: "user-mentor-krict-material-1",
    userName: "한도윤",
    userEmail: "doyun.han@krict-lab.example.com",
    userOrg: "한국화학연구원(KRICT)",
    userPhone: "010-1111-2005",
    labId: "lab-krict-material",
    degree: "박사",
    field: "신소재화학",
    bio: "기능성 소재 합성 및 열분석을 담당하며 위험물 취급 안전교육을 진행합니다.",
    researchKeywords: ["신소재", "열분석", "고분자합성"],
    responseRate: 85,
  },
  {
    id: "mentor-etri-ai-1",
    userId: "user-mentor-etri-ai-1",
    userName: "오세훈",
    userEmail: "sehoon.oh@etri-lab.example.com",
    userOrg: "한국전자통신연구원(ETRI)",
    userPhone: "010-1111-2006",
    labId: "lab-etri-ai",
    degree: "석사",
    field: "인공지능",
    bio: "센서 데이터 기반 로봇 제어 모델 개발을 지도하는 연구원입니다.",
    researchKeywords: ["강화학습", "로보틱스", "센서퓨전"],
    responseRate: 93,
  },
  {
    id: "mentor-kribb-enviro-1",
    userId: "user-mentor-kribb-enviro-1",
    userName: "윤소율",
    userEmail: "soyul.yoon@kribb-lab.example.com",
    userOrg: "한국생명공학연구원(KRIBB)",
    userPhone: "010-1111-2007",
    labId: "lab-kribb-enviro",
    degree: "박사",
    field: "환경미생물학",
    bio: "환경 시료 채취부터 미생물 배양까지 현장 실습형 지도를 제공합니다.",
    researchKeywords: ["환경미생물", "생물정화", "미생물배양"],
    responseRate: 87,
  },
  {
    id: "mentor-hannam-physics-1",
    userId: "user-mentor-hannam-physics-1",
    userName: "임가은",
    userEmail: "gaeun.lim@hannam-lab.example.com",
    userOrg: "한남대학교 물리학과",
    userPhone: "010-1111-2008",
    labId: "lab-hannam-physics",
    degree: "석사",
    field: "플라즈마물리",
    bio: "저온 플라즈마 표면처리 실험을 대학 실습실에서 함께 진행합니다.",
    researchKeywords: ["플라즈마", "표면처리", "살균효과"],
    responseRate: 80,
  },
  {
    id: "mentor-jung-env-1",
    userId: "user-mentor-jung-env-1",
    userName: "강태영",
    userEmail: "taeyoung.kang@jungenv-lab.example.com",
    userOrg: "대전 중구 환경기술센터",
    userPhone: "010-1111-2009",
    labId: "lab-jung-env",
    degree: "박사",
    field: "환경분석화학",
    bio: "도심 대기·수질 측정 데이터를 함께 수집하고 분석 방법을 지도합니다.",
    researchKeywords: ["대기질", "수질분석", "환경모니터링"],
    responseRate: 91,
  },
];
