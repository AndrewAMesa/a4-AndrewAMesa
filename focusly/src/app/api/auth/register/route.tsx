import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const client = new MongoClient(process.env.MONGO_URI!);
const clientPromise = client.connect();

export async function POST(req: Request) {
    await clientPromise;

    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const db = (await clientPromise).db();
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
        return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }


    const result = await db.collection("users").insertOne({
        email,
        password: password
    });

    return NextResponse.json({ message: "User registered successfully", insertedId: result.insertedId });
}
