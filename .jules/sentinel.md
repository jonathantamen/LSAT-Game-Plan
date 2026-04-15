## 2026-04-15 - [CRITICAL] Firebase Security Rules `request.resource` Null on Delete
**Vulnerability:** Broken functionality causing authorized task/progress deletion to fail.
**Learning:** During `delete` operations in Firebase Security Rules, `request.resource` is null, so accessing `request.resource.data` will crash the rule evaluation and block the delete. The previous rules incorrectly grouped `allow write` which evaluates for `create`, `update`, and `delete` and attempted to validate the schema via `request.resource.data` on all three.
**Prevention:** Separate `create, update` permissions from `delete` permissions when data schema validation is required using `request.resource.data`.
