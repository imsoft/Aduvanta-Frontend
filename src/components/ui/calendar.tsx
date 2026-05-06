"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground [[data-range-start=true],[data-range-end=true]]:rounded-none data-[range-start=true]:rounded-s-(--cell-radius) data-[range-end=true]:rounded-e-(--cell-radius)",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180 rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex gap-4 flex-col md:flex-row", defaultClassNames.months),
        month: cn("flex flex-col gap-4", defaultClassNames.month),
        nav: cn("flex items-center gap-1", defaultClassNames.nav),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-between px-1 gap-3",
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          "text-sm font-medium",
          captionLayout === "label" ? "" : "hidden",
          defaultClassNames.caption_label
        ),
        dropdowns: cn(
          "flex items-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown: cn("relative", defaultClassNames.dropdown),
        dropdown_root: cn(
          "border-input ring-offset-background focus-within:border-ring focus-within:ring-ring/50 has-data-[placeholder]:text-muted-foreground relative inline-flex h-8 items-center justify-between gap-1 overflow-hidden whitespace-nowrap rounded-md border bg-transparent px-2 py-0.5 text-sm shadow-xs transition-shadow focus-within:ring-[3px] [&_select]:absolute [&_select]:inset-0 [&_select]:cursor-pointer [&_select]:opacity-0",
          defaultClassNames.dropdown_root
        ),
        button_previous: cn(
          "text-muted-foreground hover:text-foreground ml-auto h-(--cell-size) w-(--cell-size) p-0",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          "text-muted-foreground hover:text-foreground h-(--cell-size) w-(--cell-size) p-0",
          defaultClassNames.button_next
        ),
        weekday: cn(
          "text-muted-foreground rounded-md w-(--cell-size) font-normal text-[0.8rem]",
          defaultClassNames.weekday
        ),
        day: cn(
          "group/day relative p-0 text-center text-sm w-(--cell-size) h-(--cell-size) flex items-center justify-center [&:first-child[data-selected=true]_button]:rounded-s-(--cell-radius) [&:last-child[data-selected=true]_button]:rounded-e-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-s-(--cell-radius) bg-accent",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "rounded-none bg-accent last:rounded-e-(--cell-radius) first:rounded-s-(--cell-radius)",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "rounded-e-(--cell-radius) bg-accent",
          defaultClassNames.range_end
        ),
        today: cn(
          "bg-accent text-accent-foreground rounded-(--cell-radius)",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.outside
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        week_number: cn(
          "text-muted-foreground w-(--cell-size) text-[0.8rem]",
          defaultClassNames.week_number
        ),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <CaretLeft size={16} />
          ) : (
            <CaretRight size={16} />
          ),
        DayButton: ({ ...dayProps }) => (
          <CalendarDayButton locale={locale} {...dayProps} />
        ),
        ...components,
      }}
      {...props}
    />
  )
}

export { Calendar }
