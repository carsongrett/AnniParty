# Anniversary celebration

A single-page invitation. Guest copy lives in `src/config/event.ts`. There is no guest database and no login. The live site is https://carsongrett.github.io/AnniParty/ and updates when `main` is pushed and the GitHub Actions deploy succeeds.

## Where things stand

Read this section first in a new chat.

- Family name on the page: **The Gretts** (no apostrophe). Couple: Carson and Mason.
- The large line under the name is **First Anniversary** (`occasion` in `event.ts`). The header link stays "The Gretts".
- Married January 10, 2026. The party is Saturday, January 16, 2027, 5:00–9:00 pm, America/Chicago. The January 16 date is the one that should stand out. "Married January 10, 2026" stays the quieter line.
- Location label is **Location**. Place: Tejas Brewery, Skyline Lounge, 2101 Summer St, Houston, TX 77007. The map search is the street address only.
- Dress code: Cocktail attire.
- Food and drink: bites and pizzas for dinner. Open bar with beer, wine, and spirits. Do not list the individual dishes, and do not say the bar is only 3 hours, until that is confirmed.
- The Details time reads on one line, with CST after 9:00 pm. Under it, a placeholder says to insert the schedule, come-and-go, or timeline once that is figured out. The evening schedule list is still hidden (`schedule: []`).
- Parking on the page: lot with security. Valet is still unconfirmed. Rideshare is encouraged.
- Calendar title is exactly `Grett's Anniversary Party`, with no description.
- RSVPify is gone. Replies live in the private Grett RSVP Google Sheet. Guests type a first and last name, and only a matching row can answer yes or no. The page script is `rsvp/Code.gs`. `rsvpPageUrl` is the deployed web app. Do not put the guest list in this repo.
- FAQ on the page: parking, rideshare, dietary needs (still a placeholder), gifts. The gift answer says no gift is needed, and mentions a handwritten card and a card box instead of a guest book. Children, plus-ones, and the RSVP deadline are not on the page. The deadline text still lives in `rsvpDeadline` and is aiming for December 15, not final.
- Photos: `photos/hero.jpg` is the tighter dinner crop with no one else in the background. `photos/beach.jpg` sits beside the welcome note. The gallery is a collage, and guests scroll it themselves. Tapping a photo opens it large.
- The brochure phone number and the catering guest count of 100 must not be published.
- Still open: valet, whether the open bar covers all four hours, sound equipment, children, plus-ones, a final RSVP date, and whether the evening needs a schedule.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints. `npm run build` then `npm run preview` serves the production build.

## Update event details

Edit `src/config/event.ts`. Replace each `[PLACEHOLDER]` with the real text. Leave an optional string as `""` to hide it.

Calendar buttons stay off until all three of these are set:

- `calendarStart` and `calendarEnd`, as local times without a zone suffix, such as `2027-01-16T17:00:00`
- `timeZone`, an IANA name such as `America/Chicago`

The date, start time, end time, and time zone shown on the page use the matching label fields.

## Replace photographs

Add image files under `public/photos/`, then update `src`, `alt`, `width`, and `height` in `src/config/event.ts`.

- `hero` is the opening photograph. `position` keeps faces in the wide crop, for example `"center 32%"`.
- `celebrationImage` sits beside the welcome note.
- `gallery` is the collage. Each photo keeps its own shape.
- `footerImage` is unused. Leave `src` empty.

Use empty `src` to hide the celebration photograph. The hero image loads immediately. Gallery images load as they approach the screen.

## Edit the FAQs and schedule

Both lists are in `src/config/event.ts`.

- Change, add, or remove objects in `faqs`.
- Change, add, or remove objects in `schedule`.
- Set `schedule` to `[]` to hide the timeline.

## RSVP

Guest names stay in a private Google Sheet. This repo never stores the list.

The first tab needs `First Name` and `Last Name` columns. `Response`, `Note`, `Responded At`, and `Group` are added if they are missing. A couple shares one word in `Group`, and either person can answer yes or no for both. A blank `Group` means that guest replies alone. The script in `rsvp/Code.gs` is pasted into Extensions → Apps Script on that sheet. If that menu only opens a Drive error, paste the sheet link into `SPREADSHEET_URL` at the top of the script and create the project at script.google.com instead. Deploy it as a web app that runs as the sheet owner and is open to anyone. Matching is the full first and last name, ignoring case and extra spaces. A name that is not on the list cannot send a reply. The page says "We could not find your name." Every name someone tries is appended to a tab named Log, including names that are not on the list, so a typo on the sheet can be checked. The page does not show other guests.

The deployed web app URL belongs in `rsvpPageUrl`. The invitation links to it from the RSVP section.

## Deploy to GitHub Pages

Pushes to `main` run `.github/workflows/deploy.yml`. In the repository, **Settings → Pages → Build and deployment** must stay on **GitHub Actions**.

The site uses a relative asset path, so it works at `https://<user>.github.io/<repo>/` and at a custom domain.

## Custom domain

When you have a domain:

1. Add it under **Settings → Pages → Custom domain**.
2. Create `public/CNAME` containing only the domain name, then redeploy.
3. At your DNS host, follow [GitHub’s custom domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site). Use a `CNAME` record to `<user>.github.io` for a subdomain, or the `A`/`AAAA` records GitHub lists for an apex domain.

No custom domain is configured yet.

## Privacy

The page sends `noindex, nofollow`, and `public/robots.txt` asks crawlers not to index the site. Anyone with the link can still open it. Do not put guest lists or other personal guest data in this repository.
