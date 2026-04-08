import { Client, Databases } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT);

export const databases = new Databases(client);

export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
export const COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID;