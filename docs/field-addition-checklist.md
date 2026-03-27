# Field Addition Checklist

**Source:** Keel — Architecture Brief C067 (Revision 2)
**Traced from:** `project` field — a field that propagates correctly through every layer.

---

## Minimum Viable (Required for ALL new task fields — Steps 1–7)

| Step | File                                          | Line(s)             | What to do                                                       |
| ---- | --------------------------------------------- | ------------------- | ---------------------------------------------------------------- |
| 1    | `shared/src/types/task.types.ts`              | Task interface      | Add the field to `Task`                                          |
| 2    | `shared/src/types/task.types.ts`              | `CreateTaskInput`   | Add if settable at creation                                      |
| 3    | `shared/src/types/task.types.ts`              | `UpdateTaskInput`   | Add if settable on update                                        |
| 4    | `server/src/services/task-service.ts:409–471` | `parseTaskFile`     | Add `fieldName: data.fieldName` to the explicit map              |
| 5    | `server/src/services/task-service.ts:565–570` | `createTask` method | Add `fieldName: input.fieldName` to the task object construction |
| 6    | `server/src/routes/tasks.ts:38–49`            | `createTaskSchema`  | Add Zod field if exposed on create API                           |
| 7    | `server/src/routes/tasks.ts:133–156`          | `updateTaskSchema`  | Add Zod field if exposed on update API                           |

Without these 7 steps, the field compiles but is silently dropped on read or rejected on write.

---

## Summary and Board Views (Steps 8–9)

Required if field appears in summary or board views.

| Step | File                                 | Line(s)            | What to do                                          |
| ---- | ------------------------------------ | ------------------ | --------------------------------------------------- |
| 8    | `shared/src/types/task.types.ts`     | `TaskSummary`      | Add the field                                       |
| 9    | `server/src/routes/tasks.ts:303–333` | TaskSummary mapper | Add `fieldName: task.fieldName` to the explicit map |

---

## MCP Exposure (Steps 10–12)

Required if field is exposed via MCP.

| Step | File                           | Line(s)                        | What to do                                      |
| ---- | ------------------------------ | ------------------------------ | ----------------------------------------------- |
| 10   | `mcp/src/tools/tasks.ts:15–24` | `CreateTaskSchema`             | Add Zod field                                   |
| 11   | `mcp/src/tools/tasks.ts:26–37` | `UpdateTaskSchema`             | Add Zod field                                   |
| 12   | `mcp/src/tools/tasks.ts`       | Tool `inputSchema` definitions | Add JSON Schema property for MCP tool discovery |

---

## Filtering (Steps 13–16)

Required if field is filterable.

| Step | File                                 | Line(s)                | What to do                    |
| ---- | ------------------------------------ | ---------------------- | ----------------------------- |
| 13   | `shared/src/types/task.types.ts`     | `TaskFilters`          | Add filter field              |
| 14   | `server/src/routes/tasks.ts:225–248` | GET /api/tasks handler | Add query param filter        |
| 15   | `mcp/src/tools/tasks.ts:7–13`        | `ListTasksSchema`      | Add Zod filter field          |
| 16   | `cli/src/commands/tasks.ts`          | List command           | Add CLI option + filter logic |

---

## Backlog and Archive (Step 17)

Required if field is used in backlog or archive.

| Step | File                                             | Line(s)         | What to do                                                                                            |
| ---- | ------------------------------------------------ | --------------- | ----------------------------------------------------------------------------------------------------- |
| 17   | `server/src/storage/backlog-repository.ts:42–82` | `parseTaskFile` | Add to explicit map — reporting fields only: `owner`, `tags`, `type`, `priority`, `project`, `sprint` |

---

## Conditional (Steps 18–21)

Apply only if the field requires these capabilities.

| Step | File                                          | Line(s)                | When                                           |
| ---- | --------------------------------------------- | ---------------------- | ---------------------------------------------- |
| 18   | `server/src/routes/tasks.ts:927–944`          | Task context endpoint  | If field should appear in `/tasks/:id/context` |
| 19   | `server/src/services/task-service.ts`         | Telemetry emissions    | If field should be tagged on task events       |
| 20   | `server/src/services/metrics/task-metrics.ts` | Metrics aggregation    | If field should be a metrics dimension         |
| 21   | `cli/src/commands/tasks.ts`                   | Create/update commands | If field should be settable via CLI            |

---

## Safe — No Action Needed

| Location                                     | Why                                                                                |
| -------------------------------------------- | ---------------------------------------------------------------------------------- |
| `taskToMarkdown` (`task-service.ts:390–407`) | Uses object spread — new fields pass through automatically                         |
| GET `/api/tasks/:id` (full task response)    | Returns the full Task object — new fields included                                 |
| MCP tool handlers (create/update)            | Pass Zod-parsed input through to API — fields that survive the schema flow through |
