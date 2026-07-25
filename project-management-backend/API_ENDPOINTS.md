# API Endpoints - ProGest Backend

Total de endpoints: **55**

---

## ADMIN

Total: 7 endpoints

| Método | Ruta | Endpoint |
|--------|------|----------|
| GET | `/api/admin/audit-logs` | admin.get_audit_logs |
| GET | `/api/admin/health` | admin.health_check |
| GET | `/api/admin/projects` | admin.get_all_projects |
| PATCH | `/api/admin/projects/<project_id>/status` | admin.update_project_status |
| GET | `/api/admin/stats` | admin.get_global_stats |
| GET | `/api/admin/users` | admin.get_all_users |
| PATCH | `/api/admin/users/<user_id>/status` | admin.update_user_status |

---

## AUTH

Total: 7 endpoints

| Método | Ruta | Endpoint |
|--------|------|----------|
| POST | `/api/auth/accept-invite` | auth.accept_invite |
| POST | `/api/auth/login` | auth.login |
| POST | `/api/auth/logout` | auth.logout |
| GET | `/api/auth/me` | auth.get_me |
| PATCH | `/api/auth/me` | auth.update_me |
| POST | `/api/auth/refresh` | auth.refresh |
| POST | `/api/auth/register` | auth.register |

---

## COMMENTS

Total: 4 endpoints

| Método | Ruta | Endpoint |
|--------|------|----------|
| GET | `/api/tasks/<task_id>/comments` | comments.list_comments |
| POST | `/api/tasks/<task_id>/comments` | comments.create_comment |
| PATCH | `/api/tasks/<task_id>/comments/<comment_id>` | comments.update_comment |
| DELETE | `/api/tasks/<task_id>/comments/<comment_id>` | comments.delete_comment |

---

## INVITES

Total: 5 endpoints

| Método | Ruta | Endpoint |
|--------|------|----------|
| POST | `/api/invites` | invites.create_invite |
| GET | `/api/invites` | invites.list_invites |
| DELETE | `/api/invites/<invite_id>` | invites.cancel_invite |
| POST | `/api/invites/<invite_id>/resend` | invites.resend_invite |
| GET | `/api/invites/validate/<token>` | invites.validate_invite_token |

---

## MAIN

Total: 2 endpoints

| Método | Ruta | Endpoint |
|--------|------|----------|
| GET | `/` | index |
| GET | `/api/health` | health |

---

## MEMBERS

Total: 4 endpoints

| Método | Ruta | Endpoint |
|--------|------|----------|
| GET | `/api/members` | members.list_members |
| PATCH | `/api/members/<membership_id>/activate` | members.activate_member |
| PATCH | `/api/members/<membership_id>/deactivate` | members.deactivate_member |
| PATCH | `/api/members/<user_id>/profile` | members.update_member_profile |

---

## NOTIFICATIONS

Total: 6 endpoints

| Método | Ruta | Endpoint |
|--------|------|----------|
| GET | `/api/notifications` | notifications.list_notifications |
| DELETE | `/api/notifications/<notification_id>` | notifications.delete_notification |
| PATCH | `/api/notifications/<notification_id>/read` | notifications.mark_as_read |
| PATCH | `/api/notifications/read-all` | notifications.mark_all_as_read |
| GET | `/api/notifications/stream` | notifications.stream_notifications |
| GET | `/api/notifications/unread-count` | notifications.get_unread_count |

---

## PROJECTS

Total: 4 endpoints

| Método | Ruta | Endpoint |
|--------|------|----------|
| POST | `/api/projects` | projects.create_project |
| GET | `/api/projects/my-project` | projects.get_my_project |
| GET | `/api/projects/settings` | projects.get_project_settings |
| PATCH | `/api/projects/settings` | projects.update_project_settings |

---

## SPRINTS

Total: 5 endpoints

| Método | Ruta | Endpoint |
|--------|------|----------|
| GET | `/api/sprints` | sprints.list_sprints |
| POST | `/api/sprints` | sprints.create_sprint |
| PATCH | `/api/sprints/<sprint_id>` | sprints.update_sprint |
| GET | `/api/sprints/<sprint_id>` | sprints.get_sprint |
| DELETE | `/api/sprints/<sprint_id>` | sprints.delete_sprint |

---

## TASKS

Total: 9 endpoints

| Método | Ruta | Endpoint |
|--------|------|----------|
| POST | `/api/tasks` | tasks.create_task |
| GET | `/api/tasks` | tasks.list_tasks |
| GET | `/api/tasks/<task_id>` | tasks.get_task |
| PATCH | `/api/tasks/<task_id>` | tasks.update_task |
| DELETE | `/api/tasks/<task_id>` | tasks.delete_task |
| PATCH | `/api/tasks/<task_id>/assign` | tasks.assign_task |
| PATCH | `/api/tasks/<task_id>/status` | tasks.change_task_status |
| GET | `/api/tasks/my-tasks` | tasks.get_my_tasks |
| GET | `/api/tasks/stats` | tasks.get_task_stats |

---

## TEAM_CHAT

Total: 2 endpoints

| Método | Ruta | Endpoint |
|--------|------|----------|
| GET | `/api/projects/<project_id>/chat` | team_chat.list_messages |
| POST | `/api/projects/<project_id>/chat` | team_chat.create_message |

---

