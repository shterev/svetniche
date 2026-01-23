# Cursor Development Rules

This project uses comprehensive development rules imported from the weather-ui project to ensure code quality, consistency, and best practices.

## 📁 Rule Structure

All rules are organized in the `.cursor/` directory:

```
.cursor/
├── index.mdc              # Combined rule index
└── rules/
    ├── component-architecture.mdc
    ├── code-quality.mdc
    ├── error-handling.mdc
    ├── hook-structure.mdc
    ├── mui-api-verification.mdc
    ├── single-responsibility.mdc
    └── testing.mdc
```

## 🎯 Rule Categories

### 1. Component Architecture
**File**: `.cursor/rules/component-architecture.mdc`

Every component MUST follow this structure:
```
src/components/
├── ComponentName/
│   ├── index.ts              # Barrel export
│   └── ComponentName.tsx     # Implementation
```

**Sub-components** (only used by parent):
```
src/components/
├── Dashboard/
│   ├── index.ts
│   ├── Dashboard.tsx
│   └── components/           # Sub-components folder
│       └── Header/
│           ├── index.ts
│           └── Header.tsx
```

**Key Rules:**
- ✅ Always create a folder for every component (PascalCase)
- ✅ Always include `index.ts` with barrel exports
- ❌ Never place `.tsx` files directly in `components/` folder

### 2. Code Quality
**File**: `.cursor/rules/code-quality.mdc`

**Key Principles:**
- Always look for existing code to iterate on
- Keep It Simple, Stupid (KISS)
- Use short arrow function syntax: `(arg) => value` not `(arg) => { return value; }`
- Never use `any` type in TypeScript
- Clean up unused imports and code
- Keep files under 200-300 lines
- One file, one responsibility

### 3. Error Handling
**File**: `.cursor/rules/error-handling.mdc`

**CRITICAL: Use `to` function instead of try-catch**

```typescript
import { to } from '@mrspartak/promises';

const [error, result] = await to(someAsyncOperation());
if (error) {
  console.error('Error description:', error);
  // handle error
}
```

**Rules:**
- ✅ Always use `to` from @mrspartak/promises
- ✅ Always use async/await (not .then/.catch)
- ❌ Never use try-catch blocks

### 4. MUI API Verification
**File**: `.cursor/rules/mui-api-verification.mdc`

**CRITICAL Rules for Material-UI:**
- Always verify MUI component APIs via MUI MCP before use
- Never assume component props based on old documentation
- **NEVER use `<Box display="flex">`** - always use `<Stack>` instead
- Prefer `Stack` over `Grid` for layouts

```tsx
// ❌ WRONG: Box with display="flex"
<Box display="flex" justifyContent="center" gap={2}>
  <Component1 />
  <Component2 />
</Box>

// ✅ CORRECT: Use Stack
<Stack justifyContent="center" gap={2}>
  <Component1 />
  <Component2 />
</Stack>
```

### 5. Single Responsibility
**File**: `.cursor/rules/single-responsibility.mdc`

**Each utility in its own folder:**
```
src/utils/
├── formatDate/
│   ├── index.ts              # export { formatDate } from './formatDate';
│   └── formatDate.ts         # Implementation
├── formatTime/
│   ├── index.ts
│   └── formatTime.ts
└── index.ts                  # Root exports
```

**Key Rules:**
- Use **camelCase** for utility folders (not PascalCase)
- Each utility has its own folder with `index.ts`
- Two-level index files (utility-level + root-level)
- Separate types into dedicated files

### 6. Hook Structure
**File**: `.cursor/rules/hook-structure.mdc`

**One hook per folder:**
```
src/hooks/
├── useGeolocation/
│   ├── index.ts
│   └── useGeolocation.ts
├── useWeatherForecast/
│   ├── index.ts
│   └── useWeatherForecast.ts
```

**Key Rules:**
- Each hook in its own camelCase folder
- Hook names start with "use"
- Include `index.ts` for barrel exports
- Consistent with components and utils structure

### 7. Testing
**File**: `.cursor/rules/testing.mdc`

**Test structure:**
```
src/hooks/
  useGeolocation/
    __tests__/
      useGeolocation.test.ts    # Test file
    useGeolocation.ts            # Source file
    index.ts
```

**Key Rules:**
- ✅ Always create `__tests__` folder in same directory as source
- ✅ Test file name matches source file with `.test.ts` extension
- ✅ Use Vitest (not Jest) and @testing-library
- Test happy path, error cases, and edge cases
- Use `describe` blocks to group related tests
- Use clear, descriptive test names

## 🚀 Quick Checklist

### Creating a Component
- [ ] Create PascalCase folder in `src/components/`
- [ ] Add `index.ts` with barrel exports
- [ ] Add `ComponentName.tsx` with implementation
- [ ] Use TypeScript with proper typing
- [ ] Verify MUI component APIs before use
- [ ] Use `Stack` instead of `Box display="flex"`

### Creating a Utility
- [ ] Create camelCase folder in `src/utils/`
- [ ] Add `index.ts` with barrel export
- [ ] Add implementation file matching folder name
- [ ] Update root `src/utils/index.ts` to re-export
- [ ] Use `to` function for error handling

### Creating a Hook
- [ ] Create camelCase folder in `src/hooks/` starting with "use"
- [ ] Add `index.ts` with barrel export
- [ ] Add hook implementation file
- [ ] Follow same structure as components/utils

### Writing Tests
- [ ] Create `__tests__` folder next to source file
- [ ] Name test file matching source with `.test.ts`
- [ ] Use Vitest and @testing-library
- [ ] Test happy path, errors, and edge cases
- [ ] Use `describe` and clear test names

## 📚 Benefits

These rules provide:
- **Consistency** - Same patterns across components, hooks, and utils
- **Scalability** - Easy to add tests, types, or helpers per module
- **Maintainability** - Clear boundaries and single responsibilities
- **Quality** - TypeScript, testing, and error handling best practices
- **Team Collaboration** - Reduced merge conflicts and easier code reviews

## 🔍 Finding Rules

- **Quick reference**: See `.cursor/index.mdc`
- **Detailed rules**: See individual files in `.cursor/rules/`
- **Main index**: See `.cursorrules` in project root

---

**These rules are automatically applied by Cursor based on file type and context.**
