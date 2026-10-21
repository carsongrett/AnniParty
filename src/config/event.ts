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
  name: "[EVENT_NAME]",
  coupleNames: "[COUPLE_NAMES]",
  date: "[EVENT_DATE]",
  tagline: "[EVENT_TAGLINE]",
  welcomeMessage: "[WELCOME_MESSAGE]",
  closingMessage: "[CLOSING_MESSAGE]",

  /** Shown in The Details. */
  startTime: "[START_TIME]",
  endTime: "[END_TIME]",
  /** IANA time zone once known, for example "America/Los_Angeles". */
  timeZone: "[TIME_ZONE]",

  venueName: "[VENUE_NAME]",
  venueAddress: "[VENUE_ADDRESS]",
  /**
   * Optional. A Google Maps link is created from venueAddress when that
   * value is no longer a placeholder. Set this to override that link.
   */
  mapsUrl: "",

  dressCode: "[DRESS_CODE]",
  menu: "[MENU_DESCRIPTION]",

  /**
   * Add, edit, or remove rows here.
   * Set this to [] to hide the schedule.
   */
  schedule: [
    { time: "[TIME_1]", label: "Welcome / Cocktails" },
    { time: "[TIME_2]", label: "Dinner" },
    { time: "[TIME_3]", label: "Celebration" },
    { time: "[TIME_4]", label: "Event Concludes" },
  ] as ScheduleItem[],

  /**
   * Local start and end for Add to Calendar, without a zone suffix.
   * Example: "2027-06-12T17:00:00"
   * Leave both blank until the date is final. Calendar buttons stay off until
   * these and timeZone are valid.
   */
  calendarStart: "",
  calendarEnd: "",
  /** Optional. Falls back to the welcome message when that text is real. */
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
