import { CheckIcon, XCircleIcon } from "lucide-react"
import { Fragment, useEffect, useState } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { QuestionBody } from "./question-body"

interface MatrixQuestionProps {
  disabled?: boolean
  questionFormKey: string
  topicId: string
}

export const MatrixQuestion = ({
  disabled,
  questionFormKey,
  topicId,
}: MatrixQuestionProps) => {
  const columnsFieldArray = useFieldArray({
    name: `${questionFormKey}.columns`,
  })
  const rowsFieldArray = useFieldArray({
    name: `${questionFormKey}.rows`,
  })
  const allowMultiplePerRow = useWatch({
    name: `${questionFormKey}.allowMultiplePerRow`,
    defaultValue: false,
  })

  const formContext = useFormContext()
  return (
    <QuestionBody
      disabled={disabled}
      mainElement={
        <div className="flex flex-col space-y-2 max-w-2xl">
          <div className="flex gap-3 justify-end">
            <Button
              disabled={disabled}
              className="underline self-end px-0"
              onClick={() => {
                columnsFieldArray.append(
                  `Col ${columnsFieldArray.fields.length + 1}`
                )
              }}
              variant="link"
            >
              Add column
            </Button>

          </div>
          <Table className="overflow-scroll w-full">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="p-0 min-w-36 max-w-36"></TableHead>
                {columnsFieldArray.fields.map((field, columnIndex) => {
                  const value = formContext.watch(
                    `${questionFormKey}.columns.${columnIndex}`
                  )
                  const isNumber = !Number.isNaN(Number(value))

                  return (
                    <TableHead
                      className={cn(
                        "p-0 max-w-36 min-w-36 align-bottom",
                        isNumber && "min-w-20"
                      )}
                      key={field.id}
                    >
                      <div className="flex flex-col items-center gap-1 group/matrix-column">
                        <Button
                          type="button"
                          disabled={
                            disabled ||
                            (columnsFieldArray.fields.length === 1)
                          }
                          onClick={() => {
                            columnsFieldArray.remove(columnIndex)
                          }}
                          variant="secondary"
                          size="icon"
                          className="size-3.5 disabled:!opacity-0 hover:text-red-800 transition-opacity bg-background hover:bg-background opacity-0 group-hover/matrix-column:opacity-100"
                        >
                          <span className="sr-only">Remove column</span>
                          <XCircleIcon className="size-3.5" />
                        </Button>
                        <FormField
                          disabled={disabled}
                          name={`${questionFormKey}.columns.${columnIndex}`}
                          defaultValue=""
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Textarea
                                  className="border-none rounded-none focus-visible:ring-0 resize-none text-center focus-visible:bg-accent/60"
                                  placeholder="Col"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TableHead>
                  )
                })}

              </TableRow>
            </TableHeader>
            <TableBody>
              {rowsFieldArray.fields.map((field, rowIndex) => (
                <TableRow
                  className="overflow-x-scroll bg-accent-subtle hover:bg-accent-subtle border-none items-center"
                  key={field.id}
                >
                  <TableHead className="p-0 min-w-52 items-stretch align-middle sticky flex start-0 h-auto bg-background border-r">
                    <div className="w-full relative group/matrix-row">
                      <Button
                        type="button"
                        disabled={
                          disabled || rowsFieldArray.fields.length === 1
                        }
                        onClick={() => {
                          rowsFieldArray.remove(rowIndex)
                        }}
                        variant={"secondary"}
                        size="icon"
                        className="size-3.5 disabled:!opacity-0 hover:text-red-800 transition-opacity bg-background hover:bg-background absolute top-1/2 -translate-y-1/2 left-0 opacity-0 group-hover/matrix-row:opacity-100"
                      >
                        <span className="sr-only">Remove row</span>
                        <XCircleIcon className="size-3.5" />
                      </Button>
                      <FormField
                        disabled={disabled}
                        name={`${questionFormKey}.rows.${rowIndex}`}
                        defaultValue=""
                        render={({ field }) => (
                          <FormItem className="w-full h-full pl-[1.1rem]">
                            <FormControl>
                              <Textarea
                                className="border-none focus-visible:ring-0 resize-none text-left w-full rounded-none focus-visible:bg-accent/60 bg-transparent"
                                placeholder="Row"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TableHead>
                  {columnsFieldArray.fields.map((columnField) => (
                    <TableCell className="text-center" key={columnField.id}>
                      {allowMultiplePerRow ? (
                        <input
                          disabled={disabled}
                          type="checkbox"
                          checked={false}
                          readOnly
                        />
                      ) : (
                        <input
                          disabled={disabled}
                          type="radio"
                          checked={false}
                          readOnly
                        />
                      )}
                    </TableCell>
                  ))}

                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            disabled={disabled}
            className="underline px-0 self-start"
            onClick={() => {
              rowsFieldArray.append(`Row ${rowsFieldArray.fields.length + 1}`)
            }}
            variant="link"
          >
            Add row
          </Button>
        </div>
      }
      settingsElement={
        <Fragment>
          <FormField
            disabled={disabled}
            defaultValue={false}
            name={`${questionFormKey}.allowMultiplePerRow`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5 text-start">
                  <FormLabel>Multiple selection</FormLabel>
                  <FormDescription>
                    Allows participants to select multiple options per row
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    disabled={field?.disabled}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </Fragment>
      }
      advancedSettingsElement={
        <Fragment>
          <FormField
            disabled={disabled}
            name={`${questionFormKey}.required`}
            defaultValue={true}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5 text-start">
                  <FormLabel>Required</FormLabel>
                  <FormDescription>
                    Requires the respondent to fill in the matrix table.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    disabled={field?.disabled}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            disabled={disabled}
            name={`${questionFormKey}.description`}
            defaultValue=""
            render={({ field }) => (
              <FormItem className="flex-1 text-start">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  Additional information that appears below the question.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Fragment>
      }
    />
  )
}
