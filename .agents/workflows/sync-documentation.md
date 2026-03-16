---
description: How to automatically sync documentation with recent code changes
---

# /sync-documentation

Follow these steps when the user asks to sync documentation or when the `Doc Guard` fires a warning.

## 1. Analyze Debt
1. Run `sh scripts/doc-analyzer.sh`.
2. Read the output between `--- ANALYSIS START ---` and `--- ANALYSIS END ---`.
3. Review the diff context provided by the script.

## 2. Identify Target Files
Determine which documents are affected:
- **`README.md`**: If user-facing features, setup steps, or tech stack changed.
- **`.agents/rules.md`**: If architectural patterns, naming conventions, or folder responsibilities changed.
- **`.agents/design-system.md`**: If tokens or visual patterns changed.
- **`.agents/workflows/`**: If development procedures changed.

## 3. Execute Update
1. Update each identified file with precise changes.
2. Ensure the tone matches the existing documentation.
3. If the changes are purely internal/experimental, inform the user why documentation updates might be minimal.

## 4. Final Review
1. Run `scripts/doc-analyzer.sh` again to ensure "Hutang Dokumentasi" is cleared (or at least documentation is now staged).
2. Tell the user: "Documentation is now in sync with your latest code changes."
