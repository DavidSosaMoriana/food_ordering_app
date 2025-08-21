import { CreateUserParams, SignInParams } from "@/type";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: "com.dsm.foodordering",
  project: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: "688a5ef600270c9b845b",
  userCollectionId: "688a60640033e319f896",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.project)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw Error;

        // Check if there's already an active session before signing in
    try {
      const currentSession = await account.getSession("current");
      if (!currentSession) {
        await signIn({ email, password });
      }
    } catch {
      // No active session, sign in
      await signIn({ email, password });
    }

    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { email, name, accountId: newAccount.$id, avatar: avatarUrl }
    );
  } catch (error) {
    throw new Error(error as string);
  }
};
export const signIn = async ({ email, password }: SignInParams) => {
  try {
    // First check if there's already an active session
    try {
      const currentSession = await account.getSession("current");
      if (currentSession) {
        // If there's an active session, return it
        return currentSession;
      }
    } catch {
      // No active session, continue with login
    }

    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) return null;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser?.documents?.length) return null;

    return currentUser.documents[0];
  } catch (error) {
    console.log("getCurrentUser error:", error);
    return null;
  }
};

export const signOut = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.log("SignOut error:", error);
    throw new Error(error as string);
  }
};

export const isUserLoggedIn = async (): Promise<boolean> => {
  try {
    const currentAccount = await account.get();
    return !!currentAccount;
  } catch {
    return false;
  }
};
