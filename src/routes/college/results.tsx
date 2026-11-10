import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/components/app/resource-page";
import { StatusBadge } from "@/components/app/ui-bits";
import { DEPARTMENTS } from "@/lib/mock-data";
export const Route = createFileRoute("/college/results")({ head: () => ({ meta: [{ title: "Results — CampusOS" }] }), component: () => (
  <ResourcePage title="Results" description="Subject marks, GPA and grades." collection="results" module="Results" searchKeys={["student_id","subject_name"]} perms={{view:"results.view",create:"results.enter",edit:"results.enter",delete:"results.publish"}} columns={[{key:"student_id",label:"Student"},{key:"subject_name",label:"Subject"},{key:"gpa",label:"GPA"},{key:"grade",label:"Grade"},{key:"status",label:"Status",render:(r:any)=><StatusBadge status={r.status}/>}]} fields={[{name:"student_id",label:"Student ID",required:true},{name:"exam_title",label:"Exam"},{name:"subject_name",label:"Subject",required:true},{name:"gpa",label:"GPA",type:"number",min:0,max:4},{name:"grade",label:"Grade"},{name:"status",label:"Status",type:"select",options:["Pass","Fail","Distinction"]}]} />) });
void StatusBadge; void DEPARTMENTS;
