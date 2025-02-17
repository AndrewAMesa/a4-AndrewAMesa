import { MongoClient } from "mongodb";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

const client = new MongoClient(process.env.MONGO_URI!);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                const db = (await clientPromise).db();
                const user = await db.collection("users").findOne({ email: credentials.email });

                if (!user || user.password !== credentials.password) return null

                return { id: user._id.toString(), email: user.email };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
};

export const handler = NextAuth(authOptions);
export { handler as GET };
export { handler as POST };
export { handler as DELETE };