import { useState } from "react";
import { Breadcrumbs, PageHeading, Tabs } from "../../shared/ui";
import { CollectionsExample } from "./CollectionsExample";
import { FormsExample } from "./FormsExample";
import { OverlaysExample } from "./OverlaysExample";
import { FeedbackExample } from "./FeedbackExample";
import { SelectionExample } from "./SelectionExample";
import { DateExample } from "./DateExample";
import { FilesExample } from "./FilesExample";
import "./gallery.css";

export function ComponentsPage({
  overviewHref,
  recordsHref,
}: {
  overviewHref: string;
  recordsHref: string;
}) {
  const [tab, setTab] = useState("collections");
  return (
    <>
      <PageHeading
        eyebrow="Workspace / Components"
        title="Everyday building blocks"
        description="Compact controls, useful compositions, and states you can try."
      />
      <div className="page-body">
        <Breadcrumbs
          items={[{ label: "Workspace", href: overviewHref }, { label: "Components" }]}
        />
        <Tabs
          label="Component groups"
          value={tab}
          onChange={setTab}
          items={[
            {
              id: "collections",
              label: "Collections",
              content: <CollectionsExample recordsHref={recordsHref} />,
            },
            { id: "forms", label: "Forms", content: <FormsExample /> },
            {
              id: "inputs",
              label: "Advanced inputs",
              content: (
                <div className="gallery-stack">
                  <SelectionExample />
                  <DateExample />
                  <FilesExample />
                </div>
              ),
            },
            {
              id: "overlays",
              label: "Navigation & overlays",
              content: <OverlaysExample recordsHref={recordsHref} />,
            },
            { id: "feedback", label: "Feedback", content: <FeedbackExample /> },
          ]}
        />
      </div>
    </>
  );
}
