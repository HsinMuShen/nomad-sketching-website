# Nomad Sketching — Sketch Map & Random Journey Implementation Plan

## 1. Goal

Build two connected features for Nomad Sketching:

1. **Sketch Map**

   - A location-based map that lets visitors browse artworks and diary entries by place.
   - Each sketch should feel connected to a real location, memory, and story.

2. **Random Journey**
   - An interactive page for events, parties, exhibitions, or casual sharing.
   - It randomly shows a sketch, introduces the place, and gives the artist a simple way to tell the story behind the work.

These features should strengthen the core identity of Nomad Sketching: a calm, personal, location-based sketching journal.

The implementation should keep the current website style: **simple, elegant, quiet, visual, and reflective**. Avoid making the experience feel like a heavy dashboard, game platform, or commercial product.

---

## 2. Product Principles

### 2.1 Design Direction

The style should match the current design.

Please follow these principles:

- Keep the UI simple and elegant.
- Prioritize artwork and written reflection over complex controls.
- Use soft spacing, calm typography, and minimal visual noise.
- Avoid overly colorful map markers or playful game-like UI unless intentionally subtle.
- The experience should feel like browsing a visual travel diary.
- Mobile experience should be clean and easy to use.
- Do not introduce a completely new visual language.

### 2.2 Experience Direction

The user should feel:

- They are exploring places through sketches.
- Each sketch has a memory behind it.
- The map is not just a utility, but part of the storytelling.
- Random Journey feels like a gentle way to discover the artist’s travels and observations.

---

## 3. Feature Scope

## 3.1 Phase 1 — Location Metadata Foundation

Before building the map, artworks and diaries need structured location data.

### Add metadata fields to Artwork

Current collection: `artworks`

Recommended additional fields:

```ts
type LocationMetadata = {
  country?: string
  city?: string
  placeName?: string
  latitude?: number
  longitude?: number
  locationNote?: string
}

type Artwork = {
  id: string
  name: string
  mainImage: {
    id: string
    src: string
  }
  content: unknown
  createdAt?: string
  updatedAt?: string

  // New fields
  location?: LocationMetadata
  sketchDate?: string // ISO date string, e.g. "2026-06-22"
  tags?: string[]
  isFeatured?: boolean
  isMapVisible?: boolean
}
```

### Add metadata fields to Diary

Current collection: `diary`

Recommended additional fields:

```ts
type Diary = {
  id: string
  title: string
  content: unknown
  drawingJsonString: string
  drawingImage: {
    id: string
    src: string
  }
  createdAt: number | null
  updatedAt: number | null

  // New fields
  location?: LocationMetadata
  sketchDate?: string
  tags?: string[]
  isMapVisible?: boolean
}
```

### Notes

- `latitude` and `longitude` are required for map display.
- `country`, `city`, and `placeName` are required for meaningful storytelling.
- `locationNote` should be short and human-readable.
- `isMapVisible` allows the creator to hide private or unclear locations from the map.
- Existing records should still work even if they do not have location data.

---

## 3.2 Phase 2 — Admin CMS Updates

Update the artwork and diary create/edit pages so the creator can enter location data.

### Artwork Admin

Pages:

- `src/components/admin/create/index.tsx`
- `src/components/admin/update/index.tsx`

Add fields:

- Country
- City
- Place name
- Latitude
- Longitude
- Sketch date
- Tags
- Location note
- Show on map toggle

### Diary Admin

Pages:

- `src/components/Diary/Admin/Create/index.tsx`
- `src/components/Diary/Admin/Update/index.tsx`

Add fields:

- Country
- City
- Place name
- Latitude
- Longitude
- Sketch date
- Tags
- Location note
- Show on map toggle

### Admin UX Requirements

Keep the form simple.

Suggested grouping:

```txt
Basic Information
- Title
- Image / Drawing
- Content

Location
- Country
- City
- Place name
- Latitude
- Longitude
- Sketch date
- Location note
- Show on map

Tags
- Tags input
```

### Optional Helper

Add a simple “Open Google Maps” helper instruction near latitude and longitude fields.

Example copy:

```txt
You can right-click a place in Google Maps and copy its latitude and longitude.
```

Do not build full geocoding in the first version unless there is extra time.

---

## 3.3 Phase 3 — Sketch Map Page

Add a new public page:

```txt
/map
```

### Purpose

Let visitors explore artworks and diary entries by location.

### Data Source

Fetch both:

- `artworks`
- `diary`

Only show records where:

```ts
location.latitude exists
location.longitude exists
isMapVisible !== false
```

### Unified Map Item Type

Create a normalized type for display:

```ts
type SketchMapItem = {
  id: string
  type: 'artwork' | 'diary'
  title: string
  imageUrl: string
  country?: string
  city?: string
  placeName?: string
  latitude: number
  longitude: number
  sketchDate?: string
  locationNote?: string
  tags?: string[]
  detailUrl: string
}
```

### Suggested Files

```txt
src/components/SketchMap/index.tsx
src/components/SketchMap/components/MapView.tsx
src/components/SketchMap/components/MapMarkerPopup.tsx
src/components/SketchMap/hooks/useSketchMapItems.ts
src/pages/map.tsx
```

### Map Library Recommendation

Use one of the following:

#### Option A: Leaflet + React Leaflet

Pros:

- Free
- Simple
- Good enough for MVP

Cons:

- Requires marker/icon setup
- Default style may need polish

#### Option B: Mapbox

Pros:

- More beautiful map styles
- Stronger design control

Cons:

- Requires token
- Pricing considerations

### Recommendation

Use **Leaflet / React Leaflet** for MVP unless the project already has a Mapbox preference.

### Map UI Requirements

The map page should include:

- Full-width map area
- Simple title and intro text
- Markers for sketches
- Popup card when clicking marker
- Link to artwork or diary detail page
- Optional list below or beside the map

### Popup Card Content

Each marker popup should show:

```txt
Image
Title
Place name
City, Country
Short location note
View story
```

### Empty State

If no map items exist:

```txt
No sketches have been added to the map yet.
```

### Loading State

Use a simple loading state that matches the existing website style.

---

## 3.4 Phase 4 — Random Journey Page

Add a new public page:

```txt
/journey
```

### Purpose

Randomly show one sketch and introduce the place.

This page is designed for:

- Parties
- Small exhibitions
- Artist talks
- Casual sharing
- Interactive storytelling

### Basic Behavior

When the page opens:

1. Fetch all map-visible artworks and diaries.
2. Randomly select one item.
3. Display the sketch image prominently.
4. Show place information.
5. Show short story / location note.
6. Provide a “Next Journey” button.

### UI Layout

Recommended layout:

```txt
Random Journey

[Large sketch image]

Place Name
City, Country
Sketch date

Short location note

[Next Journey]
[View on Map]
[Read Full Story]
```

### Design Requirements

- Should feel calm, not like a casino/random game.
- Avoid loud animation.
- Use subtle fade transition when changing sketch.
- The sketch image should be the emotional center.
- Good spacing is more important than dense information.

### Suggested Files

```txt
src/components/RandomJourney/index.tsx
src/components/RandomJourney/hooks/useRandomJourney.ts
src/pages/journey.tsx
```

### Random Logic

Basic implementation:

```ts
function getRandomItem(items: SketchMapItem[], currentId?: string) {
  if (items.length === 0) return null
  if (items.length === 1) return items[0]

  const candidates = items.filter((item) => item.id !== currentId)
  return candidates[Math.floor(Math.random() * candidates.length)]
}
```

### Optional URL Support

For sharing, support query parameter:

```txt
/journey?id=ARTWORK_OR_DIARY_ID
```

This allows the creator to open a specific sketch during a talk.

---

## 3.5 Phase 5 — Party / Presentation Enhancements

These are optional and should not block MVP.

### Optional Feature: Auto Play

Add a subtle auto-play mode:

```txt
Auto play every 30 seconds
```

### Optional Feature: Guess Where Mode

A future interactive mode:

1. Show only the sketch.
2. Ask visitors to guess the location.
3. Reveal the answer and story.

This should be considered P2, not MVP.

### Optional Feature: QR Code

Generate a QR code for the current Random Journey page so people at the party can open the same sketch on their phones.

This should be considered P2.

---

## 4. Recommended Priority

| Priority | Feature                                       | Reason                                    |
| -------- | --------------------------------------------- | ----------------------------------------- |
| P0       | Add location metadata to artworks and diaries | Required foundation                       |
| P0       | Update admin create/edit forms                | Creator needs a way to manage map content |
| P1       | Build `/map` page                             | Core public discovery feature             |
| P1       | Build `/journey` page                         | Strong storytelling and event use case    |
| P2       | Auto-play mode                                | Useful for events but not required        |
| P2       | Guess Where mode                              | Fun but should come after MVP             |
| P2       | QR code sharing                               | Useful for parties but can wait           |
| P3       | Public user accounts                          | Too large for current stage               |

---

## 5. Engineering Implementation Checklist

### Data

- [ ] Add shared location metadata type.
- [ ] Update artwork type.
- [ ] Update diary type.
- [ ] Make old records backward compatible.
- [ ] Add `isMapVisible` support.
- [ ] Add helper function to normalize artworks and diaries into `SketchMapItem`.

### Admin

- [ ] Add location section to artwork create page.
- [ ] Add location section to artwork update page.
- [ ] Add location section to diary create page.
- [ ] Add location section to diary update page.
- [ ] Add basic validation for latitude and longitude.
- [ ] Add simple error message for invalid coordinates.
- [ ] Add tags input.
- [ ] Add show-on-map toggle.

### Public Map

- [ ] Create `/map` route.
- [ ] Fetch artwork and diary map items.
- [ ] Render map markers.
- [ ] Render marker popup cards.
- [ ] Link popup cards to detail pages.
- [ ] Add loading state.
- [ ] Add empty state.
- [ ] Test desktop layout.
- [ ] Test mobile layout.

### Random Journey

- [ ] Create `/journey` route.
- [ ] Fetch shared map item data.
- [ ] Randomly display one item.
- [ ] Add Next Journey button.
- [ ] Add View on Map link.
- [ ] Add Read Full Story link.
- [ ] Add empty state.
- [ ] Add subtle transition between items.
- [ ] Test for artworks and diaries.

### Quality

- [ ] Remove unnecessary console logs.
- [ ] Confirm Firebase security rules still protect admin writes.
- [ ] Ensure public read behavior is intentional.
- [ ] Add basic tests for normalization logic.
- [ ] Add basic tests for random item selection logic.
- [ ] Confirm old artwork and diary pages still work.

---

## 6. Firebase Security Notes

Current admin protection appears to be mainly client-side.

Before expanding publishing features, confirm Firebase security rules:

- Public visitors can read published public content.
- Only the creator/admin can create, update, or delete artworks.
- Only the creator/admin can create, update, or delete diaries.
- Public users cannot write to Firestore or Storage unless explicitly allowed.
- Location fields should follow the same write protection as other content fields.

This is especially important before any future user account or public drawing save feature.

---

## 7. Suggested Acceptance Criteria

### Location Metadata

- Admin can create an artwork with location fields.
- Admin can update location fields for an existing artwork.
- Admin can create a diary with location fields.
- Admin can update location fields for an existing diary.
- Existing records without location fields do not break the site.
- Invalid latitude/longitude shows a clear error.

### Sketch Map

- `/map` displays artworks and diaries with valid coordinates.
- Items without coordinates are hidden from the map.
- Items with `isMapVisible === false` are hidden from the map.
- Clicking a marker opens a simple popup card.
- Popup card links to the correct detail page.
- The page works on desktop and mobile.

### Random Journey

- `/journey` shows a random map-visible item.
- “Next Journey” changes to another item when possible.
- The same item should not repeat immediately if there are multiple items.
- “Read Full Story” opens the correct artwork or diary detail page.
- “View on Map” opens the map page.
- Empty state appears if no valid items exist.

---

## 8. Suggested Future Enhancements

After MVP, consider:

- Country and city archive pages.
- Timeline view.
- Related artwork and diary linking.
- Collection pages such as “Japan 2026” or “Taipei Sketches”.
- Guess Where party mode.
- QR code sharing for live events.
- Auto-play slideshow mode.
- SEO metadata for map and location pages.

---

## 9. Product Recommendation

Build this in the following order:

1. Location metadata
2. Admin location fields
3. Shared map item normalization
4. Sketch Map
5. Random Journey
6. Optional party enhancements

Do not start with user accounts or social features.

The map and journey features are a better fit for the current identity because they deepen the storytelling around sketches, places, and memories while keeping the website personal and elegant.
