

# Make.com Webhook Integration for Auto Social Media Posting

## Overview

Integrate a Make.com webhook trigger into the Made-to-Order journey to automatically post custom design creations to social media. This enables showcasing customer designs and driving engagement when new custom orders are created.

---

## Integration Points

The webhook will trigger at two key moments in the Made-to-Order flow:

| Trigger Event | When | Data Sent |
|---------------|------|-----------|
| Design Preview Generated | After step 4 (AI generates design variations) | Design details, preview image URL, customizations |
| Custom Order Confirmed | After final order submission | Full order details, designer info, final design |

---

## Architecture

```text
User creates custom design → Edge Function → Make.com Webhook
                                    ↓
                           Auto Social Post
                           (Instagram, Facebook, etc.)
```

---

## Implementation Plan

### Step 1: Create Webhook Edge Function

Create a new edge function `social-post-webhook` that:
- Receives design/order data from the frontend
- Validates the payload
- Sends to Make.com webhook in `no-cors` mode
- Returns success/failure status

**File**: `supabase/functions/social-post-webhook/index.ts`

```typescript
// Edge function structure
- CORS headers configuration
- Validate incoming payload (title, description, imageUrl, etc.)
- POST to Make.com webhook URL
- Handle success/error responses
```

---

### Step 2: Create Webhook Service

Create a frontend service to call the edge function with design data.

**File**: `src/services/socialPostService.ts`

```typescript
interface SocialPostData {
  title: string;
  description: string;
  imageUrl: string;
  designerName?: string;
  customizations: {
    dressType: string;
    fabric: string;
    color: string;
    embroideryLevel: string;
  };
  priceRange: string;
  pageUrl: string;
}

async function triggerSocialPost(data: SocialPostData): Promise<boolean>
```

---

### Step 3: Add Webhook Configuration Storage

Store the Make.com webhook URL securely. Two options:

**Option A: Environment Secret (Recommended)**
- Store webhook URL as a backend secret `MAKE_WEBHOOK_URL`
- Edge function reads from environment

**Option B: Admin Settings (Future)**
- Create admin UI to configure webhook URL
- Store in database settings table

---

### Step 4: Integrate with Made-to-Order Flow

Modify the customization panel and order summary to trigger the webhook:

**Files to Modify**:
- `src/components/made-to-order/MTOCustomizationPanel.tsx`
- `src/pages/MadeToOrderPage.tsx` (for order confirmation trigger)

**Trigger Points**:
1. After "Generate Design Variations" button click (with preview image)
2. After "Confirm Custom Order" button click (with final order)

---

### Step 5: Add User Consent Toggle (Optional)

Add a checkbox allowing users to opt-in to having their design featured:

```text
☑️ Feature my design on Ogura's social media
```

This ensures privacy compliance and curates quality content.

---

## Data Payload Structure

The webhook will send the following JSON to Make.com:

```json
{
  "event": "custom_design_created",
  "timestamp": "2026-01-29T12:00:00Z",
  "design": {
    "title": "Custom Silk Lehenga",
    "description": "A stunning Royal embroidered Silk Lehenga in Maroon, crafted by Studio XYZ.",
    "imageUrl": "https://..../preview.jpg",
    "designer": {
      "name": "Studio XYZ",
      "city": "Mumbai"
    },
    "customizations": {
      "dressType": "Lehenga",
      "fabric": "Silk",
      "color": "Maroon",
      "colorHex": "#8B0000",
      "embroideryLevel": "Royal"
    },
    "priceRange": "₹95,000 - ₹1,25,000",
    "occasion": "Wedding"
  },
  "source": {
    "url": "https://ogura.in/category/made-to-order",
    "platform": "Ogura Fashion"
  }
}
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/social-post-webhook/index.ts` | Edge function to proxy webhook calls |
| `src/services/socialPostService.ts` | Frontend service for triggering posts |

---

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/config.toml` | Add social-post-webhook function config |
| `src/components/made-to-order/MTOCustomizationPanel.tsx` | Add webhook trigger on design generation |
| `src/contexts/MadeToOrderContext.tsx` | Add consent state and social sharing flag |

---

## Technical Considerations

1. **Webhook URL Storage**: The Make.com webhook URL will be stored as a backend secret (`MAKE_WEBHOOK_URL`) to keep it secure and easily configurable.

2. **Error Handling**: The webhook call will be fire-and-forget to not block the user journey. Failures are logged but don't interrupt the flow.

3. **Rate Limiting**: The edge function will include basic rate limiting to prevent abuse (e.g., max 10 posts per hour).

4. **Image Handling**: For social posts, the preview image URL must be publicly accessible. We'll use Supabase Storage URLs.

---

## Make.com Workflow Setup (User Action Required)

After implementation, you'll need to configure your Make.com scenario to:

1. Receive the webhook trigger
2. Parse the JSON payload
3. Format the social media post content
4. Post to connected social platforms (Instagram, Facebook, Twitter, etc.)

---

## Summary

This integration creates a seamless pipeline from custom design creation to automatic social media posting, helping showcase customer creations and drive engagement for Ogura Fashion's Made-to-Order service.

