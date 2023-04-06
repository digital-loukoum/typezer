// function to normalize a path between UNIX and Windows
export function normalizePath(path: string) {
  return path.replace(/\\/g, "/")
}
