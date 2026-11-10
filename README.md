# CampusFit Inventory

![Expo SDK 58](https://img.shields.io/badge/Expo_SDK-58-7C3AED?logo=expo&logoColor=white)
![React Native 0.88](https://img.shields.io/badge/React_Native-0.88-4C1D95?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Platform Android](https://img.shields.io/badge/Platform-Android-0F766E)
![Module MAST5112](https://img.shields.io/badge/Module-MAST5112-172554)
![Purpose Teaching demo](https://img.shields.io/badge/Purpose-Teaching_demo-B45309)

CampusFit Inventory is a campus gym equipment tracker written in React Native, TypeScript and Expo. It is a **teaching demonstration** for MAST5112 Mobile App Scripting. Your POE is the Chef's Menu Manager for a restaurant. This demo solves the same problem for a different business, so you can see how a complete, well-organised solution is put together without being handed your own answer.

> **Please read this first.** This repository is a study aid, not a template to submit. Your POE is an individual assessment and must be your own work, built around the restaurant scenario. The brief warns that copied or unreferenced work, and excessive AI use, can lead to disciplinary action under IIE023 and IIE015. Use this project to understand ideas, then close it and build your own version in your own words and structure. Section 16 shows how to disclose any AI help you do use.

---

## Contents

1. [What this demo is and how to use it](#1-what-this-demo-is-and-how-to-use-it)
2. [Quick start on Windows](#2-quick-start-on-windows)
3. [Gym demo versus your restaurant POE](#3-gym-demo-versus-your-restaurant-poe)
4. [What the POE requires](#4-what-the-poe-requires)
5. [Where each requirement lives in this demo](#5-where-each-requirement-lives-in-this-demo)
6. [Project structure](#6-project-structure)
7. [How the app is built](#7-how-the-app-is-built)
8. [Validation, search and statistics rules](#8-validation-search-and-statistics-rules)
9. [Storage, demo data and images](#9-storage-demo-data-and-images)
10. [Testing](#10-testing)
11. [Recording your demonstration video](#11-recording-your-demonstration-video)
12. [Writing your Final PoE change log](#12-writing-your-final-poe-change-log)
13. [Submission checklist](#13-submission-checklist)
14. [Troubleshooting](#14-troubleshooting)
15. [Verification status and known limitations](#15-verification-status-and-known-limitations)
16. [AI usage disclosure](#16-ai-usage-disclosure)
17. [Code attributions](#17-code-attributions)

---

## 1. What this demo is and how to use it

The app lets a gym manager add, view, edit and delete equipment, search by name, filter by category, sort, mark favourites, and see statistics. Every screen has an image banner, and the app opens on a home screen with four menu buttons.

A sensible way to study it:

1. **Run it first.** Follow section 2, then work through the demo steps in section 11 on your phone. Try to break it: leave fields empty, type text in the price field, delete something and see what happens to the statistics.
2. **Read the requirements next.** Section 4 explains exactly what your POE asks for and how it is marked.
3. **Trace one feature at a time.** Section 5 points you to the files for each requirement. Start with `src/utils/validation.ts` and `src/utils/filtering.ts`, because they are short, plain TypeScript with no React in them.
4. **Then look at the screens.** Open `src/screens/InventoryScreen.tsx` and notice how little logic it holds. The list, the search results and the statistics are all calculated from one array of records.
5. **Build your own.** Start from your Part 2 project, apply what you learned, and write the code yourself. Keep your own naming, your own layout and your own comments.

Do not copy files, function bodies or component structures across. Markers compare your Final PoE with your Part 2 submission, and they will notice code that does not match the way you wrote the rest of the project.

---

## 2. Quick start on Windows

You need Node.js and an Android phone with Expo Go. All commands are for PowerShell.

**Step 1. Check Node and npm.**

```powershell
node --version
npm --version
```

Expo SDK 58 needs Node 22.13 or newer on the 22 line, 24.3 or newer on the 24 line, or Node 26 and above. Odd-numbered versions such as 23 and 25 are not supported. If yours does not qualify, install the current LTS release from nodejs.org.

**Step 2. Open the project folder.**

```powershell
Set-Location "C:\path\to\campus-gym-tracker"
```

Put the path in quotes if it contains spaces.

**Step 3. Install the packages.**

```powershell
npm install
```

This reads `package.json` and downloads everything the app needs into a `node_modules` folder. Do not add `--force` or `--legacy-peer-deps`. If you see an error you do not understand, read section 14 before trying anything drastic. Installing a package by hand? Use `npx expo install <package>` and not `npm install`, so Expo chooses the version that matches your SDK.

**Step 4. Sign in to Expo (needed for the tunnel option and for Expo Go).**

```powershell
npx expo login
npx expo whoami
```

`whoami` should print your Expo username.

**Step 5. Start the development server.**

```powershell
npx expo start --clear
```

A QR code appears in the terminal. Open Expo Go on your phone and scan it. Your phone and computer must be on the same Wi-Fi network. If the connection fails, which is common on campus networks, use the tunnel instead:

```powershell
npx expo start --tunnel --clear
```

**Step 6. Check the project is healthy (optional but recommended).**

```powershell
npx tsc --noEmit
npm test
npx expo-doctor
npx expo install --check
```

| Command | What it checks | What success looks like |
| --- | --- | --- |
| `npx tsc --noEmit` | TypeScript types across the whole project | No output at all |
| `npm test` | The unit tests for validation, search, sorting, statistics, storage and the reducer | `Tests: 84 passed` |
| `npx expo-doctor` | Common project configuration problems | All checks pass |
| `npx expo install --check` | Package versions match your Expo SDK | "Dependencies are up to date" |

**Which Expo Go do I need?** Each Expo Go build supports one SDK version. This project uses SDK 58. If Expo Go says the project is incompatible, install the SDK 58 build: connect your phone with USB debugging, run `npx expo start`, press `a`, and accept the install prompt. You can also download it from expo.dev/go. Do not mix SDK versions inside one project. Your own POE project may use a different SDK, so check which one your lecturer expects.

**OneDrive.** Try the normal setup first. If `npm install` fails with `EPERM` or `EBUSY` errors, or syncing becomes very slow, pause OneDrive while installing, or work in a local folder such as `C:\dev\` and copy your source files back when you finish. Do not sync `node_modules`; it contains thousands of files and is rebuilt by `npm install`.

---

## 3. Gym demo versus your restaurant POE

The demo keeps the same shape as the POE so that the ideas transfer directly.

| Your restaurant POE | This gym demo | Notes |
| --- | --- | --- |
| Menu item | Equipment record | One object in an array |
| Dish name | Equipment name | Required text |
| Description | Description | Required text |
| Course: Starter, Main Course, Dessert | Category: Cardio, Strength, Accessories | A fixed list chosen from a picker |
| Price | Unit price in rand | A number with two decimals |
| Statistic: average price | Average unit price | Unweighted, one value per record |
| Statistic: items per course | Records per category | Counts records, not units |

The demo also contains extras that your POE does **not** require: quantity, image URL, favourites, sorting, low-stock badges, saved storage, demo data and a settings screen. They are there to show how a project can grow. You do not need any of them, and a smaller app that is correct, tidy and fully working will score better than a large one with bugs. If you do add an extra feature, add only what you can fully explain in your video and test properly.

---

## 4. What the POE requires

The module brief (MAST5112 POE, 300 marks) has three stages. Part 1 is planning and has no code. This section covers Part 2 and the Final PoE. **Always check the latest brief and rubric issued by your lecturer, because they are the official source.**

Every menu item must hold four things: **dish name, description, course (Starter, Main Course or Dessert) and price.** The app must be an Android app built with React Native. The brief states clearly that you receive no marks for features whose code does not compile and run.

### Part 2: Building the application (100 marks)

The first working version. It does **not** need editing, deleting, searching, filtering or statistics.

| Criterion | Marks | What you must deliver |
| --- | --- | --- |
| Build the user interface | 30 | A clear application title, suitable React Native components, readable text, consistent spacing and alignment, a simple and attractive layout that follows your Part 1 design |
| Capture menu information | 25 | Inputs for dish name, description, course and price, each using an appropriate component |
| Display menu items | 25 | Several items can be added, all are visible, and the list updates automatically after each addition |
| Improve the user experience | 20 | Validation of required fields, clear error messages, a confirmation when an item is added, a message when the list is empty, and a consistent layout |

Submit a GitHub repository link and the link to an unlisted YouTube video of about 3 to 5 minutes showing the interface, entering information, validation, adding items and displaying them.

### Final PoE: Enhancing and completing the application (100 marks)

You continue the **same project** from Part 2 and extend it.

| Criterion | Marks | What you must deliver |
| --- | --- | --- |
| Manage menu items | 25 | Edit an existing item, update its information, delete an item. Every change shows immediately everywhere in the app |
| Search and filter | 20 | Search by dish name, filter by course, and clear the search or filter to show everything again |
| Display menu statistics | 20 | Total number of items, average price of all items, and the number of items in each course, shown clearly |
| Enhance the application | 25 (see note) | Clear improvement over Part 2: reusable components and functions, better code organisation, meaningful names, better validation and feedback |
| User experience | 10 | Easy to use, clear navigation, meaningful success and error messages, validated input, consistent look and feel on every screen |

> **Note on marks.** In the brief's written requirements, "Enhance the Application" shows 20 marks, while the rubric in Appendix A allocates 25, which is the figure that makes the Final PoE total 100. Ask your lecturer which figure applies so you can plan your effort correctly.

Submit three things for the Final PoE:

1. A **README file** with a **change log** listing every change made since Part 2 and what was changed during refactoring (see section 12).
2. Your GitHub repository link.
3. A link to an unlisted YouTube video of about 5 to 8 minutes showing adding, editing, deleting, searching, filtering, statistics and the overall functionality.

### How the rubric rewards quality

The highest band in each criterion is described in words that are very similar across criteria. In plain terms, markers look for work that is accurate and reliable, updates immediately, handles bad input gracefully, is organised into reusable parts with meaningful names, and feels consistent from screen to screen. The statistics criterion, for example, rewards figures that are correct and presented clearly, not just present. The enhancement criterion rewards visible refactoring compared with Part 2, so keep evidence of what your Part 2 code looked like (section 12 explains how).

Referencing also matters. The brief applies a penalty of up to 10 percent for inconsistent or incongruent referencing, and it states that no more than 10 percent of an assignment may consist of direct quotes. Any code idea, library documentation or tutorial you rely on must be acknowledged in the way your module requires.

---

## 5. Where each requirement lives in this demo

Use this table as a reading guide, then write your own implementation for your restaurant app.

| POE requirement | Demo file(s) to read | The idea to learn |
| --- | --- | --- |
| Clear title and consistent layout | `src/components/ScreenHeader.tsx`, `src/theme/theme.ts` | One header component and one set of colours and spacing used everywhere |
| Inputs for each field | `src/components/EquipmentForm.tsx`, `TextField.tsx`, `SelectField.tsx` | One reusable form for both Add and Edit |
| List that updates automatically | `src/screens/InventoryScreen.tsx`, `src/context/inventoryReducer.ts` | State holds the records; the list is calculated from state |
| Required-field validation and messages | `src/utils/validation.ts`, `src/components/TextField.tsx` | Validation is a plain function that returns messages |
| Success confirmation | `src/components/NoticeBanner.tsx`, `src/context/InventoryContext.tsx` | One place that shows feedback for the whole app |
| Empty state message | `src/components/EmptyState.tsx` | Show a helpful message instead of a blank screen |
| Edit and update | `src/screens/EquipmentFormScreen.tsx` | The same form, pre-filled, in edit mode |
| Delete with confirmation | `src/screens/EquipmentDetailsScreen.tsx` | `Alert.alert` with Cancel and Delete, and no screen showing a deleted record |
| Search by name | `src/utils/filtering.ts`, `src/components/SearchBar.tsx` | Trim and lowercase both sides before comparing |
| Filter by course and clear | `src/utils/filtering.ts`, `src/components/FilterChips.tsx` | Search and filter combine; one action resets both |
| Statistics | `src/utils/statistics.ts`, `src/screens/StatisticsScreen.tsx` | Calculate from all records and guard against dividing by zero |
| Reusable components and functions | `src/components/`, `src/utils/` | Small pieces, each doing one job |
| Meaningful names and organisation | Whole `src/` tree | Folders grouped by responsibility |

---

## 6. Project structure

```
App.tsx                       Providers, loading gate and notice banner
src/
  components/                 Reusable interface pieces (buttons, fields, cards, badges, banners)
  context/                    InventoryContext (shared state and actions) and inventoryReducer (pure logic)
  data/                       demoEquipment (12 sample records) and images (all image links in one place)
  navigation/                 RootNavigator (stack) and TabNavigator (bottom tabs)
  screens/                    Home, Inventory, Add/Edit, Details, Statistics and Settings
  services/                   inventoryStorage (AsyncStorage) and storageParser (pure checks)
  theme/                      theme.ts with colours, spacing, radii, type and shadows
  types/                      Shared TypeScript types
  utils/                      validation, filtering, sorting, statistics, formatting, stock and id helpers
tests/                        Jest unit tests for the pure code
```

Screens and navigation: the app opens on **Home**, which links to **Inventory**, **Add Equipment**, **Statistics** and **Settings**. Inventory, Statistics and Settings are bottom tabs. **Add/Edit** and **Details** are pushed on top of the tabs, so the tab bar never covers a button. Add and Edit are the same screen: with no `equipmentId` it adds, and with one it edits.

---

## 7. How the app is built

### One source of truth

All equipment records live in a single array held by `InventoryProvider`, updated through a reducer (`inventoryReducer.ts`). The reducer is a plain function: given the current state and an action such as `add`, `update` or `delete`, it returns the new state. Screens never keep their own copy of the records. The visible list, the details page and the statistics are all calculated from that one array each time it changes.

This is why edits and deletes show up everywhere immediately, and it is the main reason the code stays easy to follow. If you keep a second copy of your menu in another component, the two copies will drift apart, and that is the most common source of "I edited it but the list did not change" bugs.

### Logic outside the screens

Rules that are not about drawing the screen live in `src/utils/` as ordinary TypeScript functions. That keeps screens short and makes the rules testable. The pattern in simplified form:

```ts
// Search by name and filter by category, combined.
function filterItems(items: Item[], query: string, category: Category | 'All'): Item[] {
  const needle = query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesName = needle === '' || item.name.toLowerCase().includes(needle);
    const matchesCategory = category === 'All' || item.category === category;
    return matchesName && matchesCategory;
  });
}

// Average that can never be NaN or Infinity.
function averagePrice(items: Item[]): number | null {
  if (items.length === 0) return null;
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return total / items.length;
}
```

These snippets are illustrations of the idea. The real functions in the repository handle more cases (money in whole cents, sorting, favourites). Write your own versions for your own data.

### Reusable components

`AppButton`, `TextField`, `SelectField`, `Card`, `CategoryBadge`, `EmptyState` and `ScreenHeader` are each written once and used on several screens. If you find yourself copying a block of interface code a second time, that is the moment to turn it into a component. Markers specifically look for this in the Final PoE.

### Feedback the user can understand

Status is never shown by colour alone. Category and stock badges carry an icon and a word, the selected filter shows a tick, and icon-only buttons have accessibility labels. Error messages say what is wrong and how to fix it, and the form keeps what the user typed when validation fails.

---

## 8. Validation, search and statistics rules

### Validation rules in this demo

| Field | Rule |
| --- | --- |
| Name | Required after trimming spaces, up to 60 characters |
| Description | Required after trimming, up to 300 characters |
| Category | Must be one of Cardio, Strength or Accessories. Nothing is pre-selected |
| Quantity | Whole number from 0 to 9999. Rejects empty, negative, decimals and text like `3abc` |
| Unit price | Rand with at most two decimals. Accepts `1250`, `1250.5` and `1250,50`. Rejects empty, negative, text and three decimals |
| Image URL | Optional. If given, must start with `http://` or `https://` |

Values are typed as text and converted only when the whole form is validated, so a failed save never loses what the user typed. For your own app, your required fields are dish name, description, course and price.

### Search and filter

Search matches the name only, ignores capital letters and ignores spaces at the start and end. Searching and category filtering work together, and one "Clear all filters" action restores the full list. When nothing matches, a "no results" message is shown instead of an empty screen.

### Statistics formulas

| Statistic | Formula |
| --- | --- |
| Total records | Number of equipment entries |
| Average unit price | Sum of every record's unit price divided by the number of records. Unweighted: a record counts once however many units it has |
| Records per category | Count of records in each category |

With no records the average displays "No data" and is never NaN or Infinity. Statistics always describe the **whole inventory**, and the screens say so. Search and filters never change them. This matters in your own app: the brief asks for the average price of **all** menu items.

---

## 9. Storage, demo data and images

**Storage.** Records are saved on the device with AsyncStorage under the key `campusfit.inventory.v1`. Saving is switched off until the first read has finished, so an empty starting state can never overwrite saved data. Damaged records are skipped with a notice. Unreadable data is backed up and the app starts empty. If saving fails, a red banner with a Retry button stays on screen. Persistence is an optional extra for your POE.

**Demo data.** Settings contains **Load demo data**, which asks for confirmation if records already exist, and **Clear inventory**, which always asks. Demo data is never added automatically. The 12 sample records produce these figures, which are also checked by a unit test:

| Measure | Value |
| --- | --- |
| Total records | 12 |
| Total units | 95 |
| Average unit price | R10 352,87 |
| Records per category | Cardio 4, Strength 5, Accessories 3 |
| Low stock (1 to 2 units) | 3 records |
| Out of stock | 1 record |

**Images.** Every image link is kept in `src/data/images.ts`, so you change a photo in one place. Banners and the home background reuse three Unsplash photos supplied by the tutor. These links could not be checked when the project was built, so confirm they load and check the licence on each Unsplash page before using them publicly. If an image fails, the banner shows plain purple and cards show a category icon, so nothing breaks.

| Image | Used for | Source | Replace it in |
| --- | --- | --- | --- |
| Gym floor photo | Home background, Inventory banner | Unsplash, photographer not verified | `IMAGE_ASSETS.gymFloorCandidate` |
| Weights photo | Statistics and Details banners | Unsplash, photographer not verified | `IMAGE_ASSETS.weightsCandidate` |
| Training photo | Settings and Add/Edit banners, Accessories demo records | Unsplash, photographer not verified | `IMAGE_ASSETS.trainingCandidate` |

---

## 10. Testing

### Unit tests

```powershell
npm test
```

There are 7 test suites with 84 tests covering validation, filtering, sorting, statistics, the reducer, the storage parser and the demo data. They test the plain functions, not the screens.

### Manual test table

Load the demo data first unless a row says otherwise. Use this as a model for testing your own restaurant app before you record your video.

| # | Test | Steps | Expected result |
| --- | --- | --- | --- |
| 1 | Empty inventory | Fresh install | "No equipment yet", Add and Load demo buttons, Records 0, average "No data" |
| 2 | Successful add | Add with valid values | Success notice, new item at the top, statistics rise by one |
| 3 | Blank name | Leave name empty, press Save | Inline error; other typed values stay |
| 4 | Blank description | Leave empty, press Save | Inline description error |
| 5 | Missing category | Leave "Select a category", Save | Inline "Please choose a category" |
| 6 | Negative quantity | Enter -1 | "Quantity cannot be negative" |
| 7 | Decimal quantity | Enter 2.5 | Whole number error |
| 8 | Zero quantity | Enter 0 | Accepted; card shows "Out of stock" |
| 9 | Invalid price | Enter abc, 12.345, -5 | Each rejected with its own message |
| 10 | Zero price | Enter 0 | Accepted; shows R0,00 |
| 11 | Editing | Open item, Edit, change price, Save | Form was pre-filled; list, details and statistics update at once |
| 12 | Cancelling an edit | Edit, change a field, press Back | "Discard changes?" appears; Keep editing stays, Discard leaves data unchanged |
| 13 | Delete, cancel | Details, Delete, Cancel | Dialog closes; record unchanged |
| 14 | Delete, confirm | Details, Delete, Delete | Back to list; record gone; statistics drop; no stale screen |
| 15 | Case-insensitive search | Type `TREAD` | Treadmill found; `  tread  ` also works |
| 16 | Search plus category | Search `bar`, choose Strength | Only matching Strength records |
| 17 | Clear filters | Press "Clear all filters" | Search empty, category All, favourites off |
| 18 | No results | Search `zzz` | "No matching equipment" with a clear button |
| 19 | Sorting | Try every sort option | Order matches each option |
| 20 | Favourites | Tap hearts, use the Favourites chip | Heart fills and persists; chip shows favourites only |
| 21 | Statistics after changes | Add, edit, delete, open Statistics | Numbers match; filters do not change them |
| 22 | Zero-record statistics | Clear inventory | Records 0, average "No data", no NaN |
| 23 | Persistence | Force-close Expo Go and reopen | Records, favourites and threshold remain |
| 24 | Image failure | Add item with `https://example.com/nope.jpg` | Category icon appears; layout stays steady |
| 25 | Small screen and keyboard | Use a small phone or large font, focus the last field | Field and Save stay reachable |
| 26 | Storage errors | See the unit tests for corrupt data | Red banner with Retry; reset notice for corrupt data |
| 27 | Demo data guard | Load demo data with records present | Confirmation first; Cancel changes nothing |
| 28 | Android Back | Press Back on the form with changes and on dialogs | Discard prompt appears; dialogs cancel |
| 29 | Home screen and banners | Tap each Home button; check every banner | Readable white titles; with no internet the banners show plain purple |

---

## 11. Recording your demonstration video

Your Final PoE video should run about 5 to 8 minutes and be uploaded to YouTube as **Unlisted**. Speak while you demonstrate, and say what you are about to do. This is the plan for this demo; adapt it to your menu app.

| Step | What to show | Suggested time |
| --- | --- | --- |
| 1 | Open the app, show the interface and the empty state | 30 to 45 seconds |
| 2 | Press Save with the form empty, then enter bad values to show each validation message | 45 seconds |
| 3 | Add an item correctly and show the success message and the updated list | 45 seconds |
| 4 | Open an item, then edit it and show the change appear in the list | 45 seconds |
| 5 | Delete an item: cancel once, then confirm | 40 seconds |
| 6 | Search for a name using different capital letters | 30 seconds |
| 7 | Filter by category, combine it with search, then clear | 45 seconds |
| 8 | Open Statistics and explain each figure | 45 seconds |
| 9 | Close and reopen the app (only if you added storage) | 30 seconds |
| 10 | Summarise what you improved since Part 2 | 30 to 60 seconds |

Practise once before recording. Check the sound, keep the phone screen steady, and test the YouTube link while signed out before you submit it.

---

## 12. Writing your Final PoE change log

The brief requires a README containing a change log of everything that changed since Part 2, plus what was changed during refactoring. Make this useful: a marker should be able to see the difference between your two submissions without running the code.

**Protect your Part 2 evidence.** When you submit Part 2, tag the commit:

```powershell
git tag part2-submission
git push origin part2-submission
```

Later, you can show exactly what the code looked like then.

Use a table like this for the log. The rows below are examples for a restaurant app, not text to copy.

| Area | Change since Part 2 | Why |
| --- | --- | --- |
| New feature | Added edit and delete for menu items with a confirmation dialog | Required by the Final PoE |
| New feature | Added a search box and course filter that work together | Chef needs to find dishes quickly |
| New feature | Added a statistics screen with total, average price and items per course | Required by the Final PoE |
| Refactoring | Moved the form inputs out of `App.tsx` into a reusable `MenuItemForm` component | Same form is now used for add and edit |
| Refactoring | Moved price and name checks into `validation.ts` | Removed repeated checks and made them easy to test |
| Refactoring | Renamed `data1` to `menuItems` and `handle` to `handleSaveMenuItem` | Names now describe their purpose |
| Improvement | Price field now rejects negative numbers and text | Part 2 accepted invalid prices |

A short paragraph on the biggest refactor, written in your own words, is more convincing than a long list.

---

## 13. Submission checklist

**Before you submit Part 2**

- [ ] The app runs on a real Android device or emulator with no errors
- [ ] Name, description, course and price can be entered and added, and several items display
- [ ] Validation, error messages, success message and empty-state message all work
- [ ] The latest code is pushed to GitHub and the repository link opens
- [ ] A video of about 3 to 5 minutes is uploaded as Unlisted and the link works signed out

**Before you submit the Final PoE**

- [ ] Edit, delete, search, filter and statistics all work and update immediately
- [ ] The average price is correct and never shows NaN, even with no items
- [ ] Clearing search and filter restores the full list
- [ ] Code is reorganised into reusable components and functions with meaningful names
- [ ] The README includes the change log, the refactoring notes and your referencing
- [ ] Every outside source and any AI help is acknowledged (sections 16 and 17)
- [ ] The latest code is pushed to GitHub, with no `node_modules`, secrets or stray files
- [ ] A video of about 5 to 8 minutes is uploaded as Unlisted and the link works signed out
- [ ] You kept your own copy of the work, as the brief instructs

---

## 14. Troubleshooting

| Problem | What to try |
| --- | --- |
| `Cannot determine the project's Expo SDK version because the module expo is not installed` | The packages are missing. Run `npm install` in the folder that contains `package.json`, then start again |
| Expo Go says the project is incompatible | Your Expo Go supports a different SDK. See the Expo Go note in section 2 |
| QR code scans but never loads | Same Wi-Fi network, allow Node.js through Windows Firewall, or use `npx expo start --tunnel --clear` |
| Tunnel fails to start | Run `npx expo login`, confirm with `npx expo whoami`, and retry |
| Strange errors or old code still showing | Stop the server and run `npx expo start --clear` |
| `npm install` fails inside OneDrive | Pause OneDrive sync or use a local folder, as described in section 2 |
| Icons appear as empty boxes | Confirm `expo-font` and `@expo/vector-icons` are installed, then restart with `--clear` |
| Changes in the editor do not appear on the phone | Save the file, check the terminal for red errors, and shake the phone to reload |
| TypeScript error on a line you did not touch | Run `npx tsc --noEmit` and fix the first error shown; later ones are often caused by it |
| Red "could not be saved" banner | Free some phone storage, then tap Retry |
| Want to reset saved data | Settings, then Clear inventory, or clear Expo Go's storage in Android settings |

---

## 15. Verification status and known limitations

**What has been checked.** The project type-checks with `npx tsc --noEmit`, all 84 unit tests pass, and the full app compiles into an Android bundle with `npx expo export --platform android`. These checks were run in a build environment on 10 November 2026.

**What has not been checked.** Behaviour on a physical phone is for you to confirm with the manual test table. Two `expo-doctor` checks and `npx expo install --check` need internet access to Expo services and could not be completed in the build environment, so run them on your own machine. The three Unsplash image links were not reachable during the build, so their availability and content are unverified.

**Known limitations.**

- Store availability of an Expo Go build for SDK 58 was not confirmed on 10 November 2026. Use the install route in section 2 if needed.
- The app is single-user and single-device: no accounts, sync or backup. AsyncStorage data is not encrypted.
- Search matches the name only, as the POE specifies.
- The category picker looks different on Android and iOS. The POE targets Android.
- Keyboard handling uses `KeyboardAvoidingView` with `behavior="padding"`. Confirm it on your phone, especially on small screens.
- Tests cover the plain functions only. There are no screen or end-to-end tests.
- This demo uses navigation across several screens. Your own app can be simpler if your Part 1 design was.

---

## 16. AI usage disclosure

Be open about any AI help. Your institution's rules on what is allowed apply to you, and the brief warns that excessive AI usage may lead to disciplinary action, so check what your lecturer permits before you use any AI tool, and keep a record of how you used it.

### Disclosure for this demo project

> **AI-assisted development.** The source code, tests and documentation in this repository were written by Claude, an AI assistant made by Anthropic, at the request of the module tutor. The tutor set the requirements, reviewed the output and chose what to publish. The code uses the documented APIs listed in section 17 and was not copied from those sources. Automated checks run on 10 November 2026 were a TypeScript type-check, 84 unit tests and an Android bundle build. The app has not been tested on a physical device by the AI assistant. This project is provided for teaching and must not be submitted as a student's own work.

### Example disclosure for a student POE

Adapt this wording to your own situation, and only claim what is true. Place it in your README and, if your module asks, on your cover sheet.

> **AI usage declaration.** I used [name of tool and version, for example "ChatGPT"] on [date] for the following purposes only:
>
> * Explaining why my price validation accepted negative numbers. I rewrote the function myself using the explanation.
> * Suggesting names for my reusable components. I chose `MenuItemCard` and `CourseFilter` from the suggestions.
> * Checking the grammar of the descriptions in this README.
>
> I did not use AI to write my screens, my state logic or my statistics functions. All code in `src/` was written by me, and I can explain every file. Where I relied on documentation or tutorials, they are listed in the Code attributions section. I understand that I remain responsible for the accuracy and originality of this submission.

If you did not use any AI tool, you can say so in one sentence: "No AI tools were used in the development of this application."

---

## 17. Code attributions

This project uses published documentation and library references. Each entry says what the source was used for. The same sources are also listed in comment blocks at the top of the files that use them.

An entry marked **Not yet verified** means the page was not opened while this project was prepared. If you rely on one of these sources in your own work, open the page yourself and record your own date. Follow the referencing style your module requires; the layout below is the workshop convention for code attribution.

* Expo SDK 58 changelog:
   * Author: Expo
   * Used for: Confirming the Expo SDK 58 requirements, including supported Node.js versions and the React Native version
   * Link: [Expo SDK 58](https://expo.dev/changelog/sdk-58)
   * Date Accessed: 10 November 2026
* How to upgrade to SDK 58 (Expo blog):
   * Author: Expo
   * Used for: Checking the upgrade notes and how `create-expo-app` handles template versions
   * Link: [How to upgrade to SDK 58](https://expo.dev/blog/how-to-upgrade-to-sdk-58)
   * Date Accessed: 10 November 2026
* Expo Go and tunnel documentation:
   * Author: Expo
   * Used for: Understanding how `npx expo start --tunnel` works and why a login is needed
   * Link: [Expo Go](https://docs.expo.dev/preview/simulators/works-with/expo-go/)
   * Date Accessed: 10 November 2026
* React Navigation getting started:
   * Author: React Navigation contributors
   * Used for: Setting up `NavigationContainer`, `createNativeStackNavigator` and `createBottomTabNavigator`, and installing the supporting libraries with `npx expo install`
   * Link: [Getting started](https://reactnavigation.org/docs/getting-started)
   * Date Accessed: 10 November 2026
* React Navigation `usePreventRemove`:
   * Author: React Navigation contributors
   * Used for: The "Discard changes?" prompt when leaving the Add and Edit form with unsaved input
   * Link: [usePreventRemove](https://reactnavigation.org/docs/use-prevent-remove)
   * Date Accessed: 10 November 2026
* React Native Async Storage usage guide:
   * Author: React Native Async Storage contributors
   * Used for: Reading and writing the saved inventory with `getItem` and `setItem`, and handling errors
   * Link: [AsyncStorage usage](https://react-native-async-storage.github.io/async-storage/docs/usage)
   * Date Accessed: 10 November 2026
* React Native Picker:
   * Author: React Native Picker contributors
   * Used for: The category and sort selectors built with `Picker` and `Picker.Item`
   * Link: [react-native-picker/picker](https://github.com/react-native-picker/picker)
   * Date Accessed: 10 November 2026
* Expo LinearGradient (SDK 58 documentation):
   * Author: Expo
   * Used for: The dark fade laid over the home screen photograph
   * Link: [LinearGradient](https://docs.expo.dev/versions/v58.0.0/sdk/linear-gradient.md)
   * Date Accessed: 10 November 2026
* React Native FlatList:
   * Author: Meta Platforms, Inc. and React Native contributors
   * Used for: The inventory list, including `data`, `renderItem`, `keyExtractor`, `ListHeaderComponent` and `ListEmptyComponent`
   * Link: [Using a ListView](https://reactnative.dev/docs/using-a-listview)
   * Date Accessed: 10 November 2026
* React Native ImageBackground:
   * Author: Meta Platforms, Inc. and React Native contributors
   * Used for: The home screen background and the image banners behind each screen title
   * Link: [ImageBackground](https://reactnative.dev/docs/imagebackground)
   * Date Accessed: Not yet verified
* React Native KeyboardAvoidingView:
   * Author: Meta Platforms, Inc. and React Native contributors
   * Used for: Keeping form fields visible above the keyboard
   * Link: [KeyboardAvoidingView](https://reactnative.dev/docs/keyboardavoidingview)
   * Date Accessed: Not yet verified
* React Native Alert:
   * Author: Meta Platforms, Inc. and React Native contributors
   * Used for: The delete and clear-inventory confirmation dialogs
   * Link: [Alert](https://reactnative.dev/docs/alert)
   * Date Accessed: Not yet verified
* Photographs from Unsplash:
   * Author: Individual Unsplash photographers, not yet identified
   * Used for: The home background and screen banners, as generic gym photographs
   * Link: [Unsplash](https://unsplash.com)
   * Date Accessed: Not yet verified. Check each photo's page for the photographer's name and licence terms before publishing

The application code, tests and this README were written with AI assistance as described in section 16. The sources above supplied the documented behaviour of each library, not the code itself.