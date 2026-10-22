/**
 * Guest-facing content for the anniversary site.
 * Replace each [PLACEHOLDER] before sharing the link.
 * Leave an optional string as "" to hide it.
 */

export type Photo = {
  /** File path inside public/, for example "photos/hero.jpg". */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ScheduleItem = {
  time: string;
  label: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

const rsvpDeadline = "[RSVP_DEADLINE]";

export const event = {
  name: "Our First Year",
  coupleNames: "Carson & Mason",
  date: "Saturday, January 16, 2027",
  tagline: "Celebrating one year of marriage",
  welcomeMessage:
    "We were married on January 10, 2026. Please join us at Tejas Brewery to celebrate our first year.",
  closingMessage: "We can't wait to celebrate with you.",

  /** Shown in The Details. */
  startTime: "5:00 pm",
  endTime: "9:00 pm",
  /** IANA time zone once known, for example "America/Los_Angeles". */
  timeZone: "America/Chicago",

  venueName: "Tejas Brewery",
  venueAddress: "Skyline Lounge, 2101 Summer St, Houston, TX 77007",
  /**
   * Optional. A Google Maps link is created from venueAddress when that
   * value is no longer a placeholder. Set this to override that link.
   */
  mapsUrl: "",

  dressCode: "[DRESS_CODE]",
  menu:
    "Food will be out for everyone to share. Expect shrimp campechana shooters, beef empanadas, elote mac and cheese balls, and pizza. The bar is open, with beer, wine, and spirits.",

  /**
   * Add, edit, or remove rows here.
   * Set this to [] to hide the schedule.
   */
  schedule: [
    { time: "5:00 pm", label: "Welcome" },
    { time: "9:00 pm", label: "Event concludes" },
  ] as ScheduleItem[],

  /**
   * Local start and end for Add to Calendar, without a zone suffix.
   * Example: "2027-06-12T17:00:00"
   * Leave both blank until the date is final. Calendar buttons stay off until
   * these and timeZone are valid.
   */
  calendarStart: "2027-01-16T17:00:00",
  calendarEnd: "2027-01-16T21:00:00",
  /** Title used for Google Calendar and the .ics file. */
  calendarTitle: "Grett's Anniversary Party",
  /** Leave "" for no calendar description. */
  calendarDescription: "",

  rsvpDeadline,

  /**
   * Paste the snippet from RSVPify: Share & Invite → Embed your Form.
   * Leave "" until you have it.
   */
  rsvpifyEmbedCode: "",
  /**
   * Optional event URL, used only when rsvpifyEmbedCode is empty.
   * Example: "https://your-event.rsvpify.com"
   */
  rsvpifyEventUrl: "",
  /** Optional direct link shown under the form as a fallback. */
  rsvpifyUrl: "",
  /** Increase if the embedded form is cut off on a phone. */
  rsvpifyFrameHeight: 960,

  hero: {
    src: "photos/hero.jpg",
    alt: "A sunlit table set with cream linens, ceramic plates, and white flowers.",
    width: 864,
    height: 1152,
  } satisfies Photo,

  celebrationImage: {
    src: "photos/celebration.jpg",
    alt: "Two glasses of water and an olive branch on cream linen.",
    width: 1152,
    height: 864,
  } satisfies Photo,

  footerImage: {
    src: "photos/footer.jpg",
    alt: "",
    width: 1280,
    height: 720,
  } satisfies Photo,

  gallery: [
    {
      src: "photos/gallery-5.jpg",
      alt: "A long outdoor table set with cream linens in warm evening light.",
      width: 1152,
      height: 864,
    },
    {
      src: "photos/gallery-1.jpg",
      alt: "A pale stone archway in late-afternoon light.",
      width: 864,
      height: 1152,
    },
    {
      src: "photos/gallery-3.jpg",
      alt: "A lit taper candle and a white flower in a ceramic cup.",
      width: 1024,
      height: 1024,
    },
    {
      src: "photos/gallery-4.jpg",
      alt: "A folded cream linen napkin with a sprig of rosemary.",
      width: 864,
      height: 1152,
    },
    {
      src: "photos/gallery-2.jpg",
      alt: "A simple plate of roasted potatoes and herbs on ivory ceramic.",
      width: 1152,
      height: 864,
    },
  ] satisfies Photo[],

  faqs: [
    { question: "Where should I park?", answer: "[PARKING_INFORMATION]" },
    { question: "Is rideshare recommended?", answer: "[RIDESHARE_GUIDANCE]" },
    {
      question: "Will dietary restrictions be accommodated?",
      answer: "[DIETARY_INFORMATION]",
    },
    { question: "Are children invited?", answer: "[CHILDREN_POLICY]" },
    { question: "Can I bring a plus-one?", answer: "[PLUS_ONE_POLICY]" },
    { question: "When is the RSVP deadline?", answer: rsvpDeadline },
    {
      question: "Should I bring a gift?",
      answer:
        "No gifts necessary! We're simply excited to celebrate with everyone. If you'd like to bring a card, we'd love that.",
    },
  ] as FaqItem[],
};
