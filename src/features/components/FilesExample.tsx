import { useState } from "react";
import { Button, Card, Field, FilePicker, Notice, type FileRejection } from "../../shared/ui";

const fileConstraints = { accept: [".txt", ".md"], maxFiles: 3, maxBytes: 1024 * 1024 };

export function FilesExample() {
  const [files, setFiles] = useState<readonly File[]>([]);
  const [rejections, setRejections] = useState<readonly FileRejection[]>([]);
  const [progress, setProgress] = useState(0);
  const [locked, setLocked] = useState(false);
  return (
    <Card
      title="Files and progress"
      description="Selection only: files remain on this device and are not uploaded"
    >
      <div className="gallery-stack">
        <FilePicker
          label="Attachments"
          files={files}
          onChange={setFiles}
          onReject={setRejections}
          constraints={fileConstraints}
          disabled={locked}
          progress={new Map(files.map((file) => [file, progress]))}
        />
        {rejections.length > 0 && (
          <Notice tone="error">
            <ul>
              {rejections.map((rejection, index) => (
                <li key={index}>
                  {rejection.file.name}: {rejection.reason}
                </li>
              ))}
            </ul>
          </Notice>
        )}
        <Field
          label="Example file progress"
          help="Adjust this preview manually. A real integration supplies progress."
        >
          {(field) => (
            <input
              {...field}
              type="range"
              min={0}
              max={100}
              value={progress}
              disabled={files.length === 0}
              onChange={(event) => setProgress(Number(event.target.value))}
            />
          )}
        </Field>
        <Button onClick={() => setLocked((value) => !value)}>
          {locked ? "Enable file controls" : "Disable file controls"}
        </Button>
      </div>
    </Card>
  );
}
