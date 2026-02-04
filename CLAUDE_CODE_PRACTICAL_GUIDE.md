# Practical Guide: Converting UI Designs to Code with Claude Code

## 🎯 Quick Start (5 minutes)

### What You Need
1. High-quality screenshots of your UI designs (1920x1080 px minimum)
2. Access to Claude (Pro or API)
3. Your Next.js project open

### The Process
```
Design Screenshot
    ↓
Upload to Claude Code
    ↓
Claude generates component code
    ↓
Copy/Paste into project
    ↓
Test in browser
    ↓
Ask for refinements
    ↓
Done!
```

---

## 📸 PREPARING YOUR DESIGN SCREENSHOTS

### Best Practices

**✅ DO:**
- Use high resolution (1920x1080 or higher)
- Full page screenshot (no cropping)
- Good lighting (no glare)
- Clean UI (no cursor, shadows, or artifacts)
- Consistent design language
- Include all variants (hover states, mobile, desktop)

**❌ DON'T:**
- Low resolution (<800px width)
- Partial screenshots (zoom in too much)
- Blurry images
- Too many unrelated designs in one image
- Mobile designs mixed with desktop

### Getting Screenshots

**From Figma:**
```
1. Right-click artboard
2. Copy as PNG (at 2x scale for high-res)
3. Save to your computer
```

**From Sketch:**
```
1. Export artboard → PNG (3x scale)
2. Save to your computer
```

**From design tool (generic):**
```
1. Export → PNG format
2. Set scale to 2x or higher
3. Save
```

**From website screenshot:**
```
# Mac
Cmd + Shift + 4 → Select area → Screenshot saved

# Windows
Shift + Windows + S → Select area → Screenshot saved

# Chrome DevTools
F12 → Cmd/Ctrl+Shift+P → "Capture screenshot"
```

---

## 🔄 THE WORKFLOW: Step-by-Step

### Step 1: Prepare Your Context Document

Before you upload ANY design, create a document like this:

```markdown
# DubaiVille UI-to-Code Context

## Stack
- Framework: Next.js 14 with App Router
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS
- Component Library: ShadCN/UI
- Icons: Lucide React
- Charts: Recharts (if needed)

## Design System

### Colors
- Primary: #10b981 (emerald-600)
- Secondary: #0f172a (slate-900)
- Accent: #f97316 (orange-600)
- Background: #f8fafc (slate-50)
- Border: #e2e8f0 (slate-200)

### Typography
- Heading 1 (H1): Bold, 3rem (48px)
- Heading 2 (H2): Bold, 2rem (32px)
- Heading 3 (H3): Semibold, 1.5rem (24px)
- Body: Regular, 1rem (16px)
- Small: Regular, 0.875rem (14px)

### Components
- Buttons: Use ShadCN Button (size: sm, md, lg)
- Cards: Use ShadCN Card (no shadow by default)
- Inputs: Use ShadCN Input (no borders by default)
- Modals: Use ShadCN Dialog
- Dropdowns: Use ShadCN Select

### Spacing
- Base unit: 4px (Tailwind default)
- Padding: Use Tailwind spacing scale (p-4, p-6, p-8)
- Margins: Use Tailwind spacing scale

### Patterns
- Mobile-first responsive design
- Dark mode support (future phase)
- Accessibility: WCAG AA compliant

## Project Structure
- Components live in: src/components/
- Pages live in: src/app/
- Utilities in: src/lib/
```

### Step 2: Upload Design to Claude

**Conversation Starter:**
```
I'm converting my DubaiVille real estate platform UI designs to code.

Here's my design context: [paste your context document above]

First design: [Landing Page]

[Upload screenshot]

Please convert this to a Next.js component. Follow my design system above.
Output should be:
- Fully responsive (mobile-first)
- TypeScript
- Use ShadCN/UI components where possible
- Tailwind for styling
- Production-ready code
```

### Step 3: Claude Generates Code

Claude will output something like:

```typescript
// components/landing.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Home, TrendingUp } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          Find Your Perfect Villa in Dubai
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          AI-powered matching for luxury real estate
        </p>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          Get Started <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* ... more content ... */}
      </section>
    </div>
  );
}
```

### Step 4: Copy & Paste into Project

```bash
# Create the file if it doesn't exist
touch src/components/landing.tsx

# Copy Claude's code into the file
# (Cmd+C from Claude, Cmd+V into your editor)
```

### Step 5: Test in Browser

```bash
# Start dev server
npm run dev

# Visit http://localhost:3000/landing
# Check if it looks like the design
```

### Step 6: Request Refinements

If something's not quite right:

```
"The hero image needs to be larger. 
Also, can you make the button text white and add a shadow?
And the spacing between sections should be bigger on mobile."
```

Claude refines immediately. Copy → Paste → Test again.

### Step 7: Repeat for Each Component

```
Landing page ✅
Profile builder ✅
Dashboard ✅
Blog ✅
Navigation ✅
Footer ✅
...
```

---

## 📋 PRACTICAL EXAMPLES

### Example 1: Converting a Simple Card Design

**You upload:** Screenshot of a property card

**You ask:**
```
Convert this property card to a React component.
It should show:
- Property image
- Title
- Price
- Bedrooms/bathrooms
- View count
- Contact button

Use ShadCN Card and Button. Make it hover-interactive.
```

**Claude outputs:**
```typescript
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Bed, Bath } from 'lucide-react';

interface PropertyCardProps {
  image: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  views: number;
}

export function PropertyCard({
  image,
  title,
  price,
  bedrooms,
  bathrooms,
  views,
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-2xl font-bold text-emerald-600 mb-4">
          {price.toLocaleString()} AED
        </p>
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <Bed className="w-4 h-4" />
            {bedrooms} BR
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <Bath className="w-4 h-4" />
            {bathrooms} BA
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <Eye className="w-4 h-4" />
            {views}
          </div>
        </div>
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
          View Details
        </Button>
      </div>
    </Card>
  );
}
```

**You test:** Copy → Paste → npm run dev → Check design ✅

---

### Example 2: Dashboard with Multiple Sections

**You upload:** Screenshot of admin dashboard

**You ask:**
```
Convert this admin dashboard. It has:
1. Header with logo + navigation
2. KPI cards section (4 cards)
3. Main content area with tabs
4. Charts section

Make it responsive. Use Recharts for charts.
Keep colors consistent with our design system.
```

**Claude outputs:** ~1000 lines of production code with:
- Navigation component
- KPI card component
- Tabs implementation
- Chart components
- Responsive layout
- TypeScript types

---

### Example 3: Form with Validation

**You upload:** Screenshot of profile builder form

**You ask:**
```
Convert this multi-step form to a React component.

Steps:
1. Property type selection
2. Income & budget
3. Preferences (bedrooms, communities)
4. Contact info

Add form validation. Use React Hook Form.
Include error messages.
Make it mobile-friendly.
```

**Claude outputs:** Complete form with:
- Step management
- Form validation
- Error handling
- Mobile responsive
- TypeScript types
- Accessibility features

---

## 🎨 DESIGN SYSTEM CONTEXT TO SHARE

Copy this template and customize for your project:

```markdown
# Design System for AI Code Generation

## Component Library
- Base: ShadCN/UI
- Icons: Lucide React (all icons from lucide-react)
- Charts: Recharts (for line/bar charts)
- Forms: React Hook Form + Zod validation

## Color Palette
```typescript
const colors = {
  // Primary
  primary: '#10b981', // emerald-600
  primary_light: '#d1fae5', // emerald-100
  primary_dark: '#059669', // emerald-700
  
  // Secondary
  secondary: '#0f172a', // slate-900
  secondary_light: '#f1f5f9', // slate-100
  
  // Status
  success: '#10b981', // emerald-600
  warning: '#f59e0b', // amber-500
  error: '#ef4444', // red-500
  info: '#3b82f6', // blue-500
};
```

## Typography Scale
```
Display: 3.5rem bold
H1: 2.25rem bold
H2: 1.875rem bold
H3: 1.5rem semibold
Body: 1rem regular
Small: 0.875rem regular
```

## Spacing System (4px base)
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

## Responsive Breakpoints
```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

## Components Usage
- Button sizes: sm, md, lg (default: md)
- Card: no shadow, border-light
- Input: no border, border-bottom style
- Select: ShadCN Select
```

---

## ⚡ TIME ESTIMATES

### Per Component Type

| Component | Complexity | Time to Generate | Time to Refine | Total |
|-----------|------------|------------------|----------------|-------|
| Simple button | ⭐ | 1 min | 2 min | 3 min |
| Card component | ⭐⭐ | 2 min | 5 min | 7 min |
| Form with 5 fields | ⭐⭐ | 3 min | 8 min | 11 min |
| Dashboard page | ⭐⭐⭐ | 5 min | 15 min | 20 min |
| Complex page (hero + forms) | ⭐⭐⭐⭐ | 8 min | 20 min | 28 min |
| Entire flow (5+ pages) | ⭐⭐⭐⭐⭐ | 15 min | 45 min | 60 min |

### Sample Project: DubaiVille

| Component | Time |
|-----------|------|
| Landing page | 20 min |
| Profile builder | 20 min |
| Dashboard | 30 min |
| Blog/Editorial | 25 min |
| Navigation/Footer | 10 min |
| All components | 115 min (under 2 hours) |

---

## 🚀 ADVANCED TECHNIQUES

### Technique 1: Batch Multiple Components

**Instead of:** One screenshot at a time

**Do this:**
```
I have 5 component designs. Here's the context [...]

Component 1: [Screenshot] → Landing page hero
Component 2: [Screenshot] → Feature cards
Component 3: [Screenshot] → CTA section
Component 4: [Screenshot] → Navigation
Component 5: [Screenshot] → Footer

Generate code for all. Use consistent styling across all components.
```

**Result:** All 5 components in one conversation. Faster!

### Technique 2: Design System First

Before generating ANY component:

```
Here's my design system [context document]

Now, generate a reusable button component library 
that follows this system. Include variants: primary, 
secondary, outline, ghost.
Include sizes: sm, md, lg.
```

Then use this baseline for all future components.

### Technique 3: Iterative Refinement

```
1. "Generate the basic layout"
2. "Add these specific colors"
3. "Make the spacing match the design"
4. "Add hover effects"
5. "Make it responsive"
6. "Add animations"
```

Each refinement is quick (1-2 minutes).

### Technique 4: Mobile-First Generation

```
I have desktop design [screenshot]

Generate component that:
1. Looks perfect on mobile (320px)
2. Scales to tablet (768px)
3. Scales to desktop (1920px)

Use mobile-first approach (min-width breakpoints).
```

---

## 🐛 TROUBLESHOOTING

### Problem: Colors don't match design

**Solution:**
```
"The background should be exactly #f1f5f9 (not white).
The text should be #0f172a (not black).
Use these exact hex codes."
```

### Problem: Spacing is off

**Solution:**
```
"Increase padding by 50% on the top and bottom.
The gap between sections should be 48px (3xl), not 32px.
Use explicit Tailwind classes: py-20 gap-12"
```

### Problem: Component looks different on mobile

**Solution:**
```
"On mobile:
- Font size should be smaller (text-lg instead of text-2xl)
- Padding should be p-4 instead of p-8
- Grid should be 1 column, not 3

Show me the mobile-first responsive design."
```

### Problem: Missing interactivity

**Solution:**
```
"Add click handlers to buttons.
Make cards clickable (cursor-pointer + hover effect).
Add form validation with React Hook Form.
Show loading states on submit."
```

---

## 📝 CHECKLIST FOR EACH COMPONENT

Before you consider a component "done":

- [ ] Design matches screenshot (colors, spacing, typography)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] All interactive elements work (buttons, forms, etc.)
- [ ] TypeScript types are correct
- [ ] ShadCN/UI components used properly
- [ ] Tailwind classes are correct
- [ ] No console errors
- [ ] Accessibility features included (alt text, aria labels, etc.)
- [ ] Code is clean and readable
- [ ] Component follows project structure

---

## 🎯 PRO TIPS

1. **Screenshot Quality Matters**
   - Higher quality = better results
   - Zoom to 100% when screenshotting
   - Include all details (shadows, borders, hover states)

2. **Context is Key**
   - Share design system upfront
   - Tell Claude what framework/libraries you're using
   - Include color codes and typography specs

3. **Batch Similar Components**
   - Group related components together
   - Use one design system conversation
   - Saves time and ensures consistency

4. **Test Immediately**
   - Copy-paste → npm run dev → check
   - Find issues early
   - Request refinements while context is fresh

5. **Build Component Library First**
   - Generate basic components (buttons, cards, inputs)
   - Then use those in larger components
   - Faster and more consistent

6. **Ask for Multiple Variants**
   - "Generate button in 3 sizes and 4 variants"
   - More efficient than one-by-one
   - Ensures consistency

---

## 📞 WHEN TO ASK FOR HELP

**Ask Claude Code to:**
- ✅ Convert layout to code
- ✅ Generate TypeScript interfaces
- ✅ Add responsive behavior
- ✅ Implement form validation
- ✅ Add animations/transitions
- ✅ Create component variants

**You should do:**
- ❌ Connect to APIs (you know your backend)
- ❌ Add business logic (specific to your domain)
- ❌ Setup routing (you know your app structure)
- ❌ Integrate with state management (app-specific)

---

## 🎓 FINAL CHECKLIST: Ready to Start?

- [ ] Design screenshots ready (1920x1080+ resolution)
- [ ] Design system documented
- [ ] Next.js project setup complete
- [ ] ShadCN/UI installed
- [ ] Tailwind CSS configured
- [ ] Access to Claude Code
- [ ] Ready to copy/paste code

**If you have all ✅ - You're ready to go!**

Start with: Landing page → Profile builder → Dashboard

---

## 🚀 Next Steps

1. Prepare your design screenshots
2. Write your design system context
3. Upload first design to Claude Code
4. Follow the workflow above
5. Test in your project
6. Request refinements
7. Rinse & repeat

**Estimated time to full UI:** 8-12 hours (for complete DubaiVille app)

Good luck! 🎨💻

