
'use server';

import { z } from 'zod';
import type { Subscriber } from './types';
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs,getCountFromServer, Timestamp } from 'firebase/firestore';


const emailSchema = z.string().email();
const subscribersCollection = collection(db, 'subscribers');


export async function addSubscriber(email: string): Promise<{success: boolean; message: string}> {
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
        return { success: false, message: 'Invalid email address provided.' };
    }

    const q = query(subscribersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
         return { success: false, message: 'This email is already subscribed.' };
    }
    
    await addDoc(subscribersCollection, {
        email,
        subscribedAt: Timestamp.now(),
    });
    
    return { success: true, message: 'Successfully subscribed!' };
}


export async function getSubscriberCount(): Promise<number> {
    const snapshot = await getCountFromServer(subscribersCollection);
    return snapshot.data().count;
}
