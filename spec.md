# Vestige AI Health Assistant

## Current State
A React + Motoko app with:
- Voice AI assistant (4 topics: joint pain, hair fall, digestion, immunity)
- 4 product cards with generated images (Glucosamine, Aloe Vera Juice, Curcumin Plus, Hair Serum)
- Contact form (frontend-only, no persistence -- just shows a toast)
- WhatsApp link to Prashanth Reddy
- Backend has empty interface (no stored data)

## Requested Changes (Diff)

### Add
- AI voice responses for: diabetes, blood pressure, weight loss, skin problems, stress/sleep, energy/fatigue, cholesterol, bone health
- Quick hint chips for new topics
- Backend: `submitInquiry(name, phone, problem)` to store contact form submissions
- Backend: `getInquiries()` for admin (Prashanth) to view all stored submissions
- Admin dashboard page (protected by authorization) showing all contact inquiries in a table
- New/original product images generated for each product card

### Modify
- `getAIReply()` function expanded with new health topic handlers
- Contact form `handleContactSubmit` to call backend `submitInquiry` instead of just showing a toast
- Product image paths updated to new generated images

### Remove
- Nothing removed

## Implementation Plan
1. Select `authorization` Caffeine component
2. Generate Motoko backend with `submitInquiry` / `getInquiries` / admin access
3. Generate 4 new product images (more realistic product photography style)
4. Update `App.tsx`:
   - Expand `getAIReply` with 8+ new health topics
   - Add new quick hint chips row
   - Wire contact form to backend `submitInquiry`
   - Add admin login/dashboard section showing inquiry list
   - Update product image references
