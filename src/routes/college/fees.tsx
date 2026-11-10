import { createFileRoute } from "@tanstack/react-router";
import { ResourcePage } from "@/components/app/resource-page";
import { StatusBadge } from "@/components/app/ui-bits";
import { DEPARTMENTS } from "@/lib/mock-data";
export const Route = createFileRoute("/college/fees")({ head: () => ({ meta: [{ title: "Fees — CampusOS" }] }), component: () => (
  <ResourcePage title="Fees" description="Invoices and payments." collection="fees" module="Fees" searchKeys={["student_id","title"]} perms={{view:"fees.view",create:"fees.create",edit:"fees.pay",delete:"fees.create"}} columns={[{key:"student_id",label:"Student"},{key:"title",label:"Title"},{key:"amount",label:"Amount",render:(r:any)=>`Rs ${Number(r.amount).toLocaleString()}`},{key:"due_date",label:"Due"},{key:"is_paid",label:"Status",render:(r:any)=><StatusBadge status={r.is_paid?"Paid":"Unpaid"}/>}]} fields={[{name:"student_id",label:"Student ID",required:true},{name:"title",label:"Title",required:true},{name:"amount",label:"Amount",type:"number",min:0},{name:"due_date",label:"Due",type:"date"},{name:"is_paid",label:"Paid",type:"switch"}]} />) });
void StatusBadge; void DEPARTMENTS;
