export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({
  items,
  label = "Breadcrumb",
}: {
  items: readonly BreadcrumbItem[];
  label?: string;
}) {
  return (
    <nav aria-label={label} className="breadcrumbs">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <a href={item.href} aria-current={index === items.length - 1 ? "page" : undefined}>
                {item.label}
              </a>
            ) : (
              <span aria-current={index === items.length - 1 ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
