// import { NextResponse } from "next/server";

// export async function GET(req: Request, { params }: any) {
//     const res = await fetch(`https://api.clerk.com/v1/users/${params.id}`, {
//         headers: {
//             Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
//         },
//     });

//     const data = await res.json();
//     return NextResponse.json(data);
// }
// src/app/api/users/[id]/route.ts
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(params.id);
        return NextResponse.json(user);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
