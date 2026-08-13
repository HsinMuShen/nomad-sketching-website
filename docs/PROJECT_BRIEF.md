# Nomad Sketching Website - Product Brief

## 1. Website Summary

**Nomad Sketching** is a personal art website for sharing location-based sketches, visual diaries, and browser-made drawings. It is both a public-facing gallery and a creator-managed content system.

The public website lets visitors:

- Browse artwork collections.
- Open individual artwork pages with images and written context.
- Browse diary/sketch journal entries.
- Open diary entries that combine a drawing image and written reflection.
- Use a browser drawing panel to sketch directly on the site.
- Learn about the artist and see special thanks content.

The admin website lets the creator:

- Sign in with Firebase Authentication.
- Create, update, and delete artwork posts.
- Upload artwork cover images.
- Write rich text artwork descriptions.
- Create, update, and delete diary entries.
- Draw diary sketches directly in the browser.
- Save diary drawings as both image files and editable canvas JSON.

The site is built as a practical personal creative CMS: artwork and diary content are stored in Firebase Firestore, images are stored in Firebase Storage, rich text is handled with Tiptap, and drawing is powered by Fabric.js.

## 2. Product Positioning

This website is not only a portfolio. It is a lightweight publishing platform for an artist who wants to document sketching as an ongoing practice.

The main concept is:

> Sketching as a way to slow down, observe places, and preserve moments that may otherwise disappear.

Current homepage content is centered around the Chinese-language identity **遊牧速寫**, with sections for:

- Artist statement.
- Featured works.
- Artwork archive.
- Diary and sketch journal.
- Online drawing.

The experience should feel personal, calm, visual, and reflective rather than commercial or marketing-heavy.

## 3. Current User Types

### Public Visitor

A public visitor can view artwork, read diary entries, and try the drawing tool. They do not need an account.

Current public visitor capabilities:

- View homepage.
- Browse all artworks.
- View artwork detail pages.
- Browse all diaries.
- View diary detail pages.
- Open image previews.
- Draw in the browser.
- Download drawings from the drawing page.
- Read About and Special Thanks pages.

### Creator/Admin

The admin is the site owner or creator. Admin access is gated by Firebase login state.

Current admin capabilities:

- Log in.
- Access the admin dashboard.
- Manage artwork posts.
- Manage diary entries.
- Upload and replace images.
- Use a rich text editor.
- Use the drawing panel inside diary creation and editing.

### Future Registered User

The README mentions a future direction where public users may be able to create and manage their own artworks and pages. This is not currently implemented as a full user product.

Potential future user capabilities:

- Create personal drawings.
- Save drawings to an account.
- Manage a personal gallery.
- Publish or hide artworks.
- Edit profile or artist page.

## 4. Public Website Pages

### Home Page `/`

Purpose: Introduce Nomad Sketching and guide visitors into the main content areas.

Current behavior:

- Fetches artworks from Firestore.
- Shows artist introduction text.
- Shows a large featured artwork on desktop.
- Shows a horizontal featured artwork marquee.
- Allows artwork previews in an overlay.
- Links to artworks, diaries, and drawing.
- Uses reveal animations as sections enter the viewport.

Important notes:

- Homepage text is currently primarily Chinese.
- The homepage has evolved from the older carousel-focused design shown in the README.

### Artworks Page `/artworks`

Purpose: Browse the artwork archive.

Current behavior:

- Fetches artwork records from Firestore.
- Displays artwork cards in a responsive grid.
- Each card shows title and cover image.
- Clicking an artwork opens `/artwork/[id]`.

### Artwork Detail Page `/artwork/[id]`

Purpose: View a single artwork in more detail.

Current behavior:

- Loads one artwork by Firestore document ID.
- Shows artwork title.
- Shows the main artwork image.
- Opens image in a dialog when clicked.
- Renders read-only rich text content.
- Includes a button back to the artwork archive.

### Diaries Page `/diaries`

Purpose: Browse diary/sketch journal entries.

Current behavior:

- Fetches diary records from Firestore.
- Sorts entries by numeric ID in descending order.
- Displays diary cards in a responsive grid.
- Each card shows title, date, and drawing image.
- Clicking a diary opens `/diary/[id]`.

### Diary Detail Page `/diary/[id]`

Purpose: Read a single visual diary entry.

Current behavior:

- Loads one diary by Firestore document ID.
- Shows diary title.
- Shows the saved drawing image.
- Opens image in a dialog when clicked.
- Renders read-only rich text content.
- Includes a button back to the diary archive.

### Drawing Page `/drawing`

Purpose: Let visitors sketch directly in the browser.

Current behavior:

- Shows a Fabric.js canvas.
- Supports pen drawing.
- Supports eraser mode.
- Supports brush width changes.
- Supports undo and redo.
- Supports clearing the canvas.
- Supports downloading the canvas as an image.
- Shows an optional React Joyride guided tour.

Current limitation:

- Public drawings are not saved to a user account or gallery.

### About Page `/about`

Purpose: Present artist information.

Current behavior:

- Fetches content from Firestore collection `about`.
- Shows a local artist image.
- Shows text content and links from Firestore.

### Special Thanks Page `/special-thanks`

Purpose: Show acknowledgements.

Current behavior:

- Fetches content from Firestore collection `specialThanks`.
- Displays a simple list of thanks text.

## 5. Admin Website Pages

### Admin Dashboard `/admin`

Purpose: Manage artwork posts.

Current behavior:

- Requires login state.
- Lists current artworks.
- Links to create artwork.
- Links to diary admin.
- Allows artwork deletion.
- Clicking an artwork opens its update page.

### Create Artwork `/admin/create`

Purpose: Add a new artwork post.

Current behavior:

- Enter artwork title.
- Upload one cover image.
- Write content in the rich text editor.
- Save the artwork to Firestore.
- Upload image files to Firebase Storage.

### Update Artwork `/admin/update/[id]`

Purpose: Edit an existing artwork post.

Current behavior:

- Loads existing artwork data.
- Allows title editing.
- Allows cover image replacement.
- Allows rich text content editing.
- Saves updates to Firestore.

### Diary Admin `/admin/diary`

Purpose: Manage diary entries.

Current behavior:

- Lists diary entries.
- Links to create diary.
- Links back to artwork admin.
- Supports deletion through the diary admin list.
- Clicking an entry opens its update page.

### Create Diary `/admin/diary/create`

Purpose: Create a diary post with a drawing and written content.

Current behavior:

- Enter diary title.
- Draw directly in the embedded drawing panel.
- Write diary content in the rich text editor.
- Convert drawing canvas to an image file.
- Upload drawing image to Firebase Storage.
- Save drawing JSON string for later editing.
- Save diary data to Firestore.

### Update Diary `/admin/diary/update/[id]`

Purpose: Edit an existing diary post.

Current behavior:

- Loads existing diary data.
- Restores the saved drawing from Fabric.js JSON.
- Allows editing the drawing.
- Allows editing the title.
- Allows editing rich text content.
- Saves a new drawing image and updated canvas JSON.

## 6. Core Features

### Artwork Gallery

The artwork gallery is a CMS-backed public archive. Each artwork has a title, main image, and rich text content.

Good future feature areas:

- Filtering by location, date, category, or medium.
- Search.
- Tags.
- Featured/pinned artworks.
- Better artwork ordering.
- Artwork metadata such as place, country, city, date, materials, dimensions.
- Related diary entries.

### Diary / Sketch Journal

The diary feature combines a drawing image with rich text. It is closer to a visual journal than a standard blog.

Good future feature areas:

- Calendar or timeline browsing.
- Location-based diary map.
- Draft/publish states.
- Better date handling.
- Mood, theme, or travel tags.
- Linking diary entries to artworks.

### Drawing Tool

The drawing tool currently supports basic sketching and is reusable across public and admin flows.

Current tools:

- Pen.
- Eraser.
- Brush width.
- Undo.
- Redo.
- Clear.
- Download image.

Good future feature areas:

- Color picker.
- Multiple brush styles.
- Layers.
- Background image import.
- Canvas size presets.
- Save to user gallery.
- Autosave.
- Mobile gesture improvements.
- Export PNG/JPEG options.

### Rich Text Editing

The admin editor uses Tiptap and supports structured JSON content. It also supports image insertion through a custom image extension.

Good future feature areas:

- Better toolbar polish.
- Image captions.
- Link insertion.
- Content validation.
- Draft autosave.
- Preview mode.
- Markdown export/import if needed.

### Image Uploads

Images are uploaded to Firebase Storage under the `images/` path. Uploaded image references are saved in Firestore.

Good future feature areas:

- Upload progress UI.
- Image compression.
- Alt text management.
- Image cropping.
- Better deletion safety.
- Prevent orphaned Storage files.

## 7. Data Model

### Artwork

Firestore collection: `artworks`

Current fields:

- `id`: Firestore document ID.
- `name`: artwork title.
- `mainImage`: cover image object.
- `content`: Tiptap JSON content.
- `createdAt`: optional creation timestamp string.
- `updatedAt`: optional update timestamp string.

### Diary

Firestore collection: `diary`

Current fields:

- `id`: Firestore document ID.
- `title`: diary title.
- `content`: Tiptap JSON content.
- `drawingJsonString`: saved Fabric.js canvas JSON.
- `drawingImage`: uploaded image data.
- `createdAt`: timestamp number or null.
- `updatedAt`: timestamp number or null.

### Image Object

Image-like records generally include:

- `id`: usually the uploaded file name.
- `src`: public download URL.

## 8. Authentication And Permissions

Authentication uses Firebase Auth.

Current behavior:

- Header checks current Firebase login state.
- Zustand stores user state.
- Admin pages pass `isAdminPage` to the layout/header.
- If the user is not logged in, admin pages redirect to `/`.

Important product note:

- Current admin protection appears to be handled mainly on the client side. For stronger security, Firebase security rules must also enforce who can read/write admin content. PM planning should treat security rules as a required part of any multi-user or public account feature.

## 9. Technical Architecture

### Frontend

- Next.js.
- React.
- TypeScript.
- Mostly Pages Router.
- Some placeholder App Router files exist but are not the main product surface.
- UnoCSS for utility classes and icon presets.
- Local reusable UI components.

### Backend / Services

- Firebase Firestore for content records.
- Firebase Storage for images.
- Firebase Auth for login.
- Firebase Analytics and Google Tag Manager for tracking.

### State Management

- Zustand is used for user/login state.
- Most feature state is local React state inside components and hooks.

### Testing

- Jest and React Testing Library are configured.
- Existing tests focus mostly on reusable UI components.
- Larger product flows such as admin CRUD, drawing, and Firebase integration are not deeply covered.

## 10. Content Management Flow

### Artwork Creation Flow

1. Admin opens `/admin/create`.
2. Admin enters title.
3. Admin uploads cover image.
4. Image is uploaded to Firebase Storage.
5. Admin writes rich text content.
6. Artwork record is saved to Firestore collection `artworks`.
7. Public visitors can see the artwork on `/artworks` and `/artwork/[id]`.

### Diary Creation Flow

1. Admin opens `/admin/diary/create`.
2. Admin enters title.
3. Admin draws in the canvas.
4. Admin writes rich text content.
5. Canvas is exported as a JPEG file.
6. Canvas is also exported as JSON.
7. JPEG is uploaded to Firebase Storage.
8. Diary record is saved to Firestore collection `diary`.
9. Public visitors can see the diary on `/diaries` and `/diary/[id]`.

### Diary Update Flow

1. Admin opens `/admin/diary/update/[id]`.
2. Existing diary data is loaded.
3. Saved Fabric.js JSON restores the drawing canvas.
4. Admin edits drawing and text.
5. New image and JSON are saved.
6. Updated diary record is saved to Firestore.

## 11. Current Limitations / Product Gaps

These are not necessarily bugs, but they are important for PM planning.

- Public users cannot save drawings.
- There is no full user account/profile system beyond admin login.
- Artwork and diary ordering is basic.
- Search and filtering are not implemented.
- Tags/categories/locations are not implemented.
- No draft/publish workflow.
- No moderation workflow.
- No role-based permission system.
- Admin protection should be backed by Firebase security rules.
- The App Router dashboard is only a placeholder.
- Some console logs remain in product code.
- Some test filenames contain typos such as `indes.spec.tsx`.
- README screenshots and wording may not fully match the current homepage.
- Public image uploads and content authoring are admin-only.
- Mobile drawing can likely be improved for touch ergonomics.
- Storage cleanup may leave orphaned files if records and uploaded files get out of sync.

## 12. Suggested Next Feature Directions

### Direction A: Better Public Gallery Discovery

Goal: Help visitors explore the archive more meaningfully.

Possible features:

- Artwork categories.
- Tags.
- Search.
- Sort by newest/oldest.
- Filter by location.
- Featured artwork controls.
- Artwork detail metadata.
- Related works.

Why it fits:

- The site already has artwork content.
- This improves visitor experience without requiring a major account system.

### Direction B: Stronger Diary Experience

Goal: Make diaries feel like a visual travel/sketch journal.

Possible features:

- Timeline view.
- Calendar view.
- Map/location view.
- Diary tags.
- Diary-to-artwork links.
- Date-based archive.

Why it fits:

- Diaries are a unique part of the product because they combine drawings and writing.
- This strengthens the site’s identity beyond a standard portfolio.

### Direction C: Public User Drawing Accounts

Goal: Turn the drawing tool into a user-facing creation product.

Possible features:

- User sign up/login for visitors.
- Save drawings.
- Personal gallery.
- Edit saved drawings.
- Publish/unpublish drawings.
- Share drawing links.

Why it fits:

- This aligns with the README future direction.
- It is a larger product step because it requires user permissions, ownership, storage rules, and gallery UX.

### Direction D: Drawing Tool Upgrade

Goal: Make the browser drawing experience more useful and expressive.

Possible features:

- Color picker.
- Brush presets.
- Canvas size presets.
- Layers.
- Background image import.
- Undo/redo history improvements.
- Better mobile/touch support.
- Autosave.

Why it fits:

- The drawing tool is already implemented and reused.
- Improvements benefit both public users and admin diary creation.

### Direction E: Admin CMS Improvements

Goal: Make publishing safer and easier for the creator.

Possible features:

- Draft/publish status.
- Preview before publish.
- Autosave.
- Upload progress.
- Image cropping.
- Alt text fields.
- Content validation.
- Delete confirmation.
- Better success/error notifications.

Why it fits:

- Admin workflows already exist.
- These features reduce publishing friction and accidental data issues.

## 13. Recommended PM Questions

Before planning the next sprint, clarify:

1. Should the next phase focus on **visitor discovery** or **creator/admin productivity**?
2. Should public users eventually have accounts, or should the site remain creator-managed?
3. Is the drawing tool mainly a fun public tool, or should it become a saved/publishable user product?
4. Should artworks and diaries be organized by location, date, category, or all three?
5. Does the creator need draft/publish control before public content goes live?
6. Should the site remain primarily Chinese, become bilingual, or support multiple languages?
7. Are there analytics goals, such as tracking artwork views, drawing starts, or diary reads?

## 14. Suggested MVPs For Next Work

### Small MVP

Improve artwork and diary browsing:

- Add tags/categories.
- Add simple filtering.
- Add better ordering.
- Add metadata fields.

This is relatively low risk and immediately improves the public site.

### Medium MVP

Improve admin publishing:

- Add draft/publish.
- Add preview.
- Add better upload states.
- Add delete confirmations.
- Add form validation.

This improves creator workflow and content quality.

### Large MVP

Add public user accounts and saved drawings:

- Visitor sign up/login.
- Save drawing to Firestore/Storage.
- User-owned drawing gallery.
- Edit saved drawings.
- Public/private visibility.

This would turn the website from a personal gallery into a participatory drawing platform.

## 15. Key Files For Engineering Reference

- Homepage: `src/components/ArtistHome/index.tsx`
- Public layout: `src/components/Layout/index.tsx`
- Header/auth gate: `src/components/Layout/components/Header/index.tsx`
- Artwork list: `src/components/Artworks/index.tsx`
- Artwork detail: `src/components/Artwork/index.tsx`
- Diary list: `src/components/Diaries/User/index.tsx`
- Diary detail: `src/components/Diary/User/index.tsx`
- Drawing panel: `src/components/Drawing/index.tsx`
- Canvas hook: `src/components/Drawing/hooks/useCanvas/index.ts`
- Artwork admin: `src/components/admin/index.tsx`
- Artwork create: `src/components/admin/create/index.tsx`
- Artwork update: `src/components/admin/update/index.tsx`
- Diary admin: `src/components/Diaries/Admin/index.tsx`
- Diary create: `src/components/Diary/Admin/Create/index.tsx`
- Diary update: `src/components/Diary/Admin/Update/index.tsx`
- Rich text editor: `src/components/common/MessageInput/index.tsx`
- Image uploader: `src/components/common/ImageUploader/index.tsx`
- Firebase setup: `src/libs/firebase/index.ts`
- Auth utilities: `src/libs/auth/index.ts`
- Firestore helpers: `src/utils/dataHandler/index.ts`
- Upload utilities: `src/utils/attachment/upload/index.ts`
- Data constants: `src/constants/database.ts`
- Artwork types: `src/types/artworks.ts`
- Diary types: `src/types/diary.ts`

## 16. One-Sentence Description

Nomad Sketching is a personal sketching website and lightweight CMS where visitors can browse artworks, read visual diary entries, and draw in the browser, while the creator can manage artwork and diary content through Firebase-backed admin tools.
