import { AdminShell } from "@/components/admin/AdminShell";
import { BlogEditor } from "@/components/admin/BlogEditor";
export default async function EditBlogPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <AdminShell active="Blog" title="Edit Blog post" subtitle="Update content, media, and publication status."><BlogEditor id={id}/></AdminShell>}
