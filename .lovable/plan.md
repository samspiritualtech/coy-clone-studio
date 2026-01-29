

# Fix Make.com Webhook Payload Structure

## Problem Analysis

Based on the logs, the edge function IS successfully:
1. Receiving the full payload from the frontend
2. Logging it correctly: `"Sending to Make.com webhook: { \"event\": \"custom_design_created\", \"design\": { \"title\": \"Evening Gown Dress\"...`
3. Getting a success response from Make.com

The issue is that **Make.com expects specific field names at the root level**, but the current payload uses a nested structure. Make.com's webhook module may not be parsing nested JSON properly, or it's looking for flattened fields.

## Current vs Expected Structure

**Currently Sending (nested):**
```json
{
  "event": "custom_design_created",
  "design": {
    "title": "Evening Gown Dress",
    "description": "A stunning custom design...",
    "imageUrl": "https://..."
  },
  "source": {
    "url": "https://..."
  }
}
```

**What Make.com Likely Expects (flattened):**
```json
{
  "title": "Evening Gown Dress",
  "description": "A stunning custom design...",
  "image": "https://...",
  "url": "https://...",
  "event": "custom_design_created",
  "designerName": "URBAN",
  "fabric": "Silk",
  "color": "Maroon"
}
```

---

## Solution

Modify the edge function to send a **flattened payload** with the specific field names Make.com expects (`title`, `description`, `image`, `url`), while keeping the original nested structure as an additional `metadata` field for reference.

---

## Technical Changes

### File: `supabase/functions/social-post-webhook/index.ts`

Update the payload sent to Make.com to flatten the structure:

```typescript
// Build flattened payload for Make.com
const makePayload = {
  // Primary fields Make.com expects
  title: payload.design.title,
  description: payload.design.description,
  image: payload.design.imageUrl,
  url: payload.source.url,
  
  // Additional useful fields at root level
  event: payload.event,
  timestamp: payload.timestamp,
  platform: payload.source.platform,
  priceRange: payload.design.priceRange,
  occasion: payload.design.occasion || "",
  
  // Designer info
  designerName: payload.design.designer?.name || "",
  designerCity: payload.design.designer?.city || "",
  
  // Customizations flattened
  dressType: payload.design.customizations.dressType,
  fabric: payload.design.customizations.fabric,
  color: payload.design.customizations.color,
  colorHex: payload.design.customizations.colorHex,
  embroideryLevel: payload.design.customizations.embroideryLevel,
};

// Send flattened payload to Make.com
const webhookResponse = await fetch(webhookUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(makePayload),
});
```

---

## Updated Payload Structure

After the fix, Make.com will receive:

```json
{
  "title": "Evening Gown Dress",
  "description": "A stunning custom design inspired by Evening Gown Dress",
  "image": "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80&fit=crop",
  "url": "https://d4269340-6a04-445b-9b9c-a83ba6ae72f8.lovableproject.com/product/dres-16",
  "event": "custom_design_created",
  "timestamp": "2026-01-29T07:49:34.143Z",
  "platform": "Ogura Fashion",
  "priceRange": "₹6,442",
  "occasion": "Wedding",
  "designerName": "URBAN",
  "designerCity": "Mumbai",
  "dressType": "Lehenga",
  "fabric": "Silk",
  "color": "Maroon",
  "colorHex": "#8B0000",
  "embroideryLevel": "Heavy"
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/social-post-webhook/index.ts` | Flatten payload before sending to Make.com webhook |

---

## Why This Fixes the Issue

1. **Field names match**: Make.com will see `title`, `description`, `image`, `url` at the root level
2. **No nested parsing required**: All fields are directly accessible in Make.com modules
3. **Backward compatible**: The edge function still receives the same nested structure from the frontend
4. **Full data preserved**: All customization details are included as flattened fields

---

## Testing After Implementation

1. Click the "🧪 Test Social Webhook" button on any product page
2. Check Make.com scenario - you should now see all fields populated:
   - `title`: "Evening Gown Dress"
   - `description`: "A stunning custom design..."
   - `image`: Full image URL
   - `url`: Page URL

