"use client"

import { useState, useCallback } from "react"
import useSWR from "swr"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, ChevronDown, CalendarDays, Clock, Users, Loader2 } from "lucide-react"

interface Appointment {
  id: string
  full_name: string
  member_id: string
  email: string
  phone: string
  service_type: string
  appointment_date: string
  appointment_time: string
  notes: string | null
  status: string
  created_at: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Approved: "bg-primary/10 text-primary border-primary/20",
  Completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
}

const serviceTypes = [
  "All Services",
  "ID Card Replacement",
  "Result Slip Printing",
  "Transcript Request",
  "Archive File Retrieval",
  "Certificate Collection",
]

export function AppointmentsTable() {
  const { data: appointments, error, isLoading, mutate } = useSWR<Appointment[]>(
    "/api/appointments",
    fetcher,
    { refreshInterval: 10000 }
  )

  const [searchQuery, setSearchQuery] = useState("")
  const [serviceFilter, setServiceFilter] = useState("All Services")
  const [dateFilter, setDateFilter] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleStatusUpdate = useCallback(
    async (id: string, newStatus: string) => {
      setUpdatingId(id)
      try {
        const res = await fetch(`/api/appointments/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        })

        if (!res.ok) throw new Error("Failed to update")

        await mutate()
      } catch {
        // Error handling - could add toast here
      } finally {
        setUpdatingId(null)
      }
    },
    [mutate]
  )

  const filtered = (appointments || []).filter((apt) => {
    const matchesSearch =
      !searchQuery ||
      apt.member_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesService =
      serviceFilter === "All Services" || apt.service_type === serviceFilter
    const matchesDate =
      !dateFilter || apt.appointment_date === dateFilter
    return matchesSearch && matchesService && matchesDate
  })

  const stats = {
    total: (appointments || []).length,
    pending: (appointments || []).filter((a) => a.status === "Pending").length,
    approved: (appointments || []).filter((a) => a.status === "Approved").length,
    completed: (appointments || []).filter((a) => a.status === "Completed").length,
  }

  if (error) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-10 text-center">
          <p className="text-destructive">Failed to load appointments. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-card-foreground">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Clock className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-card-foreground">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-card-foreground">{stats.approved}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <CalendarDays className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-card-foreground">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Appointments</CardTitle>
          <CardDescription>Manage and review all appointment bookings</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or Member ID..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-52">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                className="w-44"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              No appointments found matching your filters.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Member ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium text-foreground">
                        {apt.full_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {apt.member_id}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {apt.service_type}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(apt.appointment_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {apt.appointment_time}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "border font-medium",
                            statusColors[apt.status] || ""
                          )}
                        >
                          {apt.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={updatingId === apt.id}
                            >
                              {updatingId === apt.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  Update
                                  <ChevronDown className="ml-1 h-3 w-3" />
                                </>
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(apt.id, "Pending")
                              }
                            >
                              Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(apt.id, "Approved")
                              }
                            >
                              Approved
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(apt.id, "Completed")
                              }
                            >
                              Completed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
