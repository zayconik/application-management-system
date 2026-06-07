'use server'
import { IApplication } from "@/mongodb/models/application";
import { IUser } from "@/mongodb/models/user";
import { currentUser } from "@clerk/nextjs/server";
import { Application } from "@/mongodb/models/application";
import { revalidatePath } from "next/cache";
import connectDB from "@/mongodb/db";


export interface ApplicationSubmitBody {
    user: IUser;
    title: string;
    description?: string;
    applicationId: string;
    status: string;
}

function generateApplicationID() {
    const prefix = 'AMSNITS';

    // Get current timestamp in milliseconds (13 digits)
    const timestamp = Date.now().toString();

    // Generate a random number to fill in the remaining digits
    const randomPart = Math.floor(Math.random() * 100000).toString().padStart(5, '0');

    // Combine the timestamp and random part to form the unique part (11 digits)
    const uniquePart = timestamp.slice(-6) + randomPart;

    // Combine with the prefix to form the full ID
    const applicationID = prefix + uniquePart;

    return applicationID;
}

async function createApplicationAction(formData: FormData){
    await connectDB();
    const user = await currentUser();
    if (!user) {
        throw new Error('You must be signed in to create an application');
    }

    const applicationTitle = (formData.get('apptitle') as string)?.trim();
    const applicationDescription = (formData.get('appdescription') as string)?.trim() || "";

    if (!applicationTitle) {
        throw new Error('Please provide a title');
    }

    const randomApplicationId = generateApplicationID();
    const status = 'pending';
    const userEmail = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || "";

    const userDB: IUser = {
        userId: user.id,
        firstName: user.firstName || "User",
        lastName: user.lastName || "",
        email: userEmail

      }
    try {
        const body: IApplication = {
            user: userDB,
            title: applicationTitle,
            description: applicationDescription,
            applicationId: randomApplicationId,
            status: status,
            createdAt: new Date(),
        }
        await Application.create(body);
        revalidatePath('/');
        revalidatePath('/status');
        return { success: true, applicationId: randomApplicationId };

    } catch (error) {
        console.error("Failed to Create Application in createApplicationAction", error);
        const message = error instanceof Error ? error.message : 'Failed to create application';
        throw new Error(message);
    }
}

export default createApplicationAction