import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/super-admin/")({
  head: () => ({ meta: [{ title: "Platform workspace — CampusOS" }, { name: "robots", content: "noindex" }] }),
  component: () => <Navigate to="/super-admin/dashboard" replace />,
});
