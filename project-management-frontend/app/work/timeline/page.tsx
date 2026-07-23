"use client"

import { useEffect, useState, useMemo } from "react"
import { useAuthStore } from "@/stores/authStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS, TASK_PRIORITY_LABELS, TASK_PRIORITY_COLORS } from "@/lib/constants"
import type { Task } from "@/mock/types"
import Link from "next/link"
import { fetchMyTasks } from "@/services/taskService"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"


export default function WorkTimelinePage() {
  const session = useAuthStore((s) => s.session)
  const currentUserId = session?.user?.id

  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  
  // Estados de Filtros
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Fetch data on mount
  const loadData = async () => {
    setIsLoading(true)
    setHasError(false)
    setErrorMessage("")

    try {
      const tasksData = await fetchMyTasks()
      // Filter just in case the backend returns more tasks than assigned to user
      const assignedTasks = currentUserId 
        ? tasksData.filter((t: Task) => t.assigned_to === currentUserId) 
        : tasksData
      setTasks(assignedTasks)
    } catch (error: any) {
      console.error("Error loading employee timeline data:", error)
      setErrorMessage(error.message || "Error al cargar datos del cronograma")
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (currentUserId) {
      loadData()
    }
  }, [currentUserId])

  // Filter tasks with start_date and sort them chronologically (with interactivity filters)
  const scheduledTasks = useMemo(() => {
    const q = search.trim().toLowerCase()
    return tasks
      .filter((t) => !!t.start_date)
      .filter((t) => {
        if (statusFilter === "all") return true
        return t.status === statusFilter
      })
      .filter((t) => {
        if (priorityFilter === "all") return true
        return t.priority === priorityFilter
      })
      .filter((t) => {
        if (!q) return true
        return (t.title || "").toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q)
      })
      .sort((a, b) => new Date(a.start_date!).getTime() - new Date(b.start_date!).getTime())
  }, [tasks, search, statusFilter, priorityFilter])


  // Group scheduled tasks by Month-Year
  const months = useMemo(() => {
    return Array.from(new Set(scheduledTasks.map((t) => {
      const d = new Date(t.start_date!)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    }))).sort()
  }, [scheduledTasks])

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="relative flex flex-col gap-6">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
      {[1, 2].map((month) => (
        <div key={month}>
          <div className="relative mb-3 flex items-center gap-3 pl-8">
            <div className="absolute left-2.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="flex flex-col gap-2 pl-10">
            {[1, 2].map((card) => (
              <Card key={`${month}-${card}`}>
                <CardContent className="flex items-center gap-4 p-3">
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col gap-1 items-end">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  // Empty state with retry button for server errors
  const EmptyStateWithRetry = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 border rounded-xl bg-muted/10">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-4xl mb-2">⚠️</div>
        <h3 className="text-lg font-semibold">No se pudieron cargar los datos</h3>
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mi Timeline</h1>
        <p className="text-muted-foreground">Cronología de tus tareas asignadas que ya tienen una fecha de inicio</p>
      </div>

      {/* Barra de Filtros */}
      <div className="p-1 rounded-xl bg-white/20 backdrop-blur-md border border-white/40 shadow-sm">
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filtros de Cronograma</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground">Buscar</Label>
              <Input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Título o descripción" 
                className="h-9 bg-white/50 border-white/30 focus:bg-white/80 transition-colors"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground">Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 bg-white/50 border-white/30"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {Object.entries(TASK_STATUS_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground">Prioridad</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="h-9 bg-white/50 border-white/30"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {Object.entries(TASK_PRIORITY_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {hasError ? (
        <EmptyStateWithRetry />
      ) : isLoading ? (
        <LoadingSkeleton />
      ) : months.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No tienes tareas asignadas con una fecha de inicio fijada o que coincidan con los filtros.</CardContent></Card>
      ) : (
        <div className="relative flex flex-col gap-6">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          {months.map((month) => {
            const [year, m] = month.split("-")
            const monthLabel = new Date(parseInt(year), parseInt(m) - 1).toLocaleString("es-ES", { month: "long", year: "numeric" })
            
            const monthTasks = scheduledTasks.filter((t) => {
              const d = new Date(t.start_date!)
              return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === month
            })

            return (
              <div key={month}>
                <div className="relative mb-3 flex items-center gap-3 pl-8">
                  <div className="absolute left-2.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                  <h3 className="text-sm font-semibold capitalize">{monthLabel}</h3>
                </div>
                <div className="flex flex-col gap-2 pl-10">
                  {monthTasks.map((t) => (
                    <Card key={t.id} className={cn(
                      "border-none shadow-md transition-all hover:scale-[1.01] overflow-hidden group text-white",
                      t.risk_status === "high" && "bg-gradient-to-r from-red-600 to-red-500",
                      t.risk_status === "medium" && "bg-gradient-to-r from-amber-600 to-amber-500",
                      t.risk_status === "low" && "bg-gradient-to-r from-sky-600 to-sky-500",
                      (!t.risk_status || t.risk_status === "no_risk") && "bg-gradient-to-r from-slate-700 to-slate-800"
                    )}>
                      <CardContent className="flex items-center gap-4 p-3 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20" />
                        <div className="flex-1 min-w-0">
                          <Link href={`/work/my-tasks/${t.id}`} className="text-sm font-bold hover:underline truncate block">
                            {t.title}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className={cn("text-[10px] bg-white/10 border-white/20 text-white", TASK_STATUS_COLORS[t.status])}>
                              {TASK_STATUS_LABELS[t.status]}
                            </Badge>
                            <Badge variant="outline" className={cn("text-[10px] bg-white/10 border-white/20 text-white", TASK_PRIORITY_COLORS[t.priority])}>
                              {TASK_PRIORITY_LABELS[t.priority]}
                            </Badge>
                            {t.risk_status && t.risk_status !== "no_risk" && (
                              <Badge variant="outline" className="text-[10px] bg-white/20 border-white/25 text-white font-extrabold">
                                Riesgo: {t.risk_status === "high" ? "Alto" : t.risk_status === "medium" ? "Medio" : "Bajo"}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-xs text-white/90 font-medium shrink-0 flex flex-col justify-center bg-white/10 p-1.5 rounded-md border border-white/10">
                          <div>
                            {new Date(t.start_date!).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                          </div>
                          {t.due_date && (
                            <div className="opacity-70">
                              - {new Date(t.due_date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

