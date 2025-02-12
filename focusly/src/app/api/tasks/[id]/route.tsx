import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const dbconnect = new MongoClient(process.env.MONGO_URI!);
let tasksCollection: any = null;

async function connectDB() {
    if (!tasksCollection) {
        await dbconnect.connect();
        const db = dbconnect.db("cs4241");
        tasksCollection = db.collection("tasks");
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = params;
    const { task, priority, deadline_date } = await req.json();

    const existingTask = await tasksCollection.findOne({ _id: new ObjectId(id) });
    if (!existingTask) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    const deadlineDate = new Date(deadline_date);
    const plannedDuration = Math.ceil((deadlineDate.getTime() - new Date(existingTask.creation_date).getTime()) / (1000 * 60 * 60 * 24));

    await tasksCollection.updateOne({ _id: new ObjectId(id) }, { $set: { task, priority, deadline_date: deadlineDate, planned_duration: plannedDuration } });

    return NextResponse.json({ message: "Task updated successfully!" });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = params;
    const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully!" });
}
