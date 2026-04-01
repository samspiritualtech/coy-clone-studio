

# Remove Dashboard Preview from Join Page

## Change
Remove the `SellerDashboardShowcase` component and its surrounding `<section>` from `src/pages/JoinUs.tsx` (lines ~89-94). Also remove the unused import.

The Join page will then only show: heading, description, Apply/Login/Signup buttons, and the auth modal.

## File
- **Modify**: `src/pages/JoinUs.tsx` — delete the `SellerDashboardShowcase` import and the `<section>` block that renders it

