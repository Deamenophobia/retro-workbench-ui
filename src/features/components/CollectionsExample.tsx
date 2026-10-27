import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Drawer,
  List,
  ListItem,
  Pagination,
  Progress,
  getPagination,
} from "../../shared/ui";
import { listPageSizes, resources, type Resource } from "./examples";

export function CollectionsExample({ recordsHref }: { recordsHref: string }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(listPageSizes[0]);
  const [saved, setSaved] = useState<ReadonlySet<string>>(new Set());
  const [selected, setSelected] = useState<Resource | null>(null);
  const range = getPagination(resources.length, page, pageSize);
  function toggleSaved(id: string) {
    setSaved((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  return (
    <div className="gallery-stack">
      <div className="gallery-card-grid">
        <Card
          title="Collection summary"
          description="A compact summary card"
          footer={<a href={recordsHref}>Browse the record directory →</a>}
        >
          <div className="gallery-metric">
            {resources.length}
            <span>sample resources</span>
          </div>
          <Progress label="Saved resources" value={saved.size} max={resources.length} />
        </Card>
        <Card
          title="Workspace handbook"
          description="A record card with an action"
          media={
            <div className="gallery-card-mark" aria-hidden="true">
              ▤ <span>WORKSPACE / GUIDE</span>
            </div>
          }
          actions={<Badge tone="success">Ready</Badge>}
          footer={<Button onClick={() => setSelected(resources[0])}>View handbook</Button>}
        >
          <p>A short introduction to the shared workspace, with ownership and useful references.</p>
        </Card>
        <Card
          title="Make it yours"
          description="An action card"
          footer={
            <Button onClick={() => setSaved(new Set())} disabled={saved.size === 0}>
              Clear saved resources
            </Button>
          }
        >
          <p>
            Save resources from the list below. Their state is shared with this summary for this
            visit.
          </p>
          <p className="gallery-note" role="status">
            {saved.size} saved
          </p>
        </Card>
      </div>
      <Card
        title="Resource list"
        description="Descriptions, ownership, metadata, and independent actions"
        footer={
          <Pagination
            label="Resource pages"
            page={range.page}
            pageSize={pageSize}
            totalItems={resources.length}
            onPageChange={setPage}
            pageSizeControl={{
              options: listPageSizes,
              onChange: (size) => {
                setPageSize(size);
                setPage(1);
              },
            }}
          />
        }
      >
        <List label="Sample resources">
          {resources.slice(range.startIndex, range.endIndex).map((resource) => (
            <ListItem
              key={resource.id}
              leading={<Avatar name={resource.owner} />}
              meta={
                <>
                  <Badge>{resource.category}</Badge>
                  <p>{resource.updated}</p>
                </>
              }
              actions={
                <Button
                  aria-label={`Save ${resource.title}`}
                  aria-pressed={saved.has(resource.id)}
                  onClick={() => toggleSaved(resource.id)}
                >
                  {saved.has(resource.id) ? "Saved" : "Save"}
                </Button>
              }
            >
              <Button variant="text" onClick={() => setSelected(resource)}>
                {resource.title}
              </Button>
              <p>{resource.description}</p>
              <p>{resource.owner}</p>
            </ListItem>
          ))}
        </List>
      </Card>
      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.title ?? "Resource details"}
      >
        {selected && (
          <div className="gallery-stack">
            <Badge>{selected.category}</Badge>
            <p>{selected.description}</p>
            <p>Maintained by {selected.owner}.</p>
          </div>
        )}
      </Drawer>
    </div>
  );
}
