import { useRef, useState, type FormEvent } from "react";
import {
  Accordion,
  Button,
  Card,
  Dialog,
  Field,
  Menu,
  Notice,
  Popover,
  Tooltip,
} from "../../shared/ui";

export function OverlaysExample({ recordsHref }: { recordsHref: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Reading room");
  const [draft, setDraft] = useState(name);
  const [message, setMessage] = useState("");
  const input = useRef<HTMLInputElement>(null);
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) {
      input.current?.focus();
      return;
    }
    setName(draft.trim());
    setMessage("Collection renamed for this preview.");
    setOpen(false);
  }
  return (
    <div className="gallery-stack">
      <Card
        title="Menus and overlays"
        description="Try Tab, Enter, Escape, and clicking outside a popover"
      >
        <div className="gallery-stack">
          <p>
            Collection: <strong>{name}</strong>
          </p>
          <div className="gallery-actions">
            <Button
              onClick={() => {
                setDraft(name);
                setOpen(true);
              }}
            >
              Rename collection
            </Button>
            <Menu
              label="Collection actions"
              items={[
                { label: "Browse records", href: recordsHref },
                {
                  label: "Mark as reviewed",
                  onSelect: () => setMessage("Collection marked as reviewed for this preview."),
                },
                { label: "Delete collection", disabled: true },
              ]}
            />
            <Popover label="About this collection" title="Collection details">
              <p>A small reading list maintained by the workspace team.</p>
              <a href={recordsHref}>Open record directory</a>
            </Popover>
            <Tooltip text="This example changes only the current preview.">
              {(props) => (
                <Button {...props} variant="text" aria-label="Preview information">
                  About this preview
                </Button>
              )}
            </Tooltip>
          </div>
          {message && <Notice tone="success">{message}</Notice>}
        </div>
      </Card>
      <Card title="Expandable information">
        <Accordion
          label="Workspace questions"
          items={[
            {
              id: "sharing",
              title: "Who can see these examples?",
              content: (
                <p>
                  These fictional examples run in your browser. Connect your own data source when
                  adapting the starter.
                </p>
              ),
            },
            {
              id: "appearance",
              title: "Does appearance affect my edits?",
              content: (
                <p>
                  Switching appearance preserves the current example values. Both appearances share
                  the same controls.
                </p>
              ),
            },
            {
              id: "keyboard",
              title: "Can I use the keyboard?",
              content: (
                <p>
                  Use Tab to move between controls, Enter or Space to activate them, and Escape to
                  dismiss an overlay.
                </p>
              ),
            },
          ]}
        />
      </Card>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Rename collection"
        description="Choose a short, recognizable name."
        initialFocus={input}
      >
        <form className="form-stack" onSubmit={save}>
          <Field label="Collection name">
            {(props) => (
              <input
                {...props}
                ref={input}
                required
                maxLength={60}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
            )}
          </Field>
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={!draft.trim()}>
              Apply name
            </Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
