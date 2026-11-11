import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/college/")({
  head: () => ({ meta: [{ title: "College workspace — CampusOS" }, { name: "robots", content: "noindex" }] }),
  component: () => <Navigate to="/college/dashboard" replace />,
});
