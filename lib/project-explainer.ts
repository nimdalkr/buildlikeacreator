import type { Locale } from "@/lib/i18n";
import type { Project } from "@/lib/types";

function includesAny(haystack: string, needles: string[]) {
  return needles.some((needle) => haystack.includes(needle));
}

export function getSimpleProjectDescription(project: Project, locale: Locale) {
  const text = [
    project.title,
    project.summary,
    project.contextualText,
    project.primaryCategory,
    project.language,
    ...(project.tags ?? [])
  ]
    .join(" ")
    .toLowerCase();

  const ko = (() => {
    if (includesAny(text, ["playwright", "browser", "testing", "test automation"])) {
      return "웹사이트를 자동으로 테스트하는 브라우저 테스트 도구";
    }

    if (includesAny(text, ["agent", "agents", "llm", "orchestration", "autogen", "crewai"])) {
      return "AI 에이전트와 LLM 워크플로우를 만들고 연결하는 도구";
    }

    if (includesAny(text, ["automation", "workflow", "integration", "zapier", "n8n", "activepieces"])) {
      return "반복 작업을 자동화하는 워크플로우 도구";
    }

    if (includesAny(text, ["starter", "template", "boilerplate", "create-t3-app"])) {
      return "새 프로젝트를 빠르게 시작하게 해주는 스타터 킷";
    }

    if (includesAny(text, ["ui", "component", "design system", "shadcn"])) {
      return "화면을 빠르게 만들 수 있게 해주는 UI 컴포넌트 도구";
    }

    if (includesAny(text, ["framework", "next.js", "react framework"])) {
      return "웹 서비스를 만들 때 쓰는 프레임워크";
    }

    if (includesAny(text, ["analytics", "dashboard", "visualization"])) {
      return "데이터를 보고 분석하는 대시보드형 도구";
    }

    if (includesAny(text, ["cli", "command line"])) {
      return "터미널에서 쓰는 개발자용 명령줄 도구";
    }

    return "개발 작업을 더 빠르게 해주는 오픈소스 도구";
  })();

  const en = (() => {
    if (includesAny(text, ["playwright", "browser", "testing", "test automation"])) {
      return "A browser testing tool for automating website tests";
    }

    if (includesAny(text, ["agent", "agents", "llm", "orchestration", "autogen", "crewai"])) {
      return "A tool for building AI agent and LLM workflows";
    }

    if (includesAny(text, ["automation", "workflow", "integration", "zapier", "n8n", "activepieces"])) {
      return "A workflow tool for automating repetitive work";
    }

    if (includesAny(text, ["starter", "template", "boilerplate", "create-t3-app"])) {
      return "A starter kit for launching new projects faster";
    }

    if (includesAny(text, ["ui", "component", "design system", "shadcn"])) {
      return "A UI component tool for building interfaces faster";
    }

    if (includesAny(text, ["framework", "next.js", "react framework"])) {
      return "A framework for building web products";
    }

    if (includesAny(text, ["analytics", "dashboard", "visualization"])) {
      return "A dashboard-style tool for viewing and analyzing data";
    }

    if (includesAny(text, ["cli", "command line"])) {
      return "A command-line tool for developers";
    }

    return "An open-source tool that helps developers ship faster";
  })();

  return locale === "ko" ? ko : en;
}
