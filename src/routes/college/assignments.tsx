import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/components/app/resource-page";
import { StatusBadge } from "@/components/app/ui-bits";
import { DEPARTMENTS } from "@/lib/mock-data";
export const Route = createFileRoute("/college/assignments")({ head: () => ({ meta: [{ title: "Assignments — CampusOS" }] }), component: () => (
  <ResourcePage title="Assignments" description="Homework and project deadlines." collection="assignments" module="Assignments" searchKeys={["title","subject"]} perms={{view:"assignments.view",create:"assignments.create",edit:"assignments.edit",delete:"assignments.delete"}} columns={[{key:"title",label:"Title"},{key:"subject",label:"Subject"},{key:"department",label:"Department",hideOnMobile:true},{key:"due_date",label:"Due"}]} fields={[{name:"title",label:"Title",required:true},{name:"subject",label:"Subject",required:true},{name:"department",label:"Department",type:"select",options:DEPARTMENTS},{name:"admission_year",label:"Batch",type:"number"},{name:"room_no",label:"Section"},{name:"due_date",label:"Due date",type:"date",required:true},{name:"description",label:"Description",type:"textarea"}]} />) });
void StatusBadge; void DEPARTMENTS;
