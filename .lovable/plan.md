

# Plan: Fix "Add New Address" Modal UI

## Problem
The address modal can overflow the viewport on mobile, the Save button may get hidden behind the keyboard or off-screen, and the modal lacks proper border-radius and padding on smaller screens.

## Changes

### 1. Update DialogContent for Address Form View (`src/components/AddressSelectionModal.tsx`)

**Line 260** - Replace the form view's `DialogContent` classes:

```
Current:  "sm:max-w-lg max-h-[90vh] max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col p-0"
New:      "w-[calc(100%-2rem)] max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-xl mx-auto"
```

- `w-[calc(100%-2rem)]` ensures 1rem padding from screen edges on mobile
- `max-w-[500px]` caps width on desktop
- `rounded-xl` gives 12px border-radius
- Remove duplicate `max-h` declaration

**Line 266** - Update the form wrapper div to ensure proper scroll:

```
Current:  "flex-1 min-h-0 px-6 pb-6"
New:      "flex-1 min-h-0 overflow-hidden px-6 pb-6"
```

### 2. Update DialogContent for Address List View (`src/components/AddressSelectionModal.tsx`)

**Line 284** - Replace the list view's `DialogContent` classes:

```
Current:  "sm:max-w-lg max-h-[90vh] flex flex-col"
New:      "w-[calc(100%-2rem)] max-w-[500px] max-h-[90vh] flex flex-col rounded-xl mx-auto"
```

### 3. Ensure AddressForm Scrolls Properly (`src/components/AddressForm.tsx`)

The form already uses `flex flex-col h-full` with `overflow-y-auto` on the fields container and `shrink-0` on the footer buttons. This is correct. No changes needed to form fields or footer logic.

## Files to Modify

| File | Change |
|------|--------|
| `src/components/AddressSelectionModal.tsx` | Update DialogContent classes on both modal views |

## Technical Details

- The DialogContent component from Radix already centers using `left-[50%] top-[50%] translate-x/y-[-50%]`
- The overlay already uses `bg-black/80` (semi-transparent black)
- The AddressForm already implements sticky footer with `mt-auto border-t shrink-0`
- Form fields already scroll via `overflow-y-auto` on the content area
- No form field changes needed -- only the modal container classes

## Expected Result

- Modal never exceeds viewport on any device
- 1rem gap from screen edges on mobile
- 500px max width on desktop, centered
- 12px border-radius
- Form fields scroll, Save button stays visible at bottom
- Semi-transparent black overlay (already in place)

