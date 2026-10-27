import { useRef, useState } from "react";
import { Button } from "../Button";
import { Field } from "../Field";
import { List, ListItem } from "../List";
import { Progress } from "../Status";
import {
  fileKey,
  formatFileSize,
  selectFiles,
  type FileConstraints,
  type FileRejection,
} from "./fileSelection";

export function FilePicker({
  label,
  files,
  onChange,
  onReject,
  constraints,
  disabled,
  progress,
}: {
  label: string;
  files: readonly File[];
  onChange: (files: readonly File[]) => void;
  onReject: (rejections: readonly FileRejection[]) => void;
  constraints: FileConstraints;
  disabled?: boolean;
  progress?: ReadonlyMap<File, number>;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  function choose(incoming: readonly File[]) {
    if (disabled) return;
    const result = selectFiles(files, incoming, constraints);
    onChange(result.files);
    onReject(result.rejected);
  }
  return (
    <div
      className="file-picker"
      data-dragging={(dragging && !disabled) || undefined}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        )
          setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        choose(Array.from(event.dataTransfer.files));
      }}
    >
      <Field
        label={label}
        help={`Choose or drop up to ${constraints.maxFiles} files, ${formatFileSize(constraints.maxBytes)} each. ${constraints.accept.length ? `Accepted: ${constraints.accept.join(", ")}.` : "All file types accepted."}`}
      >
        {(field) => (
          <input
            {...field}
            ref={input}
            type="file"
            multiple
            accept={constraints.accept.join(",")}
            disabled={disabled}
            onChange={(event) => {
              choose(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
          />
        )}
      </Field>
      {files.length > 0 && (
        <List label={`Selected ${label}`}>
          {files.map((file) => (
            <ListItem
              key={fileKey(file)}
              meta={formatFileSize(file.size)}
              actions={
                <Button
                  disabled={disabled}
                  aria-label={`Remove ${file.name}`}
                  onClick={() => {
                    onChange(files.filter((item) => item !== file));
                    input.current?.focus();
                  }}
                >
                  Remove
                </Button>
              }
            >
              <p className="file-name">{file.name}</p>
              {progress?.has(file) && (
                <Progress label={`${file.name} progress`} value={progress.get(file)!} />
              )}
            </ListItem>
          ))}
        </List>
      )}
      <span className="sr-only" role="status">
        {files.length} files selected
      </span>
    </div>
  );
}
