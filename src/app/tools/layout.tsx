import AuthGuard from "@/components/ui/AuthGuard";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
