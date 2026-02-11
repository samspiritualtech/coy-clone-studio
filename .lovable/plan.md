

# Plan: Force Internal Scrollbar in Address Modal

## Problem
The modal content overflows the viewport with no visible scrollbar. The Save button gets cut off as seen in the screenshot.

## Root Cause
- `max-h-[90vh]` allows the modal to grow to content size before capping -- but flexbox children don't constrain properly without a fixed height
- The form wrapper div has `overflow-hidden` which blocks scrolling from reaching the inner form

## Changes

### File: `src/components/AddressSelectionModal.tsx`

**Change 1 -- Form view DialogContent (line 260):**
Replace `max-h-[90vh]` with `h-[90vh]` to force a fixed height so flex children properly constrain.

```
Before: "w-[calc(100%-2rem)] max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-xl mx-auto"
After:  "w-[calc(100%-2rem)] max-w-[500px] h-[90vh] overflow-hidden flex flex-col p-0 rounded-xl mx-auto"
```

**Change 2 -- Form content wrapper (line 267):**
Remove `overflow-hidden` so the inner form's `overflow-y-auto` can work.

```
Before: "flex-1 min-h-0 overflow-hidden px-6 pb-6"
After:  "flex-1 min-h-0 overflow-y-auto px-6 pb-6"
```

**Change 3 -- List view DialogContent (line 284):**
Same height fix for the address list view.

```
Before: "w-[calc(100%-2rem)] max-w-[500px] max-h-[90vh] flex flex-col rounded-xl mx-auto"
After:  "w-[calc(100%-2rem)] max-w-[500px] h-[90vh] flex flex-col rounded-xl mx-auto"
```

## No Other Files Changed
- `AddressForm.tsx` already has correct flex layout with `overflow-y-auto` on form fields and `shrink-0` on footer buttons
- Form fields and logic are untouched

## Expected Result
- Modal is fixed at 90% viewport height
- Scrollbar appears inside the modal when content overflows
- Save button always stays visible at the bottom
- Works on both mobile and desktop
