"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"
import { useDataStore } from "@/stores/dataStore"
import { Search, Filter, MoreVertical, Plus, CloudDownload } from "lucide-react"
import Link from "next/link"
import { fetchTasks } from "@/services/taskService"
import { listMembers } from "@/services/memberService"
import { normalizeAvatarUrl } from "@/lib/avatars"
import { cn } from "@/lib/utils"
import { AnimatedFlashCard, AnimatedFlashCardVariant } from "@/components/ui/animated-flash-card"
import { AnimatedExportButton } from "@/components/ui/animated-export-button"
import { RiskBadge } from "@/components/ui/risk-badge"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import "./animated-cards.css"


import { DashboardSkeleton } from "@/components/ui/module-skeletons"

export default function DashboardPage() {
  const router = useRouter()
  const session = useAuthStore((s) => s.session)
  const tasks = useDataStore((s) => s.tasks)
  const memberships = useDataStore((s) => s.memberships)
  const setTasks = useDataStore((s) => s.setTasks)
  const setMemberships = useDataStore((s) => s.setMemberships)

  const projectId = session?.project?.id
  const projectTasks = useMemo(() => tasks.filter((t) => t.project_id === projectId), [tasks, projectId])
  const members = useMemo(() => memberships.filter((m) => m.project_id === projectId && m.status === "active"), [memberships, projectId])

  // Si ya hay tareas en el store para este proyecto, mostrar de inmediato sin bloquear (<100ms)
  const [isLoading, setIsLoading] = useState(() => projectTasks.length === 0)

  useEffect(() => {
    let isMounted = true

    async function load() {
      if (!projectId) {
        if (isMounted) setIsLoading(false)
        return
      }

      try {
        const [fetchedTasks, membersResult] = await Promise.all([
          fetchTasks(projectId),
          listMembers(),
        ])

        if (!isMounted) return

        setTasks(fetchedTasks)
        if (membersResult.success && membersResult.members) {
          setMemberships(membersResult.members.map((m) => ({ ...m, project_id: projectId })))
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [projectId, setTasks, setMemberships])

  useEffect(() => {
    if (!projectId) return
    let cancelled = false
    async function refresh() {
      try {
        const fetchedTasks = await fetchTasks(projectId)
        if (!cancelled) setTasks(fetchedTasks)
      } catch {
      }
    }
    function onTasksChanged() {
      refresh()
    }
    const interval = window.setInterval(refresh, 20000)
    window.addEventListener("tasks:changed", onTasksChanged as any)
    return () => {
      cancelled = true
      window.clearInterval(interval)
      window.removeEventListener("tasks:changed", onTasksChanged as any)
    }
  }, [projectId, setTasks])

  const done = projectTasks.filter((t) => t.status === "done").length
  const total = projectTasks.length
  
  // KPIs Solicitados
  const inRiskCount = projectTasks.filter((t) => t.status !== "done" && t.risk_status && t.risk_status !== "no_risk").length
  
  const nowStr = new Date().toISOString()
  const delayedCount = projectTasks.filter((t) => t.status !== "done" && t.due_date && t.due_date < nowStr).length

  const highRiskCount = projectTasks.filter((t) => t.risk_status === "high").length
  const mediumRiskCount = projectTasks.filter((t) => t.risk_status === "medium").length
  const lowRiskCount = projectTasks.filter((t) => t.risk_status === "low").length
  const noRiskCount = projectTasks.filter((t) => !t.risk_status || t.risk_status === "no_risk").length

  interface StatItem {
    label: string
    value: string | number
    variant: "info" | "success" | "working" | "error"
    action: string
    url: string
  }

  const stats: StatItem[] = [
    { label: "Total Tareas", value: total, variant: "info", action: "Ver Lista", url: "/app/tasks" },
    { label: "En Riesgo", value: inRiskCount, variant: "working", action: "Analizar", url: "/app/reports" },
    { label: "Completadas", value: done, variant: "success", action: "Ver Board", url: "/app/board" },
    { label: "Retrasadas", value: delayedCount, variant: "error", action: "Revisar", url: "/app/tasks" },
    { label: "Riesgo Alto", value: highRiskCount, variant: "error", action: "Ver Tareas", url: "/app/tasks" },
    { label: "Riesgo Medio", value: mediumRiskCount, variant: "working", action: "Detalles", url: "/app/tasks" },
    { label: "Riesgo Bajo", value: lowRiskCount, variant: "info", action: "Ver", url: "/app/tasks" },
    { label: "Sin Riesgo", value: noRiskCount, variant: "success", action: "Ver", url: "/app/tasks" },
  ]

  // Top 3 Risk Tasks
  const topRiskTasks = [...projectTasks]
    .filter(t => t.status !== "done" && t.risk_status !== "no_risk" && (t.delay_probability ?? 0) > 0)
    .sort((a, b) => (b.delay_probability || 0) - (a.delay_probability || 0))
    .slice(0, 3)

  // Alertas Críticas Automáticas
  const alerts = useMemo(() => {
    const list: { id: string; title: string; type: "blocked" | "critical" | "due_soon"; message: string }[] = []
    const now = new Date()
    const limit48h = new Date()
    limit48h.setDate(now.getDate() + 2)
    const limit48hStr = limit48h.toISOString()
    const nowStr = now.toISOString()

    for (const t of projectTasks) {
      if (t.status === "done") continue

      if (t.status === "blocked") {
        list.push({
          id: t.id,
          title: t.title,
          type: "blocked",
          message: "Esta tarea se encuentra BLOQUEADA y detiene el flujo de trabajo."
        })
      }
      if (t.risk_status === "high" || t.priority === "urgent") {
        list.push({
          id: t.id,
          title: t.title,
          type: "critical",
          message: `Riesgo Alto detectado por Smart Risk Engine. Prioridad: ${t.priority}.`
        })
      }
      if (t.due_date && t.due_date <= limit48hStr) {
        const isPast = t.due_date < nowStr
        list.push({
          id: t.id,
          title: t.title,
          type: "due_soon",
          message: isPast 
            ? `¡Venció el ${new Date(t.due_date).toLocaleDateString("es-ES")}!` 
            : `Próxima a vencer el ${new Date(t.due_date).toLocaleDateString("es-ES")} (<48h).`
        })
      }
    }
    return list
  }, [projectTasks])


  function exportToCSV() {
    const header = "Metrica,Valor\n"
    const data = stats.map(s => `"${s.label}","${s.value}"`).join("\n")
    const csvData = header + data
    const blob = new Blob(['\uFEFF' + csvData], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `dashboard_stats_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading && projectTasks.length === 0) {
    return <DashboardSkeleton message="Cargando Dashboard..." />
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-[16px] relative z-[1] mb-6">
        <div>
          <h1 className="text-[36px] font-[600] mb-[10px] text-admin-dark">{session?.project?.name || "Dashboard"}</h1>
          <ul className="flex items-center gap-[16px]">
            <li>
              <Link href="#" className="text-admin-dark-grey pointer-events-none">Dashboard</Link>
            </li>
            <li><span className="text-admin-dark-grey">{'>'}</span></li>
            <li>
              <Link href="#" className="text-admin-blue font-medium">Home</Link>
            </li>
          </ul>
        </div>
        <AnimatedExportButton onExport={exportToCSV} />
      </div>

      <div className="flex flex-col items-center gap-0 w-full mb-[24px]">
        {/* Top 4 Cards */}
        <div className="flex flex-row flex-wrap items-center justify-center p-0 m-0 w-full">
          {stats.slice(0, 4).map((s, i) => (
            <div key={i} className="flex-shrink-0 flex-grow-0 w-full max-w-[288px] sm:-mx-6 transform scale-[0.80] hover:scale-[0.83] transition-transform origin-center">
              <AnimatedFlashCard 
                  variant={s.variant} 
                  value={isLoading ? "—" : s.value} 
                  label={s.label} 
                  actionLabel={s.action}
                  onAction={s.url ? () => router.push(s.url) : undefined}
              />
            </div>
          ))}
        </div>
        {/* Bottom 3 Cards */}
        <div className="flex flex-row flex-wrap items-center justify-center p-0 m-0 w-full -mt-[12px]">
          {stats.slice(4).map((s, i) => (
            <div key={i} className="flex-shrink-0 flex-grow-0 w-full max-w-[288px] sm:-mx-6 transform scale-[0.80] hover:scale-[0.83] transition-transform origin-center">
              <AnimatedFlashCard 
                  variant={s.variant} 
                  value={isLoading ? "—" : s.value} 
                  label={s.label} 
                  actionLabel={s.action}
                  onAction={s.url ? () => router.push(s.url) : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Smart Risk Engine & Critical Alerts Section */}
      <div className="grid gap-6 md:grid-cols-2 mx-2 mt-8 mb-6">
        {/* Tareas con Mayor Riesgo */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-red-500">⚠️</span> Tareas con Mayor Riesgo de Retraso
          </h3>
          {topRiskTasks.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-6 text-center text-sm text-slate-500 font-medium">
              No se detectaron tareas con riesgo activo.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {topRiskTasks.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100/80 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <RiskBadge
                      variant="dashboard"
                      riskStatus={t.risk_status ?? "no_risk"}
                      delayProbability={t.delay_probability}
                      predictedDelayDays={t.predicted_delay_days}
                      riskFactors={t.risk_factors}
                      lightBackground
                      className="shrink-0"
                    />
                    <Link href={`/app/tasks/${t.id}`} className="font-semibold text-slate-700 hover:text-admin-blue hover:underline text-sm truncate">
                      {t.title}
                    </Link>
                  </div>
                  <div className="flex flex-col items-end min-w-[120px] shrink-0">
                    <span className="text-[11px] text-slate-500 mb-1">
                      {t.predicted_delay_days ? `~${t.predicted_delay_days} días de retraso` : "Retraso inminente"}
                    </span>
                    <Progress 
                      value={Math.round((t.delay_probability || 0) * 100)} 
                      className="h-2 w-full"
                      indicatorClassName="bg-red-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alertas Críticas */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-amber-500">🔔</span> Alertas Críticas del Proyecto
          </h3>
          {alerts.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-6 text-center text-sm text-emerald-600 font-medium">
              <span>✓ El proyecto está saludable y no tiene alertas críticas.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
              {alerts.slice(0, 5).map((a, idx) => (
                <div key={idx} className={cn(
                  "flex flex-col gap-1 p-3 rounded-lg border transition-all hover:scale-[1.01]",
                  a.type === "blocked" && "bg-red-500/5 border-red-500/20 text-red-700",
                  a.type === "critical" && "bg-amber-500/5 border-amber-500/20 text-amber-700",
                  a.type === "due_soon" && "bg-sky-500/5 border-sky-500/20 text-sky-700"
                )}>
                  <div className="flex justify-between items-center gap-2">
                    <Link href={`/app/tasks/${a.id}`} className="font-bold hover:underline text-sm truncate flex-1 min-w-0">
                      {a.title}
                    </Link>
                    <Badge variant="outline" className={cn(
                      "text-[9px] uppercase font-extrabold px-1.5 py-0.5 shrink-0",
                      a.type === "blocked" && "bg-red-100 border-red-300 text-red-800",
                      a.type === "critical" && "bg-amber-100 border-amber-300 text-amber-800",
                      a.type === "due_soon" && "bg-sky-100 border-sky-300 text-sky-800"
                    )}>
                      {a.type === "blocked" ? "Bloqueada" : a.type === "critical" ? "Crítica" : "Vence Pronto"}
                    </Badge>
                  </div>
                  <span className="text-xs opacity-90">{a.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      <div className="flex flex-wrap gap-[24px] mt-[12px] w-full text-white transform scale-[0.95] origin-top">
        {/* Recent Orders (Members) -> Info Theme */}
        <div className="flex-grow basis-[500px] border-[4px] border-[#4B5E6B] rounded-[6px] bg-[#3C91E6] p-[24px] overflow-x-auto shadow-sm relative z-[1]">
          <div className="flex items-center gap-[16px] mb-[24px]">
            <h3 className="mr-auto text-[24px] font-[600]">Miembros del Equipo</h3>
            <div className="bg-white/20 hover:bg-white/40 p-2 rounded-full cursor-pointer transition-colors" onClick={() => router.push('/app/team')}>
              <Search className="h-5 w-5 text-white" />
            </div>
            <div className="bg-white/20 hover:bg-white/40 p-2 rounded-full cursor-pointer transition-colors" onClick={() => router.push('/app/team?filter=active')}>
              <Filter className="h-5 w-5 text-white" />
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="pb-[12px] text-[13px] text-left border-b border-white/20">Usuario</th>
                <th className="pb-[12px] text-[13px] text-left border-b border-white/20">Rol</th>
                <th className="pb-[12px] text-[13px] text-left border-b border-white/20">Estado</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-[16px] text-center text-white/70 text-sm">No hay miembros activos</td>
                </tr>
              ) : (
                members.slice(0, 5).map((m: any, idx) => (
                  <tr key={idx} className="hover:bg-white/10 transition-colors">
                    <td className="py-[16px] flex items-center gap-[12px] pl-[6px]">
                      <img src={normalizeAvatarUrl(m.user?.avatar)} className="w-[36px] h-[36px] rounded-full object-cover border-2 border-white/30" alt="" />
                      <p className="text-sm font-medium">{m.user?.name || "Usuario Desconocido"}</p>
                    </td>
                    <td className="py-[16px] text-sm opacity-90">{m.role}</td>
                    <td className="py-[16px]">
                      <span className={cn("text-[10px] px-[16px] py-[6px] text-[#3C91E6] rounded-[20px] font-[800] bg-white")}>
                        {m.status === "active" ? "Active" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Todos (Tasks) -> Success Theme */}
        <div className="flex-grow basis-[300px] border-[4px] border-[#4B5E6B] rounded-[6px] bg-[#5FB67D] p-[24px] shadow-sm relative z-[1]">
          <div className="flex items-center gap-[16px] mb-[24px]">
            <h3 className="mr-auto text-[24px] font-[600]">Tareas</h3>
            <div className="bg-white/20 hover:bg-white/40 p-2 rounded-full cursor-pointer transition-colors" onClick={() => router.push('/app/board?new=true')}>
              <Plus className="h-5 w-5 text-white font-bold" />
            </div>
            <div className="bg-white/20 hover:bg-white/40 p-2 rounded-full cursor-pointer transition-colors" onClick={() => router.push('/app/board')}>
              <Filter className="h-5 w-5 text-white" />
            </div>
          </div>
          <ul className="w-full m-0 p-0 flex flex-col gap-[16px]">
            {projectTasks.length === 0 ? (
              <li className="text-center text-white/70 text-sm py-4">No hay tareas creadas</li>
            ) : (
              projectTasks.slice(0, 5).map((t) => {
                const isCompleted = t.status === "done"
                return (
                  <li 
                    key={t.id} 
                    className={cn(
                      "w-full bg-white/20 rounded-[10px] py-[14px] px-[20px] flex justify-between items-center transition-transform hover:scale-[1.02]",
                      isCompleted ? "border-l-[6px] border-white" : "border-l-[6px] border-[#E1C55E]"
                    )}
                  >
                    <Link href={`/app/tasks/${t.id}`} className="text-sm font-semibold text-white hover:opacity-80 flex-grow">
                      {t.title}
                    </Link>
                    <div className="bg-white/10 hover:bg-white/30 p-1.5 rounded-full cursor-pointer transition-colors" onClick={() => router.push(`/app/tasks/${t.id}`)}>
                      <MoreVertical className="h-5 w-5 text-white shrink-0" />
                    </div>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      </div>
    </>
  )
}
