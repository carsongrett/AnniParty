/**
 * Guest reply page for the Grett anniversary.
 *
 * Leave SPREADSHEET_URL blank when this script is opened from
 * Extensions → Apps Script inside the Google Sheet.
 *
 * If that menu only shows a Drive error, create the project at
 * script.google.com instead and paste the sheet link between the quotes.
 * The link looks like https://docs.google.com/spreadsheets/d/abc123/edit
 *
 * Deploy as a web app that runs as you and is open to anyone.
 * The spreadsheet itself stays private.
 *
 * The first tab needs a First Name column and a Last Name column.
 * Response, Note, and Responded At are added if they are missing.
 * Guests are matched on first and last name only. The page never
 * shows the rest of the list. Every name someone tries is added to
 * a tab named Log, including names that are not on the list.
 */
var SPREADSHEET_URL = "";

var PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Find your invitation</title>
  <style>
    :root {
      color: #2c2825;
      background: #f6f1e8;
      font-family: Georgia, "Palatino Linotype", Palatino, serif;
    }
    html, body {
      margin: 0;
      width: 100%;
    }
    body {
      min-height: 100vh;
    }
    main {
      box-sizing: border-box;
      width: 100%;
      margin: 0;
      padding: 1.25rem 1rem 2rem;
    }
    h1 {
      margin: 0;
      font-weight: 400;
      font-size: 3.25rem;
      line-height: 1.05;
    }
    .occasion {
      margin: 0.75rem 0 0;
      font-size: 2rem;
      line-height: 1.1;
    }
    .lede {
      margin: 1.5rem 0 0;
      font-family: "Segoe UI", sans-serif;
      font-size: 1rem;
      line-height: 1.5;
    }
    form, .card {
      margin-top: 2rem;
    }
    label {
      display: block;
      margin: 1rem 0 0.4rem;
      font-family: "Segoe UI", sans-serif;
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    input[type="text"], textarea {
      box-sizing: border-box;
      width: 100%;
      border: 1px solid #e3d6c6;
      background: #fffaf3;
      color: #2c2825;
      font: inherit;
      font-family: "Segoe UI", sans-serif;
      font-size: 1rem;
      padding: 0.85rem 0.9rem;
    }
    textarea {
      min-height: 7rem;
      resize: vertical;
    }
    .choices {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    .choices label {
      position: relative;
      margin: 0;
      border: 1px solid #e3d6c6;
      background: #fffaf3;
      padding: 1rem;
      text-align: center;
      letter-spacing: 0.14em;
      cursor: pointer;
    }
    .choices input {
      position: absolute;
      opacity: 0;
    }
    .choices input:checked + span {
      font-weight: 700;
    }
    .choices label:has(input:checked) {
      border-color: #2c2825;
    }
    button, .text-button {
      box-sizing: border-box;
      width: 100%;
      margin-top: 1.25rem;
      min-height: 3rem;
      border: 0;
      background: #2c2825;
      color: #f6f1e8;
      font-family: "Segoe UI", sans-serif;
      font-size: 0.8rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      padding: 0.85rem 1.25rem;
      cursor: pointer;
    }
    button:disabled {
      cursor: wait;
      opacity: 0.7;
    }
    .text-button {
      display: inline-block;
      width: auto;
      margin-top: 1.5rem;
      background: transparent;
      color: #6f675f;
      text-decoration: underline;
      letter-spacing: 0;
      text-transform: none;
      padding: 0;
    }
    .error, .quiet {
      font-family: "Segoe UI", sans-serif;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    .error {
      min-height: 1.4rem;
      margin: 0.9rem 0 0;
    }
    .quiet {
      color: #6f675f;
    }
    [hidden] {
      display: none !important;
    }
  </style>
</head>
<body>
  <main>
    <h1>Find your invitation.</h1>

    <form id="lookup">
      <label for="first">First name</label>
      <input id="first" name="first" type="text" autocomplete="given-name" required>
      <label for="last">Last name</label>
      <input id="last" name="last" type="text" autocomplete="family-name" required>
      <p id="lookup-error" class="error" role="alert"></p>
      <button id="continue" type="submit">Continue</button>
    </form>

    <form id="reply" hidden>
      <p id="hello" class="occasion"></p>
      <p id="already" class="quiet" hidden>You already replied. You can change it.</p>
      <p class="lede">Will you be there?</p>
      <div class="choices">
        <label><input id="yes" type="radio" name="attending" value="Yes" required><span>Yes</span></label>
        <label><input id="no" type="radio" name="attending" value="No"><span>No</span></label>
      </div>
      <label for="note">Anything we should know? Optional.</label>
      <textarea id="note" name="note" maxlength="500"></textarea>
      <p id="reply-error" class="error" role="alert"></p>
      <button id="send" type="submit">Send reply</button>
      <div><button id="back" class="text-button" type="button">Use a different name</button></div>
    </form>

    <section id="done" class="card" hidden>
      <p id="thanks" class="occasion"></p>
      <p class="lede">You can come back and change your reply if your plans change.</p>
      <button id="again" type="button">Change reply</button>
    </section>

    <section id="problem" class="card" hidden>
      <p class="occasion">This page is not ready yet.</p>
      <p class="lede">Please check back soon, or text Carson or Mason.</p>
    </section>
  </main>
  <script>
    var savedName = { first: "", last: "" };

    function show(id) {
      ["lookup", "reply", "done", "problem"].forEach(function (name) {
        document.getElementById(name).hidden = name !== id;
      });
    }

    function busy(button, waiting, label) {
      button.disabled = waiting;
      button.textContent = waiting ? "One moment" : label;
    }

    document.getElementById("lookup").onsubmit = function (event) {
      event.preventDefault();
      var button = document.getElementById("continue");
      var error = document.getElementById("lookup-error");
      error.textContent = "";
      busy(button, true, "Continue");
      var first = document.getElementById("first").value;
      var last = document.getElementById("last").value;
      google.script.run
        .withSuccessHandler(function (result) {
          busy(button, false, "Continue");
          if (!result || result.status === "setup") {
            show("problem");
            return;
          }
          if (result.status === "missing") {
            error.textContent = "We could not find your name.";
            return;
          }
          if (result.status === "many") {
            error.textContent = "More than one guest has that name. Text Carson or Mason and we will help.";
            return;
          }
          savedName = { first: first, last: last };
          document.getElementById("hello").textContent = "Hi " + result.firstName + ".";
          document.getElementById("already").hidden = result.response !== "Yes" && result.response !== "No";
          document.getElementById("yes").checked = result.response === "Yes";
          document.getElementById("no").checked = result.response === "No";
          document.getElementById("note").value = result.note || "";
          document.getElementById("reply-error").textContent = "";
          show("reply");
        })
        .withFailureHandler(function () {
          busy(button, false, "Continue");
          error.textContent = "Something went wrong. Try again in a minute.";
        })
        .lookupGuest(first, last);
    };

    document.getElementById("reply").onsubmit = function (event) {
      event.preventDefault();
      var button = document.getElementById("send");
      var error = document.getElementById("reply-error");
      var choice = document.querySelector("input[name=attending]:checked");
      error.textContent = "";
      if (!choice) {
        error.textContent = "Choose yes or no.";
        return;
      }
      busy(button, true, "Send reply");
      google.script.run
        .withSuccessHandler(function (result) {
          busy(button, false, "Send reply");
          if (!result || result.status !== "saved") {
            if (result && result.status === "missing") {
              error.textContent = "We couldn't find that name anymore. Go back and try again.";
              return;
            }
            error.textContent = "Something went wrong. Try again in a minute.";
            return;
          }
          document.getElementById("thanks").textContent = result.attending === "Yes"
            ? "We have you down as coming."
            : "We have you down as not coming.";
          show("done");
        })
        .withFailureHandler(function () {
          busy(button, false, "Send reply");
          error.textContent = "Something went wrong. Try again in a minute.";
        })
        .saveRsvp(savedName.first, savedName.last, choice.value, document.getElementById("note").value);
    };

    document.getElementById("back").onclick = function () {
      show("lookup");
    };

    document.getElementById("again").onclick = function () {
      document.getElementById("lookup").requestSubmit
        ? document.getElementById("lookup").requestSubmit()
        : document.getElementById("continue").click();
    };
  </script>
</body>
</html>`;

function doGet() {
  return HtmlService.createHtmlOutput(PAGE)
    .setTitle("Find your invitation")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function lookupGuest(firstName, lastName) {
  var found = findRows_(firstName, lastName);
  if (found.error) return { status: found.error };
  if (found.rows.length === 0) {
    logAttempt_(firstName, lastName, "Not on the list");
    return { status: "missing" };
  }
  if (found.rows.length > 1) {
    logAttempt_(firstName, lastName, "More than one match");
    return { status: "many" };
  }
  logAttempt_(firstName, lastName, "Invited");

  var row = found.rows[0];
  var response = String(found.sheet.getRange(row, found.cols.response).getValue() || "");
  return {
    status: "found",
    firstName: String(found.sheet.getRange(row, found.cols.first).getDisplayValue() || "").trim(),
    response: response === "Yes" || response === "No" ? response : "",
    note: String(found.sheet.getRange(row, found.cols.note).getDisplayValue() || "").slice(0, 500)
  };
}

function saveRsvp(firstName, lastName, attending, note) {
  if (attending !== "Yes" && attending !== "No") return { status: "bad" };

  var found = findRows_(firstName, lastName);
  if (found.error) return { status: found.error };
  if (found.rows.length === 0) return { status: "missing" };
  if (found.rows.length > 1) return { status: "many" };

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    found = findRows_(firstName, lastName);
    if (found.error) return { status: found.error };
    if (found.rows.length !== 1) {
      return { status: found.rows.length === 0 ? "missing" : "many" };
    }
    var row = found.rows[0];
    found.sheet.getRange(row, found.cols.response).setValue(attending);
    found.sheet.getRange(row, found.cols.note).setValue(plainText_(note));
    found.sheet.getRange(row, found.cols.when).setValue(new Date());
  } finally {
    lock.releaseLock();
  }

  return { status: "saved", attending: attending };
}

function guestBook_() {
  try {
    var book = SPREADSHEET_URL
      ? SpreadsheetApp.openByUrl(SPREADSHEET_URL)
      : SpreadsheetApp.getActiveSpreadsheet();
    return book || null;
  } catch (error) {
    return null;
  }
}

function guestSheet_() {
  var book = guestBook_();
  if (!book) return null;
  var sheets = book.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (String(sheets[i].getName()).trim().toLowerCase() === "log") continue;
    return sheets[i];
  }
  return null;
}

function logAttempt_(firstName, lastName, result) {
  var typedFirst = String(firstName || "").trim();
  var typedLast = String(lastName || "").trim();
  if (!typedFirst && !typedLast) return;
  try {
    var book = guestBook_();
    if (!book) return;
    var sheet = book.getSheetByName("Log");
    if (!sheet) {
      sheet = book.insertSheet("Log", book.getSheets().length);
      sheet.getRange(1, 1, 1, 4).setValues([["When", "First Name", "Last Name", "Result"]]);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date(), typedFirst, typedLast, result]);
  } catch (error) {}
}

function findRows_(firstName, lastName) {
  var sheet = guestSheet_();
  if (!sheet) return { error: "setup", rows: [] };
  var width = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0];
  var firstCol = columnFor_(sheet, headers, ["first name", "firstname", "first"], "");
  var lastCol = columnFor_(sheet, headers, ["last name", "lastname", "last"], "");
  if (!firstCol || !lastCol) return { error: "setup", rows: [] };

  headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  var cols = {
    first: firstCol,
    last: lastCol,
    response: columnFor_(sheet, headers, ["response", "rsvp", "attending"], "Response"),
    note: columnFor_(sheet, headers, ["note", "notes", "message"], "Note"),
    when: columnFor_(sheet, headers, ["responded at", "replied at", "timestamp"], "Responded At")
  };

  var firstKey = nameKey_(firstName);
  var lastKey = nameKey_(lastName);
  var rows = [];
  var lastRow = sheet.getLastRow();
  if (firstKey && lastKey && lastRow >= 2) {
    var values = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    for (var i = 0; i < values.length; i++) {
      if (nameKey_(values[i][cols.first - 1]) === firstKey && nameKey_(values[i][cols.last - 1]) === lastKey) {
        rows.push(i + 2);
      }
    }
  }

  return { error: "", rows: rows, sheet: sheet, cols: cols };
}

function columnFor_(sheet, headers, names, createLabel) {
  for (var i = 0; i < headers.length; i++) {
    var key = String(headers[i] || "").trim().toLowerCase();
    for (var n = 0; n < names.length; n++) {
      if (key === names[n]) return i + 1;
    }
  }
  if (!createLabel) return 0;
  var col = Math.max(sheet.getLastColumn(), headers.length) + 1;
  sheet.getRange(1, col).setValue(createLabel);
  return col;
}

function nameKey_(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[.'’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function plainText_(value) {
  var text = String(value || "").replace(/\u0000/g, "").trim().slice(0, 500);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}
