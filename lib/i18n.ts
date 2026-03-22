import type { ProjectStatus } from "@/lib/types";

export const supportedLocales = ["ko", "en", "ja", "zh"] as const;
export type Locale = (typeof supportedLocales)[number];

export const LOCALE_COOKIE_NAME = "blac_locale";

const localeLabels: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文"
};

const categoryLabelMap = {
  "ai-agents": {
    ko: "AI + 에이전트",
    en: "AI + Agents",
    ja: "AI + エージェント",
    zh: "AI + 智能体"
  },
  devtools: {
    ko: "개발 도구",
    en: "Developer Tools",
    ja: "開発ツール",
    zh: "开发工具"
  },
  automation: {
    ko: "자동화",
    en: "Automation",
    ja: "自動化",
    zh: "自动化"
  },
  starters: {
    ko: "스타터 킷",
    en: "Starter Kits",
    ja: "スターターキット",
    zh: "启动套件"
  }
} as const;

const categoryLookupByName: Record<string, keyof typeof categoryLabelMap> = {
  "AI + Agents": "ai-agents",
  "Developer Tools": "devtools",
  Automation: "automation",
  "Starter Kits": "starters"
};

const contextualLabelMap = {
  "Why it matters": {
    ko: "왜 주목할 만한가",
    en: "Why it matters",
    ja: "なぜ重要か",
    zh: "为什么值得关注"
  },
  "Best for": {
    ko: "추천 대상",
    en: "Best for",
    ja: "最適な対象",
    zh: "最适合"
  },
  "What it solves": {
    ko: "해결하는 문제",
    en: "What it solves",
    ja: "解決する課題",
    zh: "解决什么问题"
  }
} as const;

const projectStatusMap: Record<ProjectStatus, Record<Locale, string>> = {
  pending: { ko: "검토 대기", en: "Pending", ja: "審査待ち", zh: "待审核" },
  active: { ko: "유지 중", en: "Maintained", ja: "継続中", zh: "维护中" },
  limited: { ko: "활동 제한", en: "Limited activity", ja: "限定活動", zh: "活动有限" },
  featured: { ko: "추천", en: "Featured", ja: "特集", zh: "精选" },
  archived: { ko: "보관됨", en: "Archived", ja: "アーカイブ", zh: "已归档" },
  removed: { ko: "숨김", en: "Removed", ja: "非表示", zh: "已移除" }
};

const resultKindMap = {
  project: { ko: "프로젝트", en: "project", ja: "プロジェクト", zh: "项目" },
  creator: { ko: "크리에이터", en: "creator", ja: "クリエイター", zh: "创作者" },
  collection: { ko: "컬렉션", en: "collection", ja: "コレクション", zh: "合集" }
} as const;

const dictionaries: Record<Locale, any> = {
  ko: {
    metadataTitle: "개발자도 크리에이터가 되는 시대",
    metadataDescription:
      "개발 도구, 실험작, 워크플로우, 오픈소스를 사람 중심으로 발견하는 크리에이터형 큐레이션 플랫폼.",
    nav: {
      explore: "탐색",
      creators: "빌더",
      collections: "컬렉션",
      saved: "저장됨",
      recommend: "레포 추천",
      login: "GitHub 로그인",
      logout: "로그아웃"
    },
    brand: {
      title: "Build Like a Creator",
      tagline: "마른 저장소가 아니라 살아 있는 프로젝트를 발견하는 곳."
    },
    locale: {
      label: "언어"
    },
    sidebar: {
      searchLabel: "검색",
      discoverLabel: "탐색",
      recommendedCategories: "추천 카테고리",
      recommendedCreators: "추천 빌더",
      loginPrompt: "로그인하고 저장과 팔로우를 시작하세요",
      loggedInAs: "현재 세션",
      quickAccess: "빠른 이동"
    },
    footer: {
      tagline: "개발자를 위한 크리에이터 중심 큐레이션 레이어. 코드는 여전히 GitHub에 남아 있다.",
      about: "소개",
      collections: "컬렉션",
      recommend: "추천 등록"
    },
    search: {
      placeholder: "프로젝트, 빌더, 컬렉션 검색...",
      button: "검색"
    },
    filter: {
      all: "전체",
      trending: "인기",
      newest: "최신",
      mostSaved: "저장 많은 순"
    },
    hero: {
      eyebrow: "개발 크리에이터는 더 이상 묻히지 않는다",
      title: "툴, 실험작, 워크플로우를 만든 사람의 맥락까지 붙은 채로 발견한다.",
      description:
        "이 플랫폼은 GitHub 위의 큐레이션 레이어다. 누가 만들었는지, 어떤 문제를 해결하는지, 왜 중요한지, 지금도 살아 있는지까지 보여준다.",
      browseTrending: "인기 프로젝트 보기",
      viewEditorPicks: "에디터 픽 보기",
      recommendRepo: "레포 추천하기"
    },
    home: {
      editorialEyebrow: "에디터 컬렉션",
      editorialTitle: "이미 관점이 있는 큐레이션부터 시작한다.",
      editorialDescription: "컬렉션은 레포를 열기 전에 왜 이 프로젝트를 봐야 하는지 먼저 설명한다.",
      featuredEyebrow: "대표 프로젝트",
      featuredTitle: "GitHub 링크보다 크리에이터 맥락이 먼저 나온다.",
      featuredDescription: "각 프로젝트는 누가 만들었고 왜 중요한지 중심으로 정리된다.",
      trendingEyebrow: "지금 뜨는 프로젝트",
      trendingTitle: "빌더들이 지금 저장하고 있는 신호 높은 프로젝트.",
      trendingDescription: "랭킹은 저장소 나이보다 맥락, 신선도, 재사용 가치를 더 본다.",
      categoriesEyebrow: "카테고리",
      categoriesTitle: "레포 타입이 아니라 의도 기준으로 탐색한다.",
      categoriesDescription: "카테고리는 좁게 유지해 발견을 돕고, 너무 많은 분류로 쪼개지지 않게 한다.",
      spotlightEyebrow: "빌더 스포트라이트",
      spotlightTitle: "프로젝트만이 아니라 사람을 팔로우한다.",
      spotlightDescription: "크리에이터 페이지는 이 제품이 링크 디렉토리로 무너지지 않게 만드는 신뢰 레이어다.",
      viewAllCollections: "컬렉션 전체 보기"
    },
    creatorsPage: {
      eyebrow: "빌더",
      title: "프로젝트 뒤에 있는 사람을 탐색한다.",
      description: "크리에이터 프로필은 신뢰 레이어다. 한 사람의 지속성, 취향, 작업 방향을 보여준다."
    },
    collectionsPage: {
      eyebrow: "컬렉션",
      title: "맥락이 먼저 필요한 빌더를 위한 에디토리얼 플레이리스트.",
      description: "MVP의 컬렉션은 개인 북마크가 아니라, 왜 이 프로젝트들이 함께 보여야 하는지 설명하는 편집 레이어다."
    },
    aboutPage: {
      eyebrow: "미션",
      title: "이제 개발자도 크리에이터다.",
      description:
        "이 플랫폼은 GitHub를 대체하지 않으면서도 오픈소스를 더 쉽게 발견하고 이해하고 재사용하게 만들기 위해 존재한다.",
      paragraph1:
        "핵심 약속은 단순하다. 누가 만들었는지, 무엇을 해결하는지, 왜 중요한지, 지금도 살아 있는지, 현실적으로 참고 가능한지를 보여주는 것이다.",
      paragraph2:
        "그래서 인터페이스는 README 덤프나 저장소 잡정보보다 크리에이터, 에디토리얼 컬렉션, 맥락 메타데이터를 우선한다."
    },
    notFound: {
      eyebrow: "찾을 수 없음",
      title: "이 페이지는 카탈로그 바깥으로 흘러갔다.",
      description: "오래된 URL 대신 메인 탐색 화면에서 다시 찾아보는 편이 낫다.",
      explore: "프로젝트 탐색",
      creators: "빌더 보기"
    },
    cards: {
      editorialCollection: "에디토리얼 컬렉션",
      picks: "선정",
      curatedBy: "큐레이션",
      projects: "프로젝트",
      followers: "팔로워",
      claimed: "클레임됨",
      recommended: "추천 등록",
      unclaimed: "미클레임",
      openProject: "프로젝트 열기",
      updated: "업데이트",
      demo: "데모",
      docs: "문서",
      github: "GitHub"
    },
    engagement: {
      save: "저장",
      like: "좋아요",
      follow: "팔로우",
      failed: "동작을 처리하지 못했다."
    },
    explorePage: {
      eyebrow: "탐색",
      title: "크리에이터, 문제, 카테고리 기준으로 찾는다.",
      description: "등록은 열려 있어도 노출은 선별적이다. 얇거나 오래된 프로젝트는 보이되 메인을 장악하지 못한다.",
      resultsEyebrow: "검색 결과",
      resultsTitlePrefix: "\"",
      resultsTitleSuffix: "\" 검색 결과",
      resultsDescription: "검색은 키워드 일치에 크리에이터 맥락과 큐레이션 신호를 더한다.",
      noResultsTitle: "바로 맞는 결과가 아직 없다",
      noResultsDescription: "더 넓은 카테고리나 빌더 이름, 혹은 Next.js, automation 같은 스택 용어로 시도해 보라.",
      browseEyebrow: "탐색 화면",
      browseTitle: "저장소 소음이 아니라 재사용 가치 기준으로 정렬된 프로젝트.",
      browseDescription: "상태, 저장 의도, 신선도, 크리에이터 명확성이 무엇이 올라오는지 결정한다.",
      creatorsEyebrow: "빌더",
      creatorsTitle: "탐색 안에서도 사람 중심 구조를 유지한다.",
      creatorsDescription: "프로젝트 카드만 보다가 끝나지 않도록 빌더를 함께 드러낸다."
    },
    savedPage: {
      eyebrow: "저장됨",
      anonymousTitle: "저장 라이브러리는 로그인 후부터 살아난다.",
      anonymousDescription: "비로그인 상태에서도 둘러볼 수 있지만, 저장/좋아요/팔로우는 GitHub 로그인 이후에 유지된다.",
      continue: "GitHub로 계속하기",
      emptyTitle: "아직 저장한 항목이 없다",
      emptyDescription: "로그인 후에는 저장한 프로젝트와 팔로우한 빌더를 다시 여는 기본 화면이 된다.",
      signedInTitlePrefix: "",
      signedInTitleSuffix: "님의 다시 보는 목록",
      signedInDescription: "저장한 프로젝트와 팔로우한 빌더는 현재 데모 세션에 묶여 유지된다.",
      savedProjectsEyebrow: "저장한 프로젝트",
      savedProjectsTitle: "다시 열어볼 가치가 있는 프로젝트.",
      savedProjectsDescription: "홈, 탐색, 상세에서 누른 저장 동작이 이곳으로 모인다.",
      noSavedProjectsTitle: "저장한 프로젝트가 아직 없다",
      noSavedProjectsDescription: "홈, 탐색, 상세에서 프로젝트를 저장해 나중에 다시 볼 경로를 만들어라.",
      followedCreatorsEyebrow: "팔로우한 빌더",
      followedCreatorsTitle: "계속 지켜보기로 한 사람들.",
      followedCreatorsDescription: "팔로우는 일반 소셜 기능이 아니라 크리에이터 중심 재방문 루프다."
    },
    submitPage: {
      eyebrow: "레포 추천 등록",
      title: "열린 추천 등록, 통제된 공개 노출.",
      description: "GitHub 로그인 사용자는 누구나 공개 레포를 추천할 수 있지만, 노출은 중복 검사와 상태, 점수 기준으로 제어된다."
    },
    recommendForm: {
      repoUrl: "공개 GitHub 레포 URL",
      context: "맥락 필드",
      category: "카테고리",
      claimStatus: "클레임 상태",
      recommendOption: "지금은 추천 등록, 나중에 제작자 클레임",
      creatorOption: "내가 원래 제작자다",
      helperLoggedOut: "로그인 후 추천 등록이 저장된다. 지금 실행하면 로그인 화면으로 이동한다.",
      helperLoggedInPrefix: "현재 ",
      helperLoggedInSuffix: " 로 로그인된 상태다.",
      submit: "가져오기 검사 실행",
      submitting: "검사 중...",
      nextTitle: "다음 단계",
      step1: "GitHub URL을 정규화하고 canonical repository ID를 확인한다.",
      step2: "중복을 검사하고 이미 있는 경우 기존 프로젝트에 추천 기록만 붙인다.",
      step3: "메타데이터 sync와 초기 점수 계산을 대기열에 넣는다.",
      step4: "공개 노출은 등록순이 아니라 상태, 품질 신호, 신선도로 결정된다.",
      existing: "기존 프로젝트가 발견됐다",
      accepted: "가져오기 미리보기가 접수됐다",
      duplicateMessagePrefix: "이 레포는 이미 ",
      duplicateMessageMiddle: " 로 등록되어 있다. 다음 단계는 중복 공개가 아니라 클레임 또는 추가 큐레이션이다.",
      initialStatus: "초기 상태",
      invalidUrl: "유효한 공개 GitHub 레포 URL을 입력해 달라.",
      needLogin: "레포를 추천하려면 로그인이 필요하다."
    },
    authPage: {
      eyebrow: "GitHub 로그인",
      title: "신뢰의 시작은 GitHub 계정이다.",
      description: "MVP는 GitHub 로그인만 사용한다. 추천 등록, 클레임, 작성자 귀속이 같은 신뢰 기준 위에 놓인다.",
      continueAsPrefix: "@",
      continueAsSuffix: " 로 계속하기",
      helper: "실제 GitHub OAuth는 아직 연결되지 않았다. 지금은 저장, 좋아요, 팔로우, 추천 등록, 클레임 흐름을 확인할 수 있는 데모 세션을 시작한다.",
      back: "추천 등록 화면으로 돌아가기"
    },
    projectDetail: {
      eyebrow: "프로젝트 상세",
      creatorContext: "크리에이터 맥락",
      metadataEyebrow: "메타데이터",
      metadataTitle: "열어볼 가치가 있는지 판단할 만큼만 보여준다.",
      metadataDescription: "MVP에서는 원시 저장소 메타데이터를 보조 정보로만 유지한다.",
      featuredEyebrow: "이 컬렉션에 포함됨",
      featuredTitle: "이 프로젝트를 다른 맥락 안에 놓는 컬렉션.",
      featuredDescription: "컬렉션은 왜 이 프로젝트가 더 넓은 패턴 안에서 중요한지 설명한다.",
      moreEyebrow: "이 빌더의 다른 작업",
      moreTitlePrefix: "",
      moreTitleSuffix: "의 다른 작업",
      moreDescription: "사람 중심 탐색은 같은 빌더의 다음 프로젝트로 이어질 때 더 강해진다.",
      claimEyebrow: "클레임 흐름",
      claimTitle: "이 프로젝트는 아직 원래 제작자의 클레임을 기다리고 있다.",
      claimDescription: "클레임은 추천자와 실제 제작자를 분리해 귀속을 깔끔하게 유지한다.",
      claimedByCreator: "원 제작자가 클레임 완료",
      claimOpen: "커뮤니티 추천 등록 상태, 클레임 열려 있음",
      projectsInProfile: "프로필 내 프로젝트",
      followers: "팔로워",
      visitProfile: "크리에이터 프로필 보기",
      openGitHub: "GitHub 열기",
      viewDemo: "데모 보기",
      readDocs: "문서 읽기",
      nextClaimStep: "최종 GitHub 증명과 관리자 검토는 다음 구현 단계에 남겨 두었다."
    },
    creatorDetail: {
      eyebrow: "크리에이터 프로필",
      signals: "신호",
      verified: "GitHub 로그인으로 검증된 프로필",
      unclaimed: "아직 클레임되지 않은 프로필 셸",
      externalLink: "외부 링크",
      featuredEyebrow: "대표 프로젝트",
      featuredTitle: "이 빌더의 관점을 가장 잘 보여주는 작업.",
      featuredDescription: "프로젝트는 개별적으로 읽히되, 함께 모이면 하나의 크리에이터 정체성이 된다.",
      collectionsEyebrow: "컬렉션",
      collectionsTitle: "이 빌더의 작업이 포함된 에디토리얼 맥락.",
      collectionsDescription: "컬렉션은 발견을 돕지만 크리에이터 프로필을 대체하지 않는다."
    },
    collectionDetail: {
      eyebrow: "에디토리얼 컬렉션",
      whyTitle: "왜 이 컬렉션이 존재하는가",
      whyDescription:
        "MVP의 컬렉션은 에디터 전용이다. 개인 북마크가 아니라 프로젝트들을 함께 보여야 하는 이유를 설명하는 역할을 맡는다.",
      recommend: "에디토리얼 검토용으로 다른 레포 추천하기",
      projectsEyebrow: "이 컬렉션의 프로젝트",
      projectsTitle: "키워드 우연이 아니라 재사용 가치로 묶인 프로젝트.",
      projectsDescription: "컬렉션 포함은 발견성을 높이지만, 소유권이나 작성자 귀속을 바꾸지 않는다."
    },
    claimButton: {
      start: "클레임 요청 시작",
      submitting: "클레임 요청 중...",
      recorded: "이 데모 세션에서 이미 클레임 요청이 기록되어 있다.",
      success: "클레임 요청이 기록됐다. 관리자 검토와 GitHub 증명은 다음 구현 단계다.",
      failed: "클레임 요청을 만들지 못했다."
    }
  },
  en: {},
  ja: {},
  zh: {}
};

// Copy Korean defaults into other locales first, then override.
dictionaries.en = {
  ...dictionaries.ko,
  metadataTitle: "Build Like a Creator",
  metadataDescription:
    "A creator-first curation platform for developer tools, experiments, workflows, and open-source projects.",
  nav: {
    explore: "Explore",
    creators: "Creators",
    collections: "Collections",
    saved: "Saved",
    recommend: "Recommend a Repo",
    login: "GitHub Login",
    logout: "Log out"
  },
  brand: {
    title: "Build Like a Creator",
    tagline: "Discover living projects, not dry repositories."
  },
    locale: { label: "Language" },
    sidebar: {
      searchLabel: "Search",
      discoverLabel: "Discover",
      recommendedCategories: "Recommended Categories",
      recommendedCreators: "Recommended Creators",
      loginPrompt: "Sign in to start saving and following",
      loggedInAs: "Current session",
      quickAccess: "Quick Access"
    },
  footer: {
    tagline: "Creator-first curation layer for developers. GitHub remains the source of code.",
    about: "About",
    collections: "Collections",
    recommend: "Recommend"
  },
  search: {
    placeholder: "Search projects, creators, collections...",
    button: "Search"
  },
  filter: {
    all: "All",
    trending: "Trending",
    newest: "Newest",
    mostSaved: "Most saved"
  },
  hero: {
    eyebrow: "Developer creators are not invisible anymore",
    title: "Discover tools, experiments, and workflows with the creator context still attached.",
    description:
      "This platform is a curation layer over GitHub. It highlights who built something, what problem it solves, why it matters, and whether it is still alive enough to reuse.",
    browseTrending: "Browse trending",
    viewEditorPicks: "View editor picks",
    recommendRepo: "Recommend a repo"
  },
  home: {
    editorialEyebrow: "Editorial Collections",
    editorialTitle: "Start with curation that already has a point of view.",
    editorialDescription: "Collections explain why a project is worth opening before you disappear into the repo.",
    featuredEyebrow: "Featured Projects",
    featuredTitle: "Creator context comes before GitHub links.",
    featuredDescription: "Each project is framed around who built it and why it matters.",
    trendingEyebrow: "Trending Now",
    trendingTitle: "Signal-rich projects builders are saving right now.",
    trendingDescription: "Ranking favors context, freshness, and reuse value over raw repository age.",
    categoriesEyebrow: "Categories",
    categoriesTitle: "Browse by intent, not by raw repo type.",
    categoriesDescription: "Categories stay narrow enough to guide discovery without exploding the catalog.",
    spotlightEyebrow: "Creator Spotlight",
    spotlightTitle: "Follow builders, not just projects.",
    spotlightDescription: "Creator pages are the trust layer that keeps the product from flattening into a repo directory.",
    viewAllCollections: "View all collections"
  },
  creatorsPage: {
    eyebrow: "Creators",
    title: "Browse the builders behind the projects.",
    description: "Creator profiles are the trust layer. They show continuity, taste, and direction."
  },
  collectionsPage: {
    eyebrow: "Collections",
    title: "Editorial playlists for builders who want context first.",
    description: "Collections in MVP are editorial frames, not personal bookmarks."
  },
  aboutPage: {
    eyebrow: "Mission",
    title: "Developers are creators now.",
    description:
      "This platform exists to make open-source projects more discoverable, more understandable, and more reusable without trying to replace GitHub itself.",
    paragraph1:
      "The core promise is simple: show who made something, what it solves, why it matters, whether it is still alive, and whether a builder can realistically learn from it.",
    paragraph2:
      "That means the interface privileges creators, editorial collections, and contextual metadata over README dumps and repository trivia."
  },
  notFound: {
    eyebrow: "Not Found",
    title: "That page drifted out of the catalog.",
    description: "Try browsing the main discovery surfaces instead of a stale URL.",
    explore: "Explore projects",
    creators: "Browse creators"
  },
  cards: {
    editorialCollection: "Editorial Collection",
    picks: "picks",
    curatedBy: "Curated by",
    projects: "projects",
    followers: "followers",
    claimed: "Claimed",
    recommended: "Recommended",
    unclaimed: "Unclaimed",
    openProject: "Open project",
    updated: "Updated",
    demo: "Demo",
    docs: "Docs",
    github: "GitHub"
  },
  engagement: {
    save: "Save",
    like: "Like",
    follow: "Follow",
    failed: "Action failed."
  },
  explorePage: {
    eyebrow: "Explore",
    title: "Search by creator, problem, or category.",
    description: "Browse remains selective even with open intake. Thin or stale projects stay visible without dominating the surface.",
    resultsEyebrow: "Search Results",
    resultsTitlePrefix: "Results for \"",
    resultsTitleSuffix: "\"",
    resultsDescription: "Search combines lexical matching with creator and curation context.",
    noResultsTitle: "No direct matches yet",
    noResultsDescription: "Try a broader category, a creator name, or a stack term like Next.js or automation.",
    browseEyebrow: "Browse Surface",
    browseTitle: "Projects ranked for reuse, not for raw repository noise.",
    browseDescription: "Status, saved intent, freshness, and creator clarity determine what rises.",
    creatorsEyebrow: "Creators",
    creatorsTitle: "People-first discovery remains visible inside Explore.",
    creatorsDescription: "Explore should not trap users inside project cards without showing the builders behind them."
  },
  savedPage: {
    eyebrow: "Saved",
    anonymousTitle: "Your save library stays quiet until you decide to sign in.",
    anonymousDescription: "Anonymous users can browse freely. Persistent saves, likes, and follows start after GitHub login.",
    continue: "Continue with GitHub",
    emptyTitle: "No saved items yet",
    emptyDescription: "Once signed in, this becomes the return path for saved projects and followed creators.",
    signedInTitlePrefix: "Your return path, ",
    signedInTitleSuffix: "",
    signedInDescription: "Saved projects and followed creators stay tied to your current demo session.",
    savedProjectsEyebrow: "Saved Projects",
    savedProjectsTitle: "Projects worth reopening.",
    savedProjectsDescription: "These come from the same save actions available on cards and detail pages.",
    noSavedProjectsTitle: "No saved projects yet",
    noSavedProjectsDescription: "Save a project from Home, Explore, or a detail page to build a return path.",
    followedCreatorsEyebrow: "Followed Creators",
    followedCreatorsTitle: "Builders you decided to track.",
    followedCreatorsDescription: "Following is the creator-first retention loop, not a generic social graph."
  },
  submitPage: {
    eyebrow: "Recommend a Repo",
    title: "Open recommendation intake, controlled public discovery.",
    description: "Anyone with GitHub login can recommend a public repo, but visibility is still governed by dedupe, status, and score."
  },
  recommendForm: {
    repoUrl: "Public GitHub repo URL",
    context: "Context field",
    category: "Category",
    claimStatus: "Claim status",
    recommendOption: "Recommend now, creator claims later",
    creatorOption: "I am the original creator",
    helperLoggedOut: "Recommendations are stored after login. If you submit now, you will be routed to login.",
    helperLoggedInPrefix: "Currently signed in as ",
    helperLoggedInSuffix: ".",
    submit: "Run import check",
    submitting: "Running import check...",
    nextTitle: "What happens next",
    step1: "Normalize the GitHub URL and resolve the canonical repository ID.",
    step2: "Check duplicates and attach a submission record if the repo already exists.",
    step3: "Queue metadata sync and initial scoring.",
    step4: "Public ranking depends on status, quality signals, and freshness instead of submission time.",
    existing: "Existing project found",
    accepted: "Import preview accepted",
    duplicateMessagePrefix: "This repo already exists as ",
    duplicateMessageMiddle: ". The next step is claim or follow-up curation, not duplicate publication.",
    initialStatus: "Initial status",
    invalidUrl: "Please enter a valid public GitHub repository URL.",
    needLogin: "Login is required before recommending a repo."
  },
  authPage: {
    eyebrow: "GitHub Login",
    title: "Identity starts with your GitHub account.",
    description: "MVP uses GitHub login only so recommendation, claim, and attribution all share one trust baseline.",
    continueAsPrefix: "Continue as @",
    continueAsSuffix: "",
    helper: "Real GitHub OAuth is not wired yet. This page starts a demo session for save, like, follow, recommend, and claim flows.",
    back: "Or go back to recommending a repo"
  },
  projectDetail: {
    eyebrow: "Project Detail",
    creatorContext: "Creator Context",
    metadataEyebrow: "Metadata",
    metadataTitle: "Just enough metadata to decide if this is worth opening.",
    metadataDescription: "MVP keeps raw repository metadata secondary and readable.",
    featuredEyebrow: "Featured In",
    featuredTitle: "Collections that place this project in a broader pattern.",
    featuredDescription: "Collections explain why this project matters in a wider context.",
    moreEyebrow: "More From This Creator",
    moreTitlePrefix: "Other work from ",
    moreTitleSuffix: "",
    moreDescription: "People-first discovery gets stronger when the next click is another project by the same builder.",
    claimEyebrow: "Claim Flow",
    claimTitle: "This project is still waiting for the original builder to claim it.",
    claimDescription: "Claim keeps attribution clean by separating who recommended a repo from who actually built it.",
    claimedByCreator: "Claimed by original creator",
    claimOpen: "Recommended by community, claim still open",
    projectsInProfile: "projects in profile",
    followers: "followers",
    visitProfile: "Visit creator profile",
    openGitHub: "Open GitHub",
    viewDemo: "View demo",
    readDocs: "Read docs",
    nextClaimStep: "Final GitHub proof and admin review live in the next implementation step."
  },
  creatorDetail: {
    eyebrow: "Creator Profile",
    signals: "Signals",
    verified: "Verified through GitHub login",
    unclaimed: "Unclaimed profile shell",
    externalLink: "External link",
    featuredEyebrow: "Featured Projects",
    featuredTitle: "Work that defines this builder's point of view.",
    featuredDescription: "Projects stay readable individually, but together they form a coherent creator identity.",
    collectionsEyebrow: "Collections",
    collectionsTitle: "Editorial frames that include this creator's work.",
    collectionsDescription: "Collections help discovery without replacing the creator profile."
  },
  collectionDetail: {
    eyebrow: "Editorial Collection",
    whyTitle: "Why this collection exists",
    whyDescription:
      "Collections are editorial only in MVP. They explain why these projects belong together instead of acting like personal bookmark folders.",
    recommend: "Recommend another repo for editorial review",
    projectsEyebrow: "Projects In This Collection",
    projectsTitle: "Projects grouped by reuse value, not by keyword coincidence.",
    projectsDescription: "Collection placement boosts discovery, but does not change ownership or creator attribution."
  },
  claimButton: {
    start: "Start claim request",
    submitting: "Submitting claim...",
    recorded: "Claim request already recorded for this demo session.",
    success: "Claim request recorded. Admin review and GitHub proof stay as the next implementation step.",
    failed: "Claim request could not be created."
  }
};

dictionaries.ja = {
  ...dictionaries.en,
  metadataTitle: "開発者もクリエイターになる時代",
  metadataDescription:
    "開発ツール、実験、ワークフロー、オープンソースを人中心で発見できるクリエイター型キュレーションプラットフォーム。",
  nav: {
    explore: "探索",
    creators: "クリエイター",
    collections: "コレクション",
    saved: "保存済み",
    recommend: "リポジトリ推薦",
    login: "GitHub ログイン",
    logout: "ログアウト"
  },
  locale: { label: "言語" }
  ,
  sidebar: {
    searchLabel: "検索",
    discoverLabel: "探索",
    recommendedCategories: "おすすめカテゴリー",
    recommendedCreators: "おすすめクリエイター",
    loginPrompt: "ログインして保存とフォローを始めましょう",
    loggedInAs: "現在のセッション",
    quickAccess: "クイックアクセス"
  }
};

dictionaries.zh = {
  ...dictionaries.en,
  metadataTitle: "开发者也是创作者的时代",
  metadataDescription:
    "以创作者为中心，帮助发现开发工具、实验项目、工作流和开源作品的策展平台。",
  nav: {
    explore: "探索",
    creators: "创作者",
    collections: "合集",
    saved: "已保存",
    recommend: "推荐仓库",
    login: "GitHub 登录",
    logout: "退出登录"
  },
  locale: { label: "语言" }
  ,
  sidebar: {
    searchLabel: "搜索",
    discoverLabel: "探索",
    recommendedCategories: "推荐分类",
    recommendedCreators: "推荐创作者",
    loginPrompt: "登录后即可开始保存和关注",
    loggedInAs: "当前会话",
    quickAccess: "快捷入口"
  }
};

export type Dictionary = (typeof dictionaries)["ko"];

export function isSupportedLocale(value?: string | null): value is Locale {
  return Boolean(value && supportedLocales.includes(value as Locale));
}

export function getDictionaryForLocale(locale: Locale): Dictionary {
  return dictionaries[locale] as Dictionary;
}

export function getLocaleLabel(locale: Locale) {
  return localeLabels[locale];
}

export function localizeCategory(locale: Locale, categorySlugOrName: string) {
  const slug =
    (categorySlugOrName in categoryLabelMap
      ? categorySlugOrName
      : categoryLookupByName[categorySlugOrName]) as keyof typeof categoryLabelMap | undefined;

  if (!slug) {
    return categorySlugOrName;
  }

  return categoryLabelMap[slug][locale];
}

export function localizeContextualLabel(locale: Locale, label: string) {
  return contextualLabelMap[label as keyof typeof contextualLabelMap]?.[locale] ?? label;
}

export function localizeProjectStatus(locale: Locale, status: ProjectStatus) {
  return projectStatusMap[status][locale];
}

export function localizeResultKind(
  locale: Locale,
  kind: keyof typeof resultKindMap
) {
  return resultKindMap[kind][locale];
}
