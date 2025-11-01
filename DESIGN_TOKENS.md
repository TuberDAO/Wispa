# WispAGPT Design Tokens - Quick Reference

## 🎨 Color System

### Primary Colors
```
Cyan:    #00d9ff (cyber-cyan)     - Primary CTAs, borders
Magenta: #ff00ff (cyber-magenta)  - Secondary accent
Green:   #00ff88 (cyber-green)    - Terminal text, MegaETH
Purple:  #9d4edd (cyber-purple)   - Gradient stops
Yellow:  #ffd60a (cyber-yellow)   - Highlights
```

### Backgrounds
```
Dark:    #000814 (cyber-dark)     - Main background
Navy:    #0a1628 (cyber-navy)     - Cards, sections
Teal:    #0d3d4f (cyber-teal)     - Gradient start
```

### Text Colors
```
Primary:   #e8f4f0 (text-primary)   - Main text
Secondary: #94a3b8 (text-secondary) - Body text
Muted:     #64748b (text-muted)     - Subtle text
```

## 🖌️ Utility Classes

### Gradient Text
```html
<h1 class="gradient-text-cyan">Title</h1>
<h2 class="gradient-text-magenta">Subtitle</h2>
```

### Terminal Styling
```html
<p class="terminal-text">System message</p>
<span class="terminal-bracket">[ ]</span>
```

### Glow Effects
```html
<div class="text-glow-cyan">Glowing cyan text</div>
<div class="text-glow-magenta">Glowing magenta text</div>
<div class="text-glow-green">Glowing green text</div>
<div class="box-glow-cyan">Card with cyan glow</div>
```

### Borders
```html
<div class="cyber-border-cyan">Cyan border with glow</div>
<div class="cyber-border-magenta">Magenta border with glow</div>
```

### Animations
```html
<div class="animate-fade-in">Fades in</div>
<div class="animate-slide-up">Slides up</div>
<div class="animate-pulse-glow">Pulsing glow (CTAs)</div>
<div class="animate-float">Floating animation</div>
```

## 📐 Spacing Scale

### Section Spacing
```
py-32  - Major sections (128px vertical)
py-20  - Subsections (80px vertical)
py-16  - Footer (64px vertical)
```

### Content Spacing
```
space-y-12 - Hero elements
space-y-8  - Section content
space-y-6  - Card content
```

### Padding
```
p-8 md:p-16  - Large cards
p-8          - Regular cards
p-6          - Small cards
```

## 🔤 Typography

### Font Sizes
```
text-9xl     - 8rem (128px)  - Hero titles (desktop)
text-7xl     - 5rem (80px)   - Hero titles (mobile)
text-6xl     - 3.75rem       - Section titles (desktop)
text-5xl     - 3rem          - Section titles (mobile)
text-3xl     - 1.875rem      - Card titles
text-xl      - 1.25rem       - Body (large)
text-base    - 1rem          - Body (regular)
```

### Font Families
```
font-sans    - System sans-serif (default)
font-mono    - Courier New, Consolas (terminal)
```

### Letter Spacing
```
tracking-tight    - Tight (headings)
tracking-wide     - Wide (subheadings)
tracking-wider    - 0.05em (terminal)
tracking-widest   - 0.1em (labels)
```

## 🎯 Common Patterns

### Primary CTA Button
```html
<button class="px-10 py-4 bg-cyber-cyan text-cyber-dark text-lg font-semibold rounded-lg hover:bg-cyber-cyanGlow transition-all duration-200 transform hover:scale-105 active:scale-95 animate-pulse-glow">
  Join Early Access
</button>
```

### Ghost Button
```html
<button class="px-10 py-4 bg-transparent cyber-border-magenta text-text-primary text-lg font-semibold rounded-lg hover:bg-cyber-magenta/10 transition-all duration-200 transform hover:scale-105 active:scale-95">
  Request Whitepaper
</button>
```

### Card with Hover
```html
<div class="cyber-border-cyan rounded-xl p-8 bg-cyber-navy/20 backdrop-blur-sm hover:bg-cyber-navy/40 hover:box-glow-cyan transition-all duration-300 transform hover:-translate-y-2">
  Card content
</div>
```

### Section Header
```html
<div>
  <p class="terminal-text text-sm mb-4">
    <span class="terminal-bracket">[ </span>section name<span class="terminal-bracket"> ]</span>
  </p>
  <h2 class="text-5xl md:text-6xl font-bold gradient-text-cyan">
    Section Title
  </h2>
</div>
```

### Terminal Prompt
```html
<p class="terminal-text text-sm">
  <span class="terminal-bracket">&gt;&gt;</span> COMMAND.exe
</p>
```

## 🌈 Gradient Backgrounds

### Card Gradient
```html
<div class="bg-gradient-to-br from-cyber-navy/40 to-cyber-dark/60">
  Content
</div>
```

### Modal Gradient
```html
<div class="bg-gradient-to-br from-cyber-navy/95 to-cyber-dark/95 backdrop-blur-xl">
  Modal content
</div>
```

## ♿ Accessibility

### Focus States
All interactive elements automatically get:
```css
focus-visible: 2px solid cyan outline
outline-offset: 4px
```

### Reduced Motion
All animations automatically disabled when:
```css
@media (prefers-reduced-motion: reduce)
```

### Contrast Ratios
- Text on dark: ≥ 4.5:1 (WCAG AA)
- Large text: ≥ 3:1 (WCAG AA)
- Interactive elements: ≥ 3:1 (WCAG AA)

## 🎭 Z-Index Layers

```
z-0   - Gradient background
z-1   - Grid overlay
z-2   - Scan lines
z-10  - Main content
z-50  - Modals
```

## 📱 Responsive Breakpoints

```
sm:  640px   - Small tablets
md:  768px   - Tablets
lg:  1024px  - Laptops
xl:  1280px  - Desktops
```

## ⚡ Performance Tips

1. Use CSS animations only (no JS)
2. Prefer `transform` and `opacity` (GPU-accelerated)
3. Avoid `box-shadow` animations (use on hover only)
4. Keep animations ≤ 300ms for transitions
5. Use `backdrop-blur-sm` sparingly

## 🔧 Customization

To adjust colors, edit CSS variables in `app/globals.css`:
```css
:root {
  --cyan-bright: #00d9ff;  /* Change primary color */
  --magenta: #ff00ff;       /* Change accent color */
  /* ... etc */
}
```

Tailwind will automatically reference these values via the config.

