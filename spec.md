# Vestige AI Health Assistant

## Current State
Basic React frontend exists from previous build. Need to completely replace with a Vestige health product assistant.

## Requested Changes (Diff)

### Add
- Header with "Vestige AI Health Assistant" branding
- Navigation: Home, AI Assistant, Products, Contact
- Hero/Home section with welcome message
- AI Voice Assistant section: microphone button, speech recognition (webkitSpeechRecognition), AI reply via SpeechSynthesis
  - Keyword mapping: joint pain -> Glucosamine, hair fall -> Hair Serum, gas/digestion -> Aloe Vera Juice, immunity -> Curcumin Plus
- Products section with 4 product cards: Glucosamine, Aloe Vera Juice, Curcumin Plus, Hair Serum
- Contact section with form (Name, Phone, Health Problem) and WhatsApp button linking to +918008400864
- Footer: © 2026 Prashanth Reddy | Vestige AI Assistant

### Modify
- Replace all previous landing page content

### Remove
- Previous Vestige AI generic landing page

## Implementation Plan
1. Build React frontend matching the provided HTML/CSS/JS
2. Implement voice recognition and speech synthesis in React
3. Green (#22c55e) color scheme on dark background
4. Contact form with WhatsApp CTA
