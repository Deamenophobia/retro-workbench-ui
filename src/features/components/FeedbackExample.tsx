import { useRef, useState } from "react";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Field,
  Notice,
  Pagination,
  Progress,
  Skeleton,
  Toast,
  type ToastMessage,
} from "../../shared/ui";

type PreviewState = "loading" | "empty" | "error" | "ready";
const previewStates: readonly PreviewState[] = ["loading", "empty", "error", "ready"];

function StatePreview({ state, onRecover }: { state: PreviewState; onRecover: () => void }) {
  if (state === "loading")
    return (
      <div role="status" aria-busy="true" className="gallery-stack">
        <p>Loading resources…</p>
        <Skeleton lines={4} />
      </div>
    );
  if (state === "empty")
    return (
      <EmptyState
        title="No saved resources"
        description="Save a resource to keep it close at hand."
        action={<Button onClick={onRecover}>Show sample resource</Button>}
      />
    );
  if (state === "error")
    return (
      <ErrorState
        title="Resources unavailable"
        description="This is an error preview. Try the recovery action below."
        action={<Button onClick={onRecover}>Retry preview</Button>}
      />
    );
  return <Notice tone="success">The sample resource is ready.</Notice>;
}

export function FeedbackExample() {
  const [state, setState] = useState<PreviewState>("loading");
  const [progress, setProgress] = useState(60);
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const revision = useRef(0);
  const notificationTrigger = useRef<HTMLButtonElement | null>(null);
  function notify(tone: "success" | "error", trigger: HTMLButtonElement) {
    notificationTrigger.current = trigger;
    revision.current += 1;
    setMessage({
      id: String(revision.current),
      tone,
      text:
        tone === "success"
          ? "Your preview is ready."
          : "The preview could not be prepared. Try again.",
    });
  }
  return (
    <div className="gallery-stack">
      <Card
        title="Loading, empty, and error states"
        description="Choose a state and try its recovery action"
      >
        <div className="gallery-stack">
          <Field label="Preview state">
            {(props) => (
              <select
                {...props}
                value={state}
                onChange={(event) => {
                  const next = previewStates.find((value) => value === event.target.value);
                  if (next) setState(next);
                }}
              >
                {previewStates.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <StatePreview state={state} onRecover={() => setState("ready")} />
          <Pagination
            label="State preview pages"
            page={1}
            pageSize={5}
            totalItems={state === "ready" ? 1 : 0}
            disabled={state === "loading" || state === "error"}
            onPageChange={() => {}}
          />
        </div>
      </Card>
      <div className="gallery-card-grid">
        <Card title="Progress">
          <div className="gallery-stack">
            <Progress label="Preparing resources" value={progress} />
            <Field label="Preview progress">
              {(props) => (
                <input
                  {...props}
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(event) => setProgress(Number(event.target.value))}
                />
              )}
            </Field>
            <Progress label="Waiting for a response" />
          </div>
        </Card>
        <Card title="Notifications" description="Messages stay until you dismiss them">
          <div className="gallery-actions">
            <Button onClick={(event) => notify("success", event.currentTarget)}>
              Show success
            </Button>
            <Button onClick={(event) => notify("error", event.currentTarget)}>Show error</Button>
          </div>
        </Card>
      </div>
      <Notice tone="warning">
        A warning can explain a limitation without blocking the rest of the page.
      </Notice>
      <Toast
        message={message}
        onDismiss={() => {
          setMessage(null);
          notificationTrigger.current?.focus();
        }}
      />
    </div>
  );
}
