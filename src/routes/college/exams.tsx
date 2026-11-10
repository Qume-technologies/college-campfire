import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/components/app/resource-page";
import { StatusBadge } from "@/components/app/ui-bits";
import { DEPARTMENTS } from "@/lib/mock-data";
export const Route = createFileRoute("/college/exams")({ head: () => ({ meta: [{ title: "Exams — CampusOS" }] }), component: () => (
  <ResourcePage title="Exams" description="Examination schedules." collection="exams" module="Exams" searchKeys={["title"]} perms={{view:"exams.manage",create:"exams.manage",edit:"exams.manage",delete:"exams.manage"}} columns={[{key:"title",label:"Title"},{key:"exam_type",label:"Type"},{key:"start_date",label:"Start"},{key:"end_date",label:"End"}]} fields={[{name:"title",label:"Title",required:true},{name:"exam_type",label:"Type",type:"select",options:["Mid-Term","Final","Assessment","Unit Test"]},{name:"start_date",label:"Start",type:"date",required:true},{name:"end_date",label:"End",type:"date",required:true},{name:"department",label:"Department",type:"select",options:DEPARTMENTS}]} />) });
void StatusBadge; void DEPARTMENTS;
