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
  /** Where the crop keeps the subject, for example "center 30%". */
  position?: string;
};

export type ScheduleItem = {
  time: string;
  label: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

const rsvpDeadline =
  "We're aiming for December 15. The final deadline is not set yet.";

export const event = {
  name: "The Gretts",
  /** Large line under the family name. Leave "" to hide it. */
  occasion: "First Anniversary",
  coupleNames: "Carson & Mason",
  date: "Saturday, January 16, 2027",
  anniversaryDate: "January 10, 2026",
  tagline: "",
  welcomeMessage:
    "We ran off and got married on January 10, 2026. Please join us at Tejas Brewery for a night of food, drinks, and music to celebrate our first year.",
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
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=2101%20Summer%20St%2C%20Houston%2C%20TX%2077007",

  dressCode: "Cocktail attire.",
  menu:
    "Bites and pizzas for dinner. The bar is open, with beer, wine, and spirits.",

  /**
   * Add, edit, or remove rows here.
   * Set this to [] to hide the schedule.
   */
  schedule: [] as ScheduleItem[],

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
   * The Google reply page, shown in the RSVP section.
   * The sheet stays private. This URL does not include the guest list.
   */
  rsvpPageUrl:
    "https://script.google.com/a/*/macros/s/AKfycbytGobONpFUE9li2pQ9sVv6CIx-gWU3i6fk9EAsbuAA7lQY863I8iS_2rmRZFjIwEQb/exec",

  /**
   * Unused. RSVPify was dropped. Leave these empty.
   */
  rsvpifyEmbedCode: "",
  rsvpifyEventUrl: "",
  rsvpifyUrl: "",
  /** Height of the embedded form. Guests can scroll inside it. */
  rsvpifyFrameHeight: 480,

  hero: {
    src: "photos/hero.jpg",
    alt: "Carson and Mason smiling together at a candlelit dinner table.",
    width: 1448,
    height: 914,
    position: "center 32%",
  } satisfies Photo,

  celebrationImage: {
    src: "photos/beach.jpg",
    alt: "Carson and Mason standing together on a beach at dusk.",
    width: 1800,
    height: 2400,
    position: "center 74%",
  } satisfies Photo,

  footerImage: {
    src: "",
    alt: "",
    width: 1280,
    height: 720,
  } satisfies Photo,

  gallery: [
    {
      src: "photos/tuxedos.jpg",
      alt: "Carson and Mason in black tuxedos with pink boutonnieres.",
      width: 1500,
      height: 2000,
    },
    {
      src: "photos/rings.jpg",
      alt: "Two hands with wedding rings held over a snowy park.",
      width: 741,
      height: 989,
    },
    {
      src: "photos/ceremony.jpg",
      alt: "Carson and Mason in black tuxedos on a lawn by the water.",
      width: 741,
      height: 989,
    },
    {
      src: "photos/lawn.jpg",
      alt: "Carson and Mason standing together on a lawn in suits.",
      width: 741,
      height: 989,
    },
    {
      src: "photos/wine.jpg",
      alt: "Carson and Mason in blazers holding glasses of wine outdoors.",
      width: 741,
      height: 989,
    },
    {
      src: "photos/porch.jpg",
      alt: "Carson and Mason in blazers on a porch beside a green lawn.",
      width: 741,
      height: 989,
    },
    {
      src: "photos/city.jpg",
      alt: "Carson and Mason standing in the middle of a city avenue.",
      width: 1800,
      height: 2700,
    },
    {
      src: "photos/lights.jpg",
      alt: "Carson and Mason with an arm around each other under pink and blue lights.",
      width: 1333,
      height: 2000,
    },
    {
      src: "photos/roof.jpg",
      alt: "Carson and Mason taking a selfie under a roof, both giving a thumbs up.",
      width: 741,
      height: 989,
    },
    {
      src: "photos/bridge.jpg",
      alt: "Carson and Mason in scarves on a bridge over the water.",
      width: 741,
      height: 989,
    },
    {
      src: "photos/license.jpg",
      alt: "Carson and Mason holding their marriage license.",
      width: 1500,
      height: 2000,
    },
    {
      src: "photos/water.jpg",
      alt: "Carson and Mason smiling together beside a waterway at dusk.",
      width: 1319,
      height: 989,
    },
    {
      src: "photos/hike.jpg",
      alt: "Carson and Mason smiling on a green overlook above a coastal town.",
      width: 1319,
      height: 989,
    },
    {
      src: "photos/dog.jpg",
      alt: "Smiling while holding a brindle dog with a bright green collar.",
      width: 875,
      height: 989,
    },
    {
      src: "photos/booth.jpg",
      alt: "Sitting in a booth beside a brindle dog.",
      width: 741,
      height: 989,
    },
    {
      src: "photos/tennis.jpg",
      alt: "A brindle dog standing in the grass with a tennis ball in its mouth.",
      width: 741,
      height: 989,
    },
  ] satisfies Photo[],

  faqs: [
    {
      question: "Where should I park?",
      answer:
        "The brewery has a parking lot with security. Valet is still being confirmed.",
    },
    {
      question: "Is rideshare recommended?",
      answer: "Rideshare is encouraged. Please do not drink and drive.",
    },
    {
      question: "Will dietary restrictions be accommodated?",
      answer: "[DIETARY_INFORMATION]",
    },
    {
      question: "Should I bring a gift?",
      answer:
        "No need for a gift. We do love a handwritten card, though. In lieu of a guest book, we'll have a card box for any notes or well wishes you'd like to share.",
    },
  ] as FaqItem[],
};
