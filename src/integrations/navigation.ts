export const hashNavigation = {
  read: () => window.location.hash.replace(/^#\/?/, "").split("?")[0] ?? "",
  subscribe(notify: () => void) {
    window.addEventListener("hashchange", notify);
    return () => window.removeEventListener("hashchange", notify);
  },
};

export function setPageTitle(title: string) {
  document.title = title;
}
