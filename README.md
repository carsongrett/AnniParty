# Anniversary celebration

A single-page invitation for a first anniversary. Event copy lives in one file. There is no guest database and no login.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints. `npm run build` then `npm run preview` serves the production build.

## Update event details

Edit `src/config/event.ts`. Replace each `[PLACEHOLDER]` with the real text.

Calendar buttons stay off until all three of these are set:

- `calendarStart` and `calendarEnd`, as local times without a zone suffix, such as `2027-06-12T17:00:00`
- `timeZone`, an IANA name such as `America/Los_Angeles`

The date, start time, end time, and time zone shown on the page use the matching label fields. If a label is still a placeholder and the calendar fields are valid, the page formats the calendar time instead.

A Google Maps link appears when `venueAddress` is no longer a placeholder. Set `mapsUrl` only if you want a specific link.

## Replace photographs

Add image files under `public/photos/`, then update `src`, `alt`, `width`, and `height` in `src/config/event.ts`.

- `hero` is the opening photograph
- `celebrationImage` sits beside the welcome note
- `gallery` is the grid (about five photographs)
- `footerImage` is the closing photograph

Use empty `src` to hide the celebration or footer photograph. Use empty `alt` only when a photograph is decorative. The hero image loads immediately. Gallery images load as they approach the screen.

## Edit the FAQs and schedule

Both lists are in `src/config/event.ts`.

- Change, add, or remove objects in `faqs`.
- The RSVP deadline question uses `rsvpDeadline`, so edit that value once.
- Change, add, or remove objects in `schedule`.
- Set `schedule` to `[]` to remove the timeline.

## Add the RSVPify form

Guest replies stay in RSVPify. This site does not store them.

1. In RSVPify, open the event, then **Share & Invite → Embed your Form**, and copy the snippet.
2. Paste it into `rsvpifyEmbedCode`.
3. Optionally set `rsvpifyUrl` to the direct form link. It appears under the embed as a fallback.
4. If you only have the event URL, put it in `rsvpifyEventUrl` and leave `rsvpifyEmbedCode` empty. The page embeds it with RSVPify’s `embed=1` and `oEmbed=1` parameters.
5. If the form is cut off on a phone, increase `rsvpifyFrameHeight`.

Until one of those values is set, the section shows “RSVP details coming soon.”

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In the repository, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. `.github/workflows/deploy.yml` publishes `main` after each push.

The site uses a relative asset path, so it works at `https://<user>.github.io/<repo>/` and at a custom domain.

## Custom domain

When you have a domain:

1. Add it under **Settings → Pages → Custom domain**.
2. Create `public/CNAME` containing only the domain name, then redeploy.
3. At your DNS host, follow [GitHub’s custom domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site). Use a `CNAME` record to `<user>.github.io` for a subdomain, or the `A`/`AAAA` records GitHub lists for an apex domain.

No custom domain is configured yet.

## Privacy

The page sends `noindex, nofollow`, and `public/robots.txt` asks crawlers not to index the site. Anyone with the link can still open it. Do not put guest lists or other personal guest data in this repository.
