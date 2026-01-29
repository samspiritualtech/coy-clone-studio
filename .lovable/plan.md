

# Add Temporary Test Button for Social Media Webhook

## Overview

Add a small, admin-style test button to the ProductDetail page that triggers the Make.com webhook with sample product data. This allows testing the social media automation pipeline without going through the full Made-to-Order flow.

---

## Implementation

### Button Placement

Add a fixed-position test button in the bottom-left corner of the ProductDetail page. It will be styled as a developer/admin tool (small, subtle) and clearly labeled as a test.

### Data to Send

Use the current product's actual data to build a realistic test payload:

| Field | Source |
|-------|--------|
| title | Current product name |
| description | Generated from product brand + category |
| imageUrl | First product image |
| designerName | Product brand name |
| customizations | Sample values (Lehenga, Silk, Maroon, Heavy) |
| priceRange | Formatted product price |
| pageUrl | Current window URL |

---

## Technical Changes

### File to Modify: `src/pages/ProductDetail.tsx`

1. **Import the service**:
```typescript
import { triggerSocialPost } from "@/services/socialPostService";
```

2. **Add state for loading**:
```typescript
const [isTestingWebhook, setIsTestingWebhook] = useState(false);
```

3. **Add handler function**:
```typescript
const handleTestSocialWebhook = async () => {
  setIsTestingWebhook(true);
  const success = await triggerSocialPost({
    title: currentProduct.name,
    description: `A stunning custom design inspired by ${currentProduct.name}`,
    imageUrl: currentProduct.images[0],
    designerName: currentProduct.brand,
    designerCity: "Mumbai",
    customizations: {
      dressType: "Lehenga",
      fabric: "Silk",
      color: "Maroon",
      colorHex: "#8B0000",
      embroideryLevel: "Heavy",
    },
    priceRange: `₹${currentProduct.price.toLocaleString()}`,
    occasion: "Wedding",
    pageUrl: window.location.href,
  });
  
  toast({
    title: success ? "Webhook triggered!" : "Webhook failed",
    description: success 
      ? "Check Make.com for the incoming data" 
      : "Check console for errors",
    variant: success ? "default" : "destructive",
  });
  setIsTestingWebhook(false);
};
```

4. **Add test button UI** (before the closing `</div>` of the component, around line 500):
```tsx
{/* Temporary Test Button - Remove after testing */}
<button
  onClick={handleTestSocialWebhook}
  disabled={isTestingWebhook}
  className="fixed bottom-24 left-4 z-50 bg-violet-600 hover:bg-violet-700 text-white text-xs px-3 py-2 rounded-md shadow-lg transition-colors disabled:opacity-50"
>
  {isTestingWebhook ? "Sending..." : "🧪 Test Social Webhook"}
</button>
```

---

## Visual Preview

The button will appear as a small purple pill in the bottom-left corner:

```text
┌─────────────────────────────────────────────┐
│                                             │
│           Product Detail Page               │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│   [🧪 Test Social Webhook]                  │
│                        [Mobile Add to Bag]  │
└─────────────────────────────────────────────┘
```

---

## Expected Behavior

1. User clicks the "🧪 Test Social Webhook" button
2. Button shows "Sending..." state
3. `triggerSocialPost()` is called with sample data
4. Edge function `social-post-webhook` receives the payload
5. Payload is forwarded to Make.com webhook URL
6. Toast notification shows success or failure
7. User can check Make.com to verify the incoming data

---

## Cleanup Note

This is a temporary test button. Once Make.com integration is verified:
- Remove the test button code
- Remove the handler function
- Remove the isTestingWebhook state

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/ProductDetail.tsx` | Add import, state, handler, and test button UI |

