import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import { getServerSession } from "next-auth";

const client = new MongoClient(process.env.MONGO_URI!);
const clientPromise = client.connect();

export async function GET() {
    await clientPromise;
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = (await clientPromise).db();
    const tasks = await db.collection("tasks").find({ email: session.user?.email || "" }).toArray();

    return NextResponse.json(tasks);
}

export async function POST(req: Request) {
    await clientPromise;
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { task, priority, deadline_date } = await req.json();
    const email = session.user?.email || "";
    const creationDate = new Date();
    const deadlineDate = new Date(deadline_date);
    const plannedDuration = Math.ceil((deadlineDate.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));

    const newTask = {
        email,
        task,
        priority,
        creation_date: creationDate,
        deadline_date: deadlineDate,
        planned_duration: plannedDuration,
    };

    const result = await (await clientPromise).db().collection("tasks").insertOne(newTask);
    return NextResponse.json({ message: "Task added successfully!", insertedId: result.insertedId });
}
