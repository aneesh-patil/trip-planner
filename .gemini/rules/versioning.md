---
name: feature-versioning
description: Enforce version bumping when adding new features
---

# Feature Versioning Rule

Whenever a new feature is successfully added or implemented:
1. You MUST automatically update the version in `package.json`.
2. You MUST also update any user-facing app version constants (if applicable).
3. The versioning scheme should append a digit to the patch version rather than incrementing the last digit directly (e.g., from `1.3.3` to `1.3.31`).
4. Always perform this version bump right before committing or finishing the feature task.
