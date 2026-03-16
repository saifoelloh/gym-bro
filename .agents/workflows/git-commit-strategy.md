---
description: How to maintain a clean and standard Git history
---

# Git Commit Strategy Workflow

Maintain a clean, readable, and machine-parseable history by following these guidelines.

## 1. Structure (Conventional Commits)
Use the following format for every commit:
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: (CORRELATES TO MINOR) A new feature.
- `fix`: (CORRELATES TO PATCH) A bug fix.
- `docs`: Documentation only changes.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `build`: Changes that affect the build system or external dependencies.
- `ci`: Changes to CI configuration files and scripts.
- `chore`: Other changes that don't modify src or test files.
- `revert`: Reverts a previous commit.

### Scope
Optional but recommended for large repos (e.g., `feat(api)`, `fix(ui)`).

## 2. Best Practices
- **Atomic Commits**: 
    - Keep each commit focused on one logical change.
    - If you find yourself using "and" in the message (e.g., "Fix login and update CSS"), it should probably be two commits.
- **Commit Frequently**: 
    - Small, frequent commits are easier to review, debug, and revert.
- **Imperative Mood**: 
    - Use the imperative mood in the subject line (e.g., "Add user" instead of "Added user").
    - Rule: "If applied, this commit will [YOUR MESSAGE]".
- **No Vague Messages**: 
    - ❌ `fix things`
    - ✅ `fix(auth): resolve race condition during login flow`

## 3. Breaking Changes
Add a `!` after the type/scope OR add `BREAKING CHANGE:` in the footer.
- `feat(api)!: remove support for XML`
- `fix: correct calculation error` followed by `BREAKING CHANGE: the default tax rate has changed.` in the footer.

## 4. Verification
- [ ] Run `git log -n 5` to verify your recent history matches the format.
- [ ] Ensure your commit doesn't break the build (`npm run build`).

> [!TIP]
> Use `git commit -v` to see the diff while writing your commit message. It helps in providing a more accurate description.
