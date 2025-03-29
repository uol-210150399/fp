import { useState } from "react"
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontalIcon, EyeIcon } from "lucide-react"
import { useParams } from "@remix-run/react"
import { useSurveyRespondents, useSurvey } from "@/hooks/use-surveys"
import type { SurveySession } from "@/backend.types"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2Icon,
  CircleDotIcon,
  CircleIcon,
  SearchIcon,
  RefreshCcwIcon,
  ArrowUpDownIcon,
  PlusIcon,
  CopyIcon,
  CheckIcon
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useInviteRespondent } from "@/hooks/use-survey-mutations"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { SurveyTranscript } from "./survey-transcript"

const columns: ColumnDef<SurveySession>[] = [
  {
    id: "email",
    accessorFn: (row) => row.respondentData.email,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Email
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => row.original.respondentData.email || "Anonymous",
  },
  {
    accessorKey: "respondentData.name",
    header: "Name",
    cell: ({ row }) => row.original.respondentData.name || "-",
  },
  {
    accessorKey: "state",
    header: "Status",
    cell: ({ row }) => {
      const completed = row.original.completedAt
      const started = row.original.startedAt

      if (completed) {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle2Icon className="h-3 w-3" />
              Completed
            </Badge>
          </div>
        )
      }
      if (started) {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CircleDotIcon className="h-3 w-3" />
              In Progress
            </Badge>
          </div>
        )
      }
      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <CircleIcon className="h-3 w-3" />
            Not Started
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "startedAt",
    header: "Started",
    cell: ({ row }) => {
      const date = row.original.startedAt
      return date ? new Date(date).toLocaleDateString() : "-"
    },
  },
  {
    accessorKey: "completedAt",
    header: "Completed",
    cell: ({ row }) => {
      const date = row.original.completedAt
      return date ? new Date(date).toLocaleDateString() : "-"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { survey } = useSurvey(row.original.surveyId)
      const [selectedSession, setSelectedSession] = useState<string | null>(null)

      const copyLink = async () => {
        try {
          const url = `${window.location.origin}/s/${survey?.key}?r=${row.original.id}`
          await navigator.clipboard.writeText(url)
          toast.success("Survey link copied to clipboard")
        } catch (err) {
          toast.error("Failed to copy link")
        }
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedSession(row.original.id)}>
                <EyeIcon className="mr-2 h-4 w-4" />
                View Responses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyLink}>
                <CopyIcon className="mr-2 h-4 w-4" />
                Copy Survey Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <SurveyTranscript
            state={row.original.state}
            open={selectedSession === row.original.id}
            onOpenChange={(open) => {
              if (!open) setSelectedSession(null)
            }}
          />
        </>
      )
    },
  },
]

const inviteFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().optional(),
  role: z.string().optional(),
})

type InviteFormValues = z.infer<typeof inviteFormSchema>

function InviteRespondentDialog({ surveyId, onSuccess }: { surveyId: string, onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [inviteRespondent, { loading }] = useInviteRespondent()
  const [surveyLink, setSurveyLink] = useState<string>("")
  const { survey } = useSurvey(surveyId)

  const constructSurveyUrl = (sessionId: string) => {
    return `${window.location.origin}/s/${survey?.key}?r=${sessionId}`
  }

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      name: "",
      role: "",
    },
  })

  const onSubmit = async (data: InviteFormValues) => {
    try {
      const result = await inviteRespondent({
        variables: {
          input: {
            surveyId,
            ...data
          }
        }
      })

      if (result.data?.inviteRespondent?.id) {
        const url = constructSurveyUrl(result.data.inviteRespondent.id)
        setSurveyLink(url)
        onSuccess()
      }
    } catch (error) {
      toast.error("Failed to invite respondent")
    }
  }

  // Reset states when dialog closes
  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      setSurveyLink("")
      form.reset()
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Link copied to clipboard")
    } catch (err) {
      toast.error("Failed to copy link")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" onClick={() => setOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Invite Respondent
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Respondent</DialogTitle>
        </DialogHeader>
        {!surveyLink ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="respondent@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Manager" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create & Get Link"}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Survey Link</Label>
              <div className="flex items-center gap-2">
                <Input value={surveyLink} readOnly />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(surveyLink)}
                >
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOpenChange(false)}
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function SurveyRespondents() {
  const { id } = useParams()
  const { respondents, loading, error, refetch } = useSurveyRespondents(id!)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  const table = useReactTable({
    data: respondents || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between py-4">
          <Skeleton className="h-8 w-[250px]" />
        </div>
        <div className="rounded-md border">
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <p className="text-muted-foreground">Failed to load respondents</p>
        <Button
          variant="outline"
          onClick={() => {
            toast.promise(refetch(), {
              loading: "Refreshing...",
              success: "Refreshed respondents",
              error: "Failed to refresh"
            })
          }}
        >
          <RefreshCcwIcon className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by email..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[250px]"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} respondents
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.promise(refetch(), {
                  loading: "Refreshing...",
                  success: "Refreshed respondents",
                  error: "Failed to refresh"
                })
              }}
            >
              <RefreshCcwIcon className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <InviteRespondentDialog
              surveyId={id!}
              onSuccess={() => {
                refetch()
                toast.success("Respondent invited successfully")
              }}
            />
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No respondents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
} 