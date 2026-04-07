import { Client, Databases } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT);

export const databases = new Databases(client);

export const DATABASE_ID = process.env.REACT_APP_APPWRITE_DATABASE_ID;
export const COLLECTION_ID = process.env.REACT_APP_APPWRITE_COLLECTION_ID;