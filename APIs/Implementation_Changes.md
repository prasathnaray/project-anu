# Implementation Changes

This document summarizes the recent API and UI changes made in the project.

## 1. Volume API Documentation

Added a consolidated volume API reference:

- `APIs/Volume_APIs.md`

The document covers:

- Base URL and bearer token usage.
- Role access notes.
- Volume upload.
- Uploaded volume listing.
- Volume approval.
- Instructor/admin volume view.
- Volume conversion.
- Converted volume listing.
- Volume placement JSON upload.
- Volume recording upload.
- Shadow/step recording retrieval.
- Volume recording counts.
- Volume/resource association.
- Associated volume lookup.

Added Bruno-style request files under:

- `APIs/API_Prod_Test/`

New request files include:

- `Get Volumes.yml`
- `Approve Volume.yml`
- `Get Volumes By Instructor.yml`
- `Converted Volumes.yml`
- `Volume Placement.yml`
- `Upload Volume Recording.yml`
- `Shadow Recordings.yml`
- `Volume Recording Counts.yml`
- `Associate Volume.yml`
- `Get Associated Volume.yml`

## 2. Super Admin Course Mapping Form

Updated:

- `client/src/pages/CourseMapping.js`

The Course Mapping form now uses the requested structure:

- `Volume`
- `Trimester`
- `Module`
- `Unit`
- `Course Type`
- `Shadow Recording`
- `Step Recording`

Unit options:

- `BPD & HC`
- `AC`
- `FL`

Course type options:

- `p1`
- `p2`
- `p3`
- `p4`
- `t1`
- `t2`

Additional UI updates:

- Changed the old read-only `Anatomy Type` field into a selectable `Unit` dropdown.
- Moved `Unit` after `Module`.
- Updated table and filter labels from `Anatomy` to `Unit`.
- Added `Unit` to mapping filters.
- Kept the existing payload field name as `anatomy_type` so the current API/database shape remains compatible.

## 3. Course Mapping Backend Validation

Updated:

- `server/v1/model/CourseMappingm.js`

Backend changes:

- Added support for course types `p1`, `p2`, `p3`, `p4`, `t1`, and `t2`.
- Kept older course type values temporarily for backward compatibility:
  - `Practice`
  - `Test`
  - `Free scan`
- Relaxed volume lookup so mapping creation does not fail only because the selected Unit does not exactly match older `volumes.volume_type` data.
- If duplicate volume names exist, the backend still uses matching unit/type to disambiguate when possible.

## 4. Trainee VR API Reattempt Count

Updated:

- `server/v1/model/traineem.js`

Endpoint affected:

```text
GET /api/v1/trainee/:people_id?isVr=true
```

Example:

```text
GET /api/v1/trainee/4ef474a4-3dd3-4d35-bfdf-40039b8a5be9?isVr=true
```

Change made:

- Added `reattempt_count` to each item under `tests`.
- The count is calculated from `test_attempts_logs`.
- The existing response structure is otherwise unchanged.

Example test item after the change:

```json
{
  "resource_id": "31fd2b92-a17f-4b4a-b9fa-ea473a51ec60",
  "resource_name": "Test 1",
  "is_completed": true,
  "reattempt_count": 2
}
```

This applies to all test resources, including `t1` and `t2` under units like:

- `BPD & HC`
- `AC`
- `FL`

If there are no reattempt logs for a test, the value is:

```json
"reattempt_count": 0
```

## 5. Verification

Commands run:

```bash
npm.cmd run build
```

Result:

- Build completed successfully.
- Existing ESLint warnings were reported from unrelated files.

```bash
node --check server\v1\model\CourseMappingm.js
node --check server\v1\model\traineem.js
```

Result:

- Both server model files passed syntax checks.

## 6. Notes

- `client/src/API/config.js` was already modified in the worktree and was not changed as part of these updates.
- The Course Mapping API still stores Unit in the existing `anatomy_type` column to avoid a database migration.
- The trainee VR API response structure was intentionally kept the same, with only `reattempt_count` added to test items.
