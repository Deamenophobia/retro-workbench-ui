import { useState, type FormEvent } from "react";
import { Button, Card, DateInput, DateRange, Notice, type DateRangeValue } from "../../shared/ui";

export function DateExample() {
  const [dueDate, setDueDate] = useState("");
  const [range, setRange] = useState<DateRangeValue>({ start: "", end: "" });
  const [error, setError] = useState<string>();
  const [preview, setPreview] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPreview("");
    if (Boolean(range.start) !== Boolean(range.end)) {
      setError("Choose both dates for the review period.");
      return;
    }
    if (range.start > range.end) {
      setError("The end date must be on or after the start date.");
      return;
    }
    setError(undefined);
    setPreview(
      `Due: ${dueDate || "Unscheduled"}. Review: ${range.start ? `${range.start} to ${range.end}` : "Unscheduled"}.`,
    );
  }
  return (
    <Card title="Dates and periods" description="Native calendars with date-only values">
      <form className="form-stack" onSubmit={submit} noValidate>
        <DateInput label="Due date" value={dueDate} onChange={setDueDate} />
        <DateRange
          label="Review period"
          value={range}
          onChange={(next) => {
            setRange(next);
            setError(undefined);
          }}
          {...(error ? { error } : {})}
        />
        <Button type="submit" variant="primary">
          Preview dates
        </Button>
        {preview && <Notice tone="success">{preview}</Notice>}
      </form>
    </Card>
  );
}
