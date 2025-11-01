# Background Pattern - Rollback Instructions

## What Was Added

A subtle technical component pattern overlay inspired by the disassembled device photo. The pattern includes:
- Circuit board elements
- Chip components
- Connectors and traces
- Scattered in a technical/knolling style layout

## Implementation

1. **Created:** `public/tech-pattern.svg` - SVG pattern of tech components
2. **Modified:** `app/globals.css` - Added `::after` pseudo-element to `.gradient-background`
3. **Backup:** `app/globals.css.backup` - Original CSS saved

## Settings

- Opacity: 15% (very subtle)
- Mix-blend-mode: lighten (blends with gradient)
- Position: Center
- Size: 1200x1200px
- z-index: 0 (behind all content)

## To Rollback

If you want to remove the tech pattern and restore the original background:

### Option 1: Restore from backup
```bash
Copy-Item app/globals.css.backup app/globals.css
```

### Option 2: Manual removal
Remove this code block from `app/globals.css` (lines ~76-89):

```css
.gradient-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/tech-pattern.svg');
  background-size: 1200px 1200px;
  background-position: center center;
  background-repeat: no-repeat;
  opacity: 0.15;
  mix-blend-mode: lighten;
}
```

You can also delete `public/tech-pattern.svg` if no longer needed.

## To Adjust

If the pattern is too visible or not visible enough:

**Make it more subtle:**
Change `opacity: 0.15;` to `opacity: 0.08;`

**Make it more visible:**
Change `opacity: 0.15;` to `opacity: 0.25;`

**Change size:**
Adjust `background-size: 1200px 1200px;` (larger = more zoomed out)

**Change position:**
Try: `background-position: top left;` or `top right;` etc.

## Files Changed

- ✅ `app/globals.css` - Added overlay pattern
- ✅ `app/globals.css.backup` - Backup created
- ✅ `public/tech-pattern.svg` - New pattern file
- ✅ No changes to security, CSP, or headers

