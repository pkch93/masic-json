# magic-json | Always JSON. Format it, see it, query it.

한국어 | [English](README.md)

**magic-json**는 JSON 데이터를 쉽고 빠르게 다룰 수 있는 데스크탑 앱입니다.

개발자, 데이터 분석가, QA 엔지니어 등 JSON을 자주 접하는 분들을 위해 만들어졌습니다. API 응답 확인, 설정 파일 편집, 데이터 구조 파악 등 JSON을 다루는 모든 순간에 활용할 수 있습니다.

복잡하게 뭉쳐있는 JSON을 한 번에 보기 좋게 정렬하거나, 트리 구조로 시각화하고, JSONPath 쿼리로 원하는 값만 빠르게 추출할 수 있습니다. Command Palette(`Shift × 2`)로 모든 기능에 키보드만으로 접근할 수 있어 작업 흐름을 끊지 않고 사용할 수 있습니다.

## 주요 기능

| 기능 | 설명 |
|---|---|
| **Format / Minify** | JSON을 들여쓰기 형태로 보기 좋게 펼치거나 한 줄로 압축 |
| **Tree View** | JSON 구조를 접고 펼칠 수 있는 트리 형태로 시각화 |
| **JSONPath Query** | 표현식을 입력해 중첩된 JSON에서 원하는 값만 추출 |
| **Sort** | JSON의 모든 키를 알파벳 순으로 정렬 |
| **Command Palette** | `Shift × 2`로 모든 기능에 빠르게 접근 |
| **History** | 이전 Format / Minify 작업 이력을 저장하고 다시 불러오기 |
| **Key Mapping** | 단축키를 원하는 대로 커스터마이징 |
| **Dark / Light Mode** | 다크 / 라이트 테마 전환 |

## 기본 단축키

| 동작 | macOS | Windows / Linux |
|---|---|---|
| Command Palette 열기 | `Shift × 2` | `Shift × 2` |
| JSON 포맷 | `⇧F` | `Shift+F` |
| JSON 압축 | `⇧M` | `Shift+M` |
| 에디터 초기화 | `⇧C` | `Shift+C` |
| 찾기 | `⌘F` | `Ctrl+F` |
| 에디터 포커스 | `Enter` | `Enter` |
| Tree View | `F1` | `F1` |
| JSON Path | `F2` | `F2` |
| 정렬 | `F3` | `F3` |

단축키는 Settings → Key Mapping 패널에서 변경할 수 있습니다.

---

## Quick Start

### 다운로드

[GitHub Releases](https://github.com/pkch93/magic-json/releases) 페이지에서 운영체제에 맞는 설치 파일을 내려받으세요.

| 운영체제 | 설치 파일 |
|---|---|
| macOS | `.dmg` |
| Windows | `.exe` |
| Linux | `.AppImage` |

### 설치 방법

**macOS**
1. `.dmg` 파일을 열고 `magic-json`을 Applications 폴더로 드래그합니다.
2. 처음 실행 시 "확인되지 않은 개발자" 경고가 뜨면 시스템 환경설정 → 개인 정보 보호 및 보안에서 허용합니다.

**Windows**
1. `.exe` 설치 파일을 실행하고 안내에 따라 설치합니다.

**Linux**
1. `.AppImage` 파일에 실행 권한을 부여한 뒤 실행합니다.
   ```bash
   chmod +x magic-json-*.AppImage
   ./magic-json-*.AppImage
   ```

---

## 개발자를 위한 안내

로컬에서 직접 실행하거나 빌드하려면 [Node.js](https://nodejs.org/)와 [pnpm](https://pnpm.io/)이 필요합니다.

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

```bash
# 플랫폼별 빌드
pnpm build:mac
pnpm build:win
pnpm build:linux
```

**Tech Stack**: Electron v39 · React v19 · TypeScript v5 · electron-vite · CodeMirror 6 · jsonpath-plus

## License

[MIT](LICENSE)
