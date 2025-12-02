import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const value = (searchParams.get("value") ?? "").trim();

    if (!value) return Response.json([]);

    const { data, error } = await supabase
        .from("boards")
        .select("*")
        .ilike("title", `%${value}%`)
        .order("created_at", { ascending: false });

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
}
