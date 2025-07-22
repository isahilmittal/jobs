
'use server';

// Firestore imports are removed.
import { z } from 'zod';
import type { Subscriber } from './types';

const emailSchema = z.string().email();

// In-memory array to store subscribers
let memorySubscribers: Subscriber[] = [];


export async function addSubscriber(email: string): Promise<{success: boolean; message: string}> {
    console.log("Using in-memory subscribers data. Firestore is disconnected.");
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
        return { success: false, message: 'Invalid email address provided.' };
    }

    // Check if email already exists
    if (memorySubscribers.some(sub => sub.email === email)) {
        return { success: false, message: 'This email is already subscribed.' };
    }
    
    const newSubscriber: Subscriber = {
        id: `sub-${memorySubscribers.length + 1}-${Date.now()}`,
        email,
        subscribedAt: new Date(),
    };
    memorySubscribers.push(newSubscriber);
    return { success: true, message: 'Successfully subscribed!' };
}


export async function getSubscriberCount(): Promise<number> {
    console.log("Using in-memory subscribers data. Firestore is disconnected.");
    return memorySubscribers.length;
}
