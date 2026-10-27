import { useRef, useState, type FormEvent } from "react";
import { Button, Card, Checkbox, Field, Notice, RadioGroup, Switch } from "../../shared/ui";

const visibilityOptions = [
  { value: "workspace", label: "Workspace" },
  { value: "private", label: "Only me" },
  { value: "public", label: "Public (unavailable)", disabled: true },
];

export function FormsExample() {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("note");
  const [notes, setNotes] = useState("");
  const [visibility, setVisibility] = useState("workspace");
  const [includeSummary, setIncludeSummary] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [error, setError] = useState<string>();
  const [result, setResult] = useState("");
  const titleInput = useRef<HTMLInputElement>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult("");
    if (!title.trim()) {
      setError("Enter a title for the preview.");
      titleInput.current?.focus();
      return;
    }
    setError(undefined);
    setResult(
      `${title.trim()} · ${kind} · ${visibility === "private" ? "Only me" : "Workspace"} · ${includeSummary ? "With summary" : "No summary"} · Notifications ${notifications ? "on" : "off"}${notes.trim() ? ` · ${notes.trim()}` : ""}`,
    );
  }
  return (
    <div className="gallery-stack">
      <Card
        title="Compose a resource"
        description="Try validation, keyboard selection, and disabled controls"
      >
        <form className="form-stack" noValidate onSubmit={submit}>
          <Field
            label="Resource title"
            help="Required. Up to 80 characters."
            {...(error ? { error } : {})}
          >
            {(props) => (
              <input
                {...props}
                ref={titleInput}
                required
                maxLength={80}
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setError(undefined);
                }}
              />
            )}
          </Field>
          <Field label="Resource type">
            {(props) => (
              <select {...props} value={kind} onChange={(event) => setKind(event.target.value)}>
                <option value="note">Note</option>
                <option value="checklist">Checklist</option>
                <option value="reference">Reference</option>
              </select>
            )}
          </Field>
          <Field label="Description" help="Optional context for the preview.">
            {(props) => (
              <textarea
                {...props}
                rows={3}
                maxLength={240}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            )}
          </Field>
          <RadioGroup
            label="Visibility"
            value={visibility}
            onChange={setVisibility}
            options={visibilityOptions}
          />
          <Checkbox
            label="Include a summary"
            description="Show a short introduction above the content."
            checked={includeSummary}
            onCheckedChange={setIncludeSummary}
          />
          <Switch
            label="Notify on changes"
            description="A local example; no notifications are sent."
            checked={notifications}
            onCheckedChange={setNotifications}
          />
          <Checkbox
            label="Automatic publishing"
            description="Unavailable in this example."
            disabled
            checked={false}
          />
          <div className="form-actions">
            <Button type="submit" variant="primary">
              Preview resource
            </Button>
            <Button
              type="reset"
              onClick={(event) => {
                event.preventDefault();
                setTitle("");
                setKind("note");
                setNotes("");
                setVisibility("workspace");
                setIncludeSummary(true);
                setNotifications(false);
                setError(undefined);
                setResult("");
              }}
            >
              Reset example
            </Button>
          </div>
          {result && <Notice tone="success">Preview only: {result}</Notice>}
        </form>
      </Card>
    </div>
  );
}
