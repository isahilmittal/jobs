import { config } from 'dotenv';
config();

import '@/ai/flows/generate-tags-from-job-description.ts';
import '@/ai/flows/suggest-job-description.ts';
import '@/ai/flows/enhance-resume.ts';
import '@/ai/flows/parse-resume-from-file.ts';
