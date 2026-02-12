# TimePics.ai Design System

**Generated:** 2026-02-11
**Project:** AI-powered visual time machine for generating temporal images as Solana NFTs

---

## 🎨 Brand Identity

**Positioning:** Premium AI creative tool for time-themed image generation
**Personality:** Futuristic, innovative, trustworthy, creative, professional
**Target Audience:** Crypto enthusiasts, NFT collectors, AI art creators, tech-savvy users

---

## 🎭 Pattern: AI-Driven Dynamic Landing

**Structure:**
1. **Hero:** Prompt/Input showcase with immediate value demonstration
2. **Time Engines:** Three interactive engine cards (Rewind, Refract, Foresee)
3. **How It Works:** Step-by-step process visualization
4. **Social Proof:** Generated images showcase
5. **CTA:** Multiple conversion points (floating + inline)

**Strategy:** Show, don't tell. Immediate value demonstration. Low friction start.

---

## 🎨 Color System

### Primary Palette

| Role | Hex | Usage | Tailwind |
|------|-----|-------|----------|
| **Primary** | `#8B5CF6` | Main brand color, CTAs, highlights | `purple-500` |
| **Secondary** | `#A78BFA` | Accents, hover states | `purple-400` |
| **CTA** | `#FBBF24` | Action buttons, important highlights | `amber-400` |
| **Background** | `#0F0F23` | Page background (OLED dark) | Custom |
| **Text** | `#F8FAFC` | Primary text | `slate-50` |

### Semantic Colors

| Role | Hex | Usage |
|------|-----|-------|
| **Success** | `#10B981` | Success states, confirmations |
| **Warning** | `#F59E0B` | Warnings, alerts |
| **Error** | `#EF4444` | Errors, destructive actions |
| **Info** | `#3B82F6` | Information, tips |

### Surface Colors

| Role | Hex | Opacity | Usage |
|------|-----|---------|-------|
| **Card** | `#1A1A2E` | - | Card backgrounds |
| **Card Border** | `#2A2A3E` | - | Card borders |
| **Muted** | `#4A4A5E` | - | Disabled elements |
| **Muted Text** | `#94A3B8` | - | Secondary text |

### Gradient System

```css
/* Time Travel Gradient */
--gradient-time: linear-gradient(135deg, #8B5CF6, #A78BFA, #3B82F6);

/* CTA Gradient */
--gradient-cta: linear-gradient(135deg, #FBBF24, #F59E0B);

/* Card Glow */
--glow-primary: rgba(139, 92, 246, 0.3);
--glow-secondary: rgba(167, 139, 250, 0.2);
--glow-cta: rgba(251, 191, 36, 0.3);
```

---

## 📝 Typography

### Font Stack

**Display/Headings:** [Orbitron](https://fonts.google.com/specimen/Orbitron)
- Bold (700), Semi-bold (600), Medium (500)
- Use for: H1, H2, H3, Logo, Engine names

**Body/UI:** [Exo 2](https://fonts.google.com/specimen/Exo+2)
- Regular (400), Medium (500), Semi-bold (600)
- Use for: Body text, buttons, labels, descriptions

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### CSS Variables

```css
:root {
  --font-heading: 'Orbitron', 'Courier New', monospace;
  --font-body: 'Exo 2', system-ui, -apple-system, sans-serif;
}
```

### Scale & Usage

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| **H1 Hero** | Orbitron | 4rem (64px) | 700 | 1.1 |
| **H2 Section** | Orbitron | 2.5rem (40px) | 600 | 1.2 |
| **H3 Card** | Orbitron | 1.5rem (24px) | 600 | 1.3 |
| **Body Large** | Exo 2 | 1.125rem (18px) | 400 | 1.6 |
| **Body** | Exo 2 | 1rem (16px) | 400 | 1.6 |
| **Small** | Exo 2 | 0.875rem (14px) | 400 | 1.5 |
| **Button** | Exo 2 | 1rem (16px) | 600 | 1 |

---

## ✨ Visual Effects

### Glow Effects

```css
/* Text Glow (subtle) */
.text-glow {
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
}

/* Card Glow */
.card-glow {
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
}

/* Button Glow (hover) */
.button-glow:hover {
  box-shadow: 0 0 30px rgba(251, 191, 36, 0.4);
}
```

### Transitions

| Element | Property | Duration | Timing |
|---------|----------|----------|--------|
| **Hover** | all | 200ms | ease |
| **Focus** | ring | 150ms | ease-out |
| **Modal** | opacity, scale | 300ms | ease-in-out |
| **Page** | opacity | 150ms | ease |

### Animation Guidelines

- ✅ **Do:** Use for feedback, loading, micro-interactions
- ✅ **Do:** Respect `prefers-reduced-motion`
- ❌ **Don't:** Use continuous animations on decorative elements
- ❌ **Don't:** Use animations longer than 500ms for micro-interactions

---

## 🎯 Component Patterns

### Buttons

**Primary CTA:**
```tsx
bg-gradient-to-r from-amber-400 to-orange-500
text-slate-900 font-semibold
hover:shadow-lg hover:scale-105
transition-all duration-200
```

**Secondary:**
```tsx
bg-purple-500 hover:bg-purple-400
text-white font-medium
border border-purple-400
transition-colors duration-200
```

**Ghost:**
```tsx
bg-transparent border-2 border-purple-500
text-purple-400 hover:bg-purple-500/10
transition-all duration-200
```

### Cards

**Engine Card:**
```tsx
bg-gradient-to-br from-slate-900/50 to-slate-800/50
backdrop-blur-xl border border-slate-700
rounded-2xl p-6
hover:shadow-2xl hover:border-purple-500
transition-all duration-300
```

**NFT Card:**
```tsx
bg-slate-900/80 backdrop-blur-md
rounded-xl overflow-hidden
hover:transform hover:scale-105
transition-all duration-200
```

### Focus States

**All Interactive Elements:**
```tsx
focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900
```

---

## ♿ Accessibility

### Contrast Ratios

| Text Type | Minimum | Current |
|-----------|---------|---------|
| **Normal Text** | 4.5:1 | ✅ 15.2:1 (#F8FAFC on #0F0F23) |
| **Large Text** | 3:1 | ✅ 15.2:1 |
| **UI Components** | 3:1 | ✅ 4.8:1 (borders) |

### Keyboard Navigation

- ✅ All interactive elements have visible focus states
- ✅ Tab order matches visual order
- ✅ Skip link for keyboard users
- ✅ No keyboard traps

### Screen Readers

- ✅ Alt text for all meaningful images
- ✅ ARIA labels for icon-only buttons
- ✅ Semantic HTML structure
- ✅ Form labels with `for` attribute

### Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| **Mobile** | 375px | Base styles, single column |
| **Tablet** | 768px | 2 columns, side navigation |
| **Desktop** | 1024px | 3 columns, full layout |
| **Wide** | 1440px | Max container width, spacing |

### Container Widths

```tsx
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

---

## 🚫 Anti-Patterns (Avoid)

### Visual
- ❌ Light backgrounds (breaks dark mode aesthetic)
- ❌ Emojis as UI icons (use SVG icons instead)
- ❌ Inconsistent glow effects
- ❌ Over-saturated colors

### Interaction
- ❌ No hover feedback on clickable elements
- ❌ Missing loading states during generation
- ❌ No disabled state on buttons during actions
- ❌ Layout shift on hover (use transform instead of scale)

### Accessibility
- ❌ Removing focus outline without replacement
- ❌ Color as only indicator
- ❌ No skip link
- ❌ Missing alt text

---

## ✅ Pre-Delivery Checklist

### Visual Quality
- [ ] Orbitron for all headings
- [ ] Exo 2 for body text
- [ ] Purple (#8B5CF6) and Amber (#FBBF24) brand colors
- [ ] OLED dark background (#0F0F23)
- [ ] Subtle glow effects on interactive elements
- [ ] No emojis used as UI icons

### Interaction
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states with 200ms transitions
- [ ] Loading states for async operations
- [ ] Disabled buttons during actions
- [ ] Smooth animations (respect reduced motion)

### Accessibility
- [ ] Focus rings visible (purple-500)
- [ ] Keyboard navigation works
- [ ] Alt text on all images
- [ ] ARIA labels on icon buttons
- [ ] 4.5:1 minimum contrast ratio

### Responsive
- [ ] Works at 375px (mobile)
- [ ] Works at 768px (tablet)
- [ ] Works at 1024px (desktop)
- [ ] Works at 1440px (wide)
- [ ] No horizontal scroll

---

## 🎨 Brand Assets

### Logo Usage
- Primary: "TimePics.ai" in Orbitron Bold with gradient
- Icon: Sparkles icon from Lucide React
- Chinese: "时相机" in secondary color

### Iconography
- **Library:** Lucide React
- **Size:** 24x24px standard (w-6 h-6)
- **Color:** Purple-400 for inactive, Amber-400 for active
- **Style:** Stroke-based, consistent weight

---

**Design System Version:** 1.0
**Last Updated:** 2026-02-11
**Status:** ✅ Active
