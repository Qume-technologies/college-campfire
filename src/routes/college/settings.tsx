import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, Building2, Check, Copy, Database, KeyRound, Save, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/app/ui-bits";
import { RecordForm, ResourcePage, type Field } from "@/components/app/resource-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dataApi, useCollection } from "@/lib/store";
import { DEPARTMENTS, type College } from "@/lib/mock-data";

export const Route = createFileRoute("/college/settings")({
  head: () => ({ meta: [
    { title: "College settings — CampusOS" },
    { name: "description", content: "Manage college profile, academic sessions, subjects, rooms, notifications and mobile app settings." },
    { property: "og:title", content: "College settings — CampusOS" },
    { property: "og:description", content: "Institution configuration for a CampusOS college." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: CollegeSettings,
});

const profileFields: Field[] = [
  { name: "name", label: "College name", required: true }, { name: "code", label: "College ID", required: true },
  { name: "email", label: "Official email", type: "email", required: true }, { name: "phone", label: "Phone" },
  { name: "website", label: "Website" }, { name: "affiliation", label: "Affiliation / registration" },
  { name: "address", label: "Address" }, { name: "city", label: "City" },
  { name: "province", label: "Province" }, { name: "country", label: "Country" },
  { name: "description", label: "Institution description", type: "textarea", full: true },
];

function CollegeSettings() {
  const college = useCollection<College>("colleges").find((c) => c.id === "col-bwic")!;
  const [profileKey, setProfileKey] = useState(0);
  const [preferences, setPreferences] = useState({ attendanceAlerts: true, feeReminders: true, resultAlerts: true, weeklyDigest: false, assignmentAlerts: true });
  const [mobileChannel, setMobileChannel] = useState("bridgewater-students-production");

  const saveProfile = (values: Record<string, any>) => { dataApi.update("colleges", college.id, values, "Settings", "Updated college profile"); toast.success("College profile saved"); };
  const savePreferences = () => { dataApi.update("colleges", college.id, { notification_preferences: preferences }, "Settings", "Updated notification preferences"); toast.success("Notification preferences saved"); };
  const saveMobile = () => { dataApi.update("colleges", college.id, { mobile_channel: mobileChannel }, "Settings", "Updated mobile integration"); toast.success("Mobile settings saved"); };

  return (
    <div>
      <PageHeader title="College settings" description="Manage your institution, academic structure and mobile app connection." />
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="h-auto flex-wrap justify-start"><TabsTrigger value="profile">Profile & branding</TabsTrigger><TabsTrigger value="sessions">Academic sessions</TabsTrigger><TabsTrigger value="subjects">Subjects</TabsTrigger><TabsTrigger value="rooms">Rooms & sections</TabsTrigger><TabsTrigger value="notifications">Notifications</TabsTrigger><TabsTrigger value="mobile">Mobile app</TabsTrigger></TabsList>
        <TabsContent value="profile">
          <div className="grid gap-6 xl:grid-cols-3">
            <Panel title="Institution profile" description="Core details used across the administration workspace" className="xl:col-span-2"><div className="p-5"><RecordForm key={profileKey} fields={profileFields} defaults={college} onSubmit={saveProfile} onCancel={() => setProfileKey((key) => key + 1)} submitLabel="Save profile" /></div></Panel>
            <div className="space-y-6"><Panel title="Brand preview" description="How your college appears in CampusOS"><div className="p-5"><div className="rounded-xl border bg-muted/40 p-5 text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl text-xl font-semibold text-primary-foreground" style={{ background: college.color }}>{college.name.charAt(0)}</span><p className="mt-4 text-sm font-semibold">{college.name}</p><p className="mt-1 text-xs text-muted-foreground">{college.website}</p></div><div className="mt-4 space-y-2 text-xs"><div className="flex justify-between"><span className="text-muted-foreground">College ID</span><span>{college.code}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Subscription</span><span>{college.plan}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{college.type}</span></div></div></div></Panel><Panel title="Academic structure" description="Manage departments and access roles separately"><div className="grid gap-2 p-4"><Button asChild variant="outline"><Link to="/college/departments"><Building2 />Manage departments</Link></Button><Button asChild variant="outline"><Link to="/college/roles"><KeyRound />Manage roles</Link></Button></div></Panel></div>
          </div>
        </TabsContent>
        <TabsContent value="sessions"><ResourcePage title="Academic sessions" description="Academic years and their active dates." collection="sessions" module="Academic sessions" searchKeys={["name"]} perms={{ create: "settings.sessions", edit: "settings.sessions", delete: "settings.sessions" }} defaults={{ status: "Active" }} columns={[{ key: "name", label: "Session" }, { key: "start_date", label: "Starts" }, { key: "end_date", label: "Ends" }, { key: "status", label: "Status" }]} fields={[{ name: "name", label: "Session name", required: true }, { name: "start_date", label: "Start date", type: "date", required: true }, { name: "end_date", label: "End date", type: "date", required: true }, { name: "status", label: "Status", type: "select", options: ["Active", "Closed"] }]} /></TabsContent>
        <TabsContent value="subjects"><ResourcePage title="Courses & subjects" description="Subjects offered by each academic department." collection="subjects" module="Subjects" searchKeys={["name", "code", "department"]} filters={[{ key: "department", label: "Departments", options: DEPARTMENTS }]} perms={{ create: "settings.sessions", edit: "settings.sessions", delete: "settings.sessions" }} columns={[{ key: "code", label: "Code" }, { key: "name", label: "Subject" }, { key: "department", label: "Department" }, { key: "credits", label: "Credits" }]} fields={[{ name: "code", label: "Subject code", required: true }, { name: "name", label: "Subject name", required: true }, { name: "department", label: "Department", type: "select", options: DEPARTMENTS, required: true }, { name: "credits", label: "Credit hours", type: "number", min: 0, max: 12 }]} /></TabsContent>
        <TabsContent value="rooms"><ResourcePage title="Rooms & sections" description="Classrooms, labs and halls used by timetables." collection="rooms" module="Rooms" searchKeys={["name", "type"]} perms={{ create: "settings.sessions", edit: "settings.sessions", delete: "settings.sessions" }} columns={[{ key: "name", label: "Room / section" }, { key: "type", label: "Type" }, { key: "capacity", label: "Capacity" }]} fields={[{ name: "name", label: "Room or section name", required: true }, { name: "type", label: "Type", type: "select", options: ["Classroom", "Lab", "Hall"] }, { name: "capacity", label: "Capacity", type: "number", min: 1 }]} /></TabsContent>
        <TabsContent value="notifications"><div className="grid gap-6 lg:grid-cols-2"><Panel title="Student alerts" description="Choose which events prepare a mobile notification"><div className="divide-y px-5"><Preference label="Attendance updates" description="Alert students after attendance changes." checked={preferences.attendanceAlerts} onChange={(checked) => setPreferences((p) => ({ ...p, attendanceAlerts: checked }))} /><Preference label="Fee reminders" description="Notify students before fee due dates." checked={preferences.feeReminders} onChange={(checked) => setPreferences((p) => ({ ...p, feeReminders: checked }))} /><Preference label="Published results" description="Alert students when results are published." checked={preferences.resultAlerts} onChange={(checked) => setPreferences((p) => ({ ...p, resultAlerts: checked }))} /><Preference label="New assignments" description="Notify targeted classes about assignments." checked={preferences.assignmentAlerts} onChange={(checked) => setPreferences((p) => ({ ...p, assignmentAlerts: checked }))} /></div></Panel><Panel title="Administrator updates" description="Internal digest and delivery options"><div className="p-5"><Preference label="Weekly operations digest" description="Prepare a weekly summary for college administrators." checked={preferences.weeklyDigest} onChange={(checked) => setPreferences((p) => ({ ...p, weeklyDigest: checked }))} /><div className="mt-5 rounded-lg bg-muted/60 p-4 text-xs text-muted-foreground">These are frontend preferences only. No push messages or emails are sent without a connected delivery service.</div><Button className="mt-5" onClick={savePreferences}><Save />Save preferences</Button><Button asChild variant="outline" className="ml-2"><Link to="/college/notifications"><BellRing />Open notifications</Link></Button></div></Panel></div></TabsContent>
        <TabsContent value="mobile"><div className="grid gap-6 lg:grid-cols-2"><Panel title="Flutter app connection" description="Identifiers your existing student app can use"><div className="space-y-5 p-5"><div className="space-y-2"><Label htmlFor="college-id">College identifier</Label><div className="flex gap-2"><Input id="college-id" readOnly value={college.id} /><Button variant="outline" size="icon" aria-label="Copy college identifier" onClick={() => { navigator.clipboard?.writeText(college.id); toast.success("College ID copied"); }}><Copy /></Button></div></div><div className="space-y-2"><Label htmlFor="mobile-channel">Mobile channel name</Label><Input id="mobile-channel" value={mobileChannel} onChange={(e) => setMobileChannel(e.target.value)} /></div><Button onClick={saveMobile}><Save />Save mobile settings</Button></div></Panel><Panel title="Integration status" description="Current mock-data preview capabilities"><ul className="divide-y">{[{ icon: Database, title: "Shared college records", text: "Mock collections mirror the mobile data shapes.", status: "Preview ready" }, { icon: Smartphone, title: "Realtime mobile sync", text: "Requires a connected shared backend.", status: "Not connected" }, { icon: BellRing, title: "Push delivery", text: "Requires Firebase or another delivery provider.", status: "Not connected" }].map((item) => <li key={item.title} className="flex gap-3 px-5 py-4"><item.icon className="mt-0.5 size-4 text-primary" /><div className="flex-1"><p className="text-sm font-medium">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.text}</p></div><span className="text-xs text-muted-foreground">{item.status}</span></li>)}</ul></Panel></div></TabsContent>
      </Tabs>
    </div>
  );
}

function Preference({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <div className="flex items-center gap-4 py-4"><div className="min-w-0 flex-1"><Label>{label}</Label><p className="mt-1 text-xs text-muted-foreground">{description}</p></div><Switch checked={checked} onCheckedChange={onChange} /></div>;
}
