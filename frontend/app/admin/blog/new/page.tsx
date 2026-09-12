import { AdminShell } from "@/components/admin/AdminShell";
import { BlogEditor } from "@/components/admin/BlogEditor";
export default function NewBlogPage(){return <AdminShell active="Blog" title="New Blog post" subtitle="Shape a thoughtful story, then save it as a draft or publish it."><BlogEditor/></AdminShell>}
