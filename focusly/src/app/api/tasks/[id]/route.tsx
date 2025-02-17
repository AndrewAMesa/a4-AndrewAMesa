import { NextResponse } from "next/server";
import {Collection, Db, MongoClient, ObjectId} from "mongodb";
import { authOptions } from "../../../../../lib/auth";
import { getServerSession } from "next-auth";

const client = new MongoClient(process.env.MONGO_URI!);
const clientPromise = client.connect();

let db: Db;
let tasksCollection: Collection;

async function initializeDB() {
    if (!db) {
        await clientPromise;
        db = client.db();
        tasksCollection = db.collection("tasks");
    }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
    await initializeDB();

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;

    const { task, priority, deadline_date } = await req.json();

    const existingTask = await tasksCollection.findOne({ _id: new ObjectId(id) });
    if (!existingTask) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const deadlineDate = new Date(deadline_date);
    const plannedDuration = Math.ceil(
        (deadlineDate.getTime() - new Date(existingTask.creation_date).getTime()) / (1000 * 60 * 60 * 24)
    );

    await tasksCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { task, priority, deadline_date: deadlineDate, planned_duration: plannedDuration } }
    );

    return NextResponse.json({ message: "Task updated successfully!" });
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
    await initializeDB();

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;

    const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully!" });
}
