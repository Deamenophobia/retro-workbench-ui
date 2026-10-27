/** Fictional content belongs to the example feature, never the shared components. */
export const resources = [
  {
    id: "handbook",
    title: "Workspace handbook",
    owner: "Maya Chen",
    category: "Guide",
    description: "A short introduction to the shared workspace.",
    updated: "Today",
  },
  {
    id: "checklist",
    title: "Release checklist",
    owner: "Sam Rivera",
    category: "Checklist",
    description: "Small checks that keep releases predictable.",
    updated: "Yesterday",
  },
  {
    id: "notes",
    title: "Research notes",
    owner: "Alex Morgan",
    category: "Notes",
    description: "Observations and questions from the latest review.",
    updated: "Oct 24",
  },
  {
    id: "library",
    title: "Reference library",
    owner: "Riley Park",
    category: "Collection",
    description: "Useful links collected in one place.",
    updated: "Oct 23",
  },
  {
    id: "brief",
    title: "Project brief",
    owner: "Taylor Lane",
    category: "Document",
    description: "The scope, audience, and intended outcome.",
    updated: "Oct 22",
  },
  {
    id: "archive",
    title: "Decision archive",
    owner: "Jordan Lee",
    category: "Archive",
    description: "A record of decisions and their context.",
    updated: "Oct 21",
  },
] as const;

export type Resource = (typeof resources)[number];
export const listPageSizes = [3, 5] as const;
