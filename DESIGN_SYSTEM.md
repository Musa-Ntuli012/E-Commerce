# Design System Documentation

## Ubuntu Sunset Color Scheme

This e-commerce platform uses the **Ubuntu Sunset** color scheme, inspired by South African landscapes - warm, inviting, and trustworthy.

### Primary Colors
- **Primary**: `#E87722` (Vibrant Orange) - CTAs, buttons, links
- **Primary Dark**: `#C45E10` - Hover states, emphasis
- **Primary Light**: `#FFE5D4` - Backgrounds, highlights

### Secondary Colors
- **Secondary**: `#2C5F2D` (Forest Green) - Success, nature, trust
- **Secondary Dark**: `#1A3A1B` - Deep accents
- **Secondary Light**: `#E8F5E9` - Subtle backgrounds

### Neutral Palette
- **Background**: `#FFFFFF` (Pure White)
- **Surface**: `#F8F9FA` (Off-White)
- **Surface Dark**: `#E9ECEF` (Light Gray)
- **Border**: `#DEE2E6` (Soft Gray)
- **Text Primary**: `#212529` (Near Black)
- **Text Secondary**: `#6C757D` (Medium Gray)
- **Text Muted**: `#ADB5BD` (Light Gray)

### Accent Colors
- **Info**: `#0EA5E9` (Sky Blue)
- **Success**: `#10B981` (Emerald)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)
- **Gold**: `#FFD700` - Featured badges

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

### Font Weights
- Regular: 400 (body text)
- Medium: 500 (subtle emphasis)
- Semibold: 600 (buttons, labels)
- Bold: 700 (headings)
- Extrabold: 800 (hero titles)

### Type Scale
- **6xl**: 3.75rem (60px) - Hero titles
- **5xl**: 3rem (48px) - Page titles
- **4xl**: 2.25rem (36px) - Section titles
- **3xl**: 1.875rem (30px) - Card titles
- **2xl**: 1.5rem (24px) - Subsections
- **xl**: 1.25rem (20px) - Large text
- **lg**: 1.125rem (18px) - Large body
- **base**: 1rem (16px) - Default body
- **sm**: 0.875rem (14px) - Small text
- **xs**: 0.75rem (12px) - Labels

## Components

### Buttons

#### Primary Button
```tsx
<button className="btn-primary">
  Click Me
</button>
```

#### Secondary Button
```tsx
<button className="btn-secondary">
  Click Me
</button>
```

#### Ghost Button
```tsx
<button className="btn-ghost">
  Click Me
</button>
```

#### Button Sizes
- `btn-sm` - Small
- Default - Medium
- `btn-lg` - Large

### Input Fields

```tsx
<input className="input-field" placeholder="Enter text..." />
```

For error states:
```tsx
<input className="input-field input-field-error" />
```

### Cards

#### Basic Card
```tsx
<div className="card">
  Content
</div>
```

#### Card with Hover
```tsx
<div className="card card-hover">
  Content
</div>
```

#### Product Card
```tsx
<div className="product-card">
  <img className="product-card-image" src="..." alt="..." />
  <div className="p-6">
    Content
  </div>
</div>
```

### Badges

```tsx
<span className="badge badge-primary">New</span>
<span className="badge badge-success">In Stock</span>
<span className="badge badge-warning">Limited</span>
<span className="badge badge-error">Out of Stock</span>
```

## Utility Classes

### Gradients
- `gradient-text` - Gradient text effect
- `text-gradient-primary` - Primary gradient text
- `bg-gradient-hero` - Hero section gradient
- `bg-gradient-card` - Card gradient

### Spacing
- `section-padding` - Standard section padding (py-16 md:py-24)
- `container-custom` - Max-width container with padding

### Animations
- `animate-fade-in-up` - Fade in with slide up
- `animate-stagger-1` through `animate-stagger-4` - Stagger delays

## Best Practices

1. **Consistency**: Always use the provided utility classes
2. **Accessibility**: Ensure proper contrast ratios (WCAG AA)
3. **Responsive**: Use responsive classes (sm:, md:, lg:)
4. **Animations**: Respect `prefers-reduced-motion`
5. **Colors**: Use semantic color names (primary, success, error)
6. **Spacing**: Follow the 8-point grid system

## Color Usage Guidelines

- **Primary Orange**: Use for CTAs, links, and important actions
- **Green**: Use for success states, positive feedback
- **Red**: Use for errors, destructive actions
- **Neutral Grays**: Use for text hierarchy and backgrounds
- **Gold**: Use sparingly for premium/featured content

## Responsive Breakpoints

- **Mobile**: Default (< 640px)
- **Tablet**: `sm:` (≥ 640px)
- **Desktop**: `md:` (≥ 768px)
- **Large Desktop**: `lg:` (≥ 1024px)
- **XL Desktop**: `xl:` (≥ 1280px)


