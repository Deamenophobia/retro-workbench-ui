import type { ReactNode } from "react";

export type NavigationItem = { id: string; label: string; icon: string; href: string };
export type Branding = { name: string; mark: string; version: string; home: string };

export function AppShell({
  brand,
  navigation,
  activePage,
  workspaceName,
  menus,
  appearance,
  sidebar,
  footer,
  children,
}: {
  brand: Branding;
  navigation: readonly NavigationItem[];
  activePage: string;
  workspaceName: string;
  menus: ReactNode;
  appearance: ReactNode;
  sidebar?: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="workspace-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          event.currentTarget.ownerDocument.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="workspace-header">
        <a className="brand" href={brand.home}>
          <span className="brand-mark" aria-hidden="true">
            {brand.mark}
          </span>
          <span>{brand.name}</span>
        </a>
        <nav className="top-menus" aria-label="Top menus">
          {menus}
        </nav>
        <span className="workspace-name">{workspaceName}</span>
        {appearance}
      </header>
      <aside className="workspace-sidebar">
        <nav className="workspace-nav" aria-label="Workspace">
          <span className="eyebrow">Workspace</span>
          {navigation.map((item) => (
            <a
              key={item.id}
              href={item.href}
              aria-current={activePage === item.id ? "page" : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="sidebar-content">{sidebar}</div>
        <div className="sidebar-footer">
          <span>{brand.name}</span>
          <span>{brand.version}</span>
        </div>
      </aside>
      <main id="main-content" tabIndex={-1} className="workspace-content">
        {children}
      </main>
      <footer className="workspace-status">{footer}</footer>
    </div>
  );
}
