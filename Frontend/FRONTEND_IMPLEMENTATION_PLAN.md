# Frontend implementation plan

## Goal

Build a responsive contact-management frontend for the existing backend. The frontend must keep API access, feature logic, and UI components separate. Bulk contact import uses **JSON only**; do not add CSV import.

## Required package

Install Axios for every backend request:

```bash
npm install axios
```

Use `VITE_API_BASE_URL` for the backend URL:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Add this value to a local `Frontend/.env` file. Commit only an `.env.example`, never the real `.env` file.

## Recommended source structure

```text
src/
├── api/                         # Axios and backend endpoint functions only
│   ├── axiosClient.js
│   ├── lists.api.js
│   ├── contacts.api.js
│   └── imports.api.js
│
├── components/                  # Generic/reusable UI only
│   ├── layout/
│   │   ├── AppLayout.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Modal.jsx
│       ├── Input.jsx
│       ├── EmptyState.jsx
│       ├── LoadingState.jsx
│       ├── ErrorState.jsx
│       └── Toast.jsx
│
├── features/                    # Screen-specific UI and business behaviour
│   ├── lists/
│   │   ├── ListForm.jsx
│   │   ├── ListItem.jsx
│   │   └── DeleteListDialog.jsx
│   ├── contacts/
│   │   ├── ContactForm.jsx
│   │   ├── ContactsTable.jsx
│   │   ├── ContactSearch.jsx
│   │   └── DeleteContactDialog.jsx
│   └── imports/
│       ├── JsonImportForm.jsx
│       ├── ImportPreview.jsx
│       ├── ImportProgress.jsx
│       └── ImportResults.jsx
│
├── hooks/                       # Reusable data/state behaviour
│   ├── useLists.js
│   ├── useContacts.js
│   ├── useImportJob.js
│   └── useDebounce.js
│
├── pages/                       # Route-level screens; compose features here
│   ├── ListsPage.jsx
│   ├── ListDetailsPage.jsx
│   └── NotFoundPage.jsx
│
├── utils/
│   ├── jsonImport.js            # JSON validation and normalisation
│   └── validators.js
├── config/
│   └── env.js
├── styles/
│   └── globals.css
├── App.jsx                      # Application routes/layout only
└── main.jsx                     # React mount only
```

## API layer: Axios

`api/axiosClient.js` owns the Axios instance. It must:

- Use `import.meta.env.VITE_API_BASE_URL` as `baseURL`.
- Set `Content-Type: application/json`.
- Convert backend error responses (`response.data.message`) into one consistent frontend error message.
- Contain no UI code, React state, JSX, or feature-specific behaviour.

Each endpoint file only exports functions that call that Axios instance. Components must never call Axios directly.

### Backend contract mapping

| Frontend API module | Axios function | Backend endpoint |
| --- | --- | --- |
| `lists.api.js` | `getLists()` | `GET /api/list` |
|  | `createList(data)` | `POST /api/list` |
|  | `updateList(listId, data)` | `PUT /api/list/:listId` |
|  | `deleteList(listId)` | `DELETE /api/list/:listId` |
| `contacts.api.js` | `getContactsByList(listId)` | `GET /api/contact/list/:listId` |
|  | `searchContacts(query, listId)` | `GET /api/contact/search?query=&listId=` |
|  | `createContact(data)` | `POST /api/contact` |
|  | `getContact(contactId)` | `GET /api/contact/:contactId` |
|  | `updateContact(contactId, data)` | `PUT /api/contact/:contactId` |
|  | `deleteContact(contactId)` | `DELETE /api/contact/:contactId` |
| `imports.api.js` | `createImportJob(data)` | `POST /api/bulk-import` |
|  | `getImportJob(importJobId)` | `GET /api/bulk-import/:importJobId` |

## Screens and user flows

### 1. Lists page

- Fetch and display all lists.
- Create a list with `name` and optional `description`.
- Edit and delete a list.
- Selecting a list opens its contacts view.
- Show loading, empty, and request-error states.

### 2. List details / contacts page

- Show selected list name and description.
- Load contacts with `GET /api/contact/list/:listId`.
- Display contacts in a responsive table or cards on mobile.
- Add a contact: `name`, `phone`, optional `email`.
- Edit a contact, including moving it to another list via `listId`.
- Delete a contact with confirmation.
- Debounce search input and call the search endpoint with the selected `listId`.
- Handle duplicate-phone `409` errors clearly.

### 3. JSON bulk import

The UI accepts either a `.json` file or pasted JSON. It must parse and validate the JSON locally before sending it.

Accepted input:

```json
[
  {
    "name": "Jane Doe",
    "phone": "+919876543210",
    "email": "jane@example.com"
  },
  {
    "name": "Amit Shah",
    "phone": "+919876543211"
  }
]
```

Validation rules before submission:

- Root value must be a non-empty array.
- Every record must be an object.
- Every record needs a non-empty `name` and `phone`.
- `email` is optional.
- Trim strings and show the row number for invalid records.

After validation, submit this body:

```json
{
  "listId": "selected-list-id",
  "contacts": []
}
```

The backend returns an `importJob`. Poll `GET /api/bulk-import/:importJobId` every 1–2 seconds while status is `Pending` or `Processing`. Stop polling at `Completed` or `Failed`.

Show:

- Total and processed records
- Progress bar
- Successful, failed, and duplicate counts
- `errorMessage` for a failed job
- Returned row errors (`index`, `phone`, `message`)
- Refresh the selected list’s contacts when the job completes

## UI and responsive requirements

- Desktop: fixed/compact list sidebar with a content workspace.
- Mobile: collapsible drawer/sidebar and full-width content.
- Use accessible modal dialogs for create, edit, delete, and import actions.
- Every loading action needs a disabled submit button and visible pending state.
- Every mutation needs a success/error toast.
- Use confirmation before delete actions.
- Provide empty states for no lists, no contacts, and no search results.
- Tables must horizontally scroll or switch to contact cards on small screens.
- Keep the visual system consistent: shared buttons, form fields, modals, and feedback components.

## Important backend limitations to respect

- There is no authentication API. Do not build login/protected-route UI yet.
- There is no list-by-ID endpoint; find the selected list from the already loaded list collection.
- The contacts-by-list endpoint has no pagination. The frontend can render all results now, but pagination/filter parameters should be added in the backend before handling very large lists.
- Deleting a list currently does not delete its related contacts. Warn the user in the delete confirmation until backend cascade deletion is implemented.

## Implementation order

1. Install Axios and add the environment configuration.
2. Create the Axios client and the three API modules.
3. Create shared layout and reusable UI components.
4. Build list CRUD.
5. Build contact CRUD and debounced search.
6. Build JSON import validation, job polling, and results UI.
7. Add responsive styling, all loading/empty/error states, and manual end-to-end checks against the running backend and worker.
