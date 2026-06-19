import { z } from 'zod';

// ── SIGN IN ──────────────────────────────────────────
export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

// ── SIGN UP ──────────────────────────────────────────
export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required').min(2, 'Name is too short'),
    email: z.string().min(1, 'Email is required').email('Valid email required'),
    mobile: z
        .string()
        .min(1, 'Mobile number is required')
        .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    referralCode: z.string().optional(),
    terms: z.literal(true, {
        errorMap: () => ({ message: 'You must accept the Terms & Privacy Policy' }),
    }),
});
