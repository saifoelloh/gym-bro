---
description: Checklist for reviewing code changes in the Gym Tracker project
---

1. **Architecture**: Does it follow the 4-layer pattern (DB -> API -> Hook -> UI)?
2. **Types**: Are types from `src/types/index.ts` being used? No `any` types allowed.
3. **Security**: Is RLS enabled on new tables? Are API routes secured with `auth.getUser()`?
4. **Performance**: Are expensive components using `React.memo`? Are searches debounced?
5. **UI/UX**: Does it follow the Design System? Are touch targets at least 44pt?
6. **AI Context**: Do `.agents/rules.md` or `schema-snapshot.md` need updates?
