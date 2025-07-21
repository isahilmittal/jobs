
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { z } from 'zod';

const emailSchema = z.string().email();

export async function addSubscriber(email: string): Promise<{success: boolean; message: string}> {
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
        return { success: false, message: 'Invalid email address provided.' };
    }

    const subscribersCol = collection(db, 'subscribers');

    // Check if email already exists
    const q = query(subscribersCol, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return { success: false, message: 'This email is already subscribed.' };
    }

    try {
        await addDoc(subscribersCol, {
            email: email,
            subscribedAt: new Date(),
        });
        return { success: true, message: 'Successfully subscribed!' };
    } catch (error: any) {
        console.error("Error adding subscriber: ", error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


export async function getSubscriberCount(): Promise<number> {
    try {
        const subscribersCol = collection(db, 'subscribers');
        const snapshot = await getDocs(subscribersCol);
        return snapshot.size;
    } catch (error) {
        console.error("Error getting subscriber count:", error);
        return 0;
    }
}
