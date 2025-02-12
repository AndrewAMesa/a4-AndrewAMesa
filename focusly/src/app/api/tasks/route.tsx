import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const dbconnect = new MongoClient(process.env.MONGO_URI!);
let tasksCollection: any = null;

// Ensure the DB connection is established once
async function connectDB() {
    if (!tasksCollection) {
        await dbconnect.connect();
        const db = dbconnect.db("cs4241");
        tasksCollection = db.collection("tasks");
    }
}

export async function GET(req: Request) {
    await connectDB();
    const username = req.headers.get("x-username");
    const userTasks = await tasksCollection.find({ username }).toArray();
    return NextResponse.json(userTasks);
}

export async function POST(req: Request) {
    await connectDB();
    const { task, priority, deadline_date } = await req.json();
    const username = req.headers.get("x-username");
    const creationDate = new Date();
    const deadlineDate = new Date(deadline_date);
    const plannedDuration = Math.ceil((deadlineDate.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));

    const newTask = {
        username,
        task,
        priority,
        creation_date: creationDate,
        deadline_date: deadlineDate,
        planned_duration: plannedDuration,
    };

    const result = await tasksCollection.insertOne(newTask);
    return NextResponse.json({ message: "Task added successfully!", insertedId: result.insertedId });
}
