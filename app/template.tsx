/** Wraps every page so route changes fade in smoothly (see .page-in). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
