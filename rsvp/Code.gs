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
 * Response, Note, Responded At, and Group are added if they are missing.
 * Put the same word in Group for both people in a couple. Leave Group
 * blank for a guest who is replying alone. Either person can enter
 * their own name and answer yes or no for both.
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
    .person-name {
      margin: 1.5rem 0 0.45rem;
      font-size: 1.7rem;
      line-height: 1.1;
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
      <p id="together" class="lede" hidden></p>
      <p id="already" class="quiet" hidden>You already replied. You can change it.</p>
      <p class="lede">Will you be there?</p>
      <div id="people"></div>
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
    var party = [];

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
          party = result.people || [];
          document.getElementById("hello").textContent = "Hi " + result.firstName + ".";
          var together = document.getElementById("together");
          together.hidden = party.length < 2;
          together.textContent = party.length === 2
            ? "You can reply for both of you."
            : "You can reply for your group.";
          document.getElementById("already").hidden = !party.some(function (person) {
            return person.response === "Yes" || person.response === "No";
          });
          renderParty(party);
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
      error.textContent = "";
      var replies = [];
      for (var i = 0; i < party.length; i++) {
        var choice = document.querySelector("input[name=attending-" + i + "]:checked");
        if (!choice) {
          error.textContent = "Choose yes or no for each person.";
          return;
        }
        replies.push({
          firstName: party[i].firstName,
          lastName: party[i].lastName,
          attending: choice.value
        });
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
          document.getElementById("thanks").textContent = result.summary;
          show("done");
        })
        .withFailureHandler(function () {
          busy(button, false, "Send reply");
          error.textContent = "Something went wrong. Try again in a minute.";
        })
        .saveRsvp(savedName.first, savedName.last, replies, document.getElementById("note").value);
    };

    function renderParty(people) {
      var root = document.getElementById("people");
      root.innerHTML = "";
      people.forEach(function (person, index) {
        var name = document.createElement("p");
        name.className = "person-name";
        name.textContent = person.firstName + " " + person.lastName;
        var choices = document.createElement("div");
        choices.className = "choices";
        ["Yes", "No"].forEach(function (value) {
          var label = document.createElement("label");
          var input = document.createElement("input");
          input.type = "radio";
          input.name = "attending-" + index;
          input.value = value;
          input.checked = person.response === value;
          var span = document.createElement("span");
          span.textContent = value;
          label.appendChild(input);
          label.appendChild(span);
          choices.appendChild(label);
        });
        root.appendChild(name);
        root.appendChild(choices);
      });
    }

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

  var people = partyRowNumbers_(found, found.rows[0]).map(function (row) {
    return personAt_(found, row);
  });
  var matched = personAt_(found, found.rows[0]);
  return {
    status: "found",
    firstName: matched.firstName,
    people: people,
    note: noteAt_(found, found.rows[0])
  };
}

function saveRsvp(firstName, lastName, replies, note) {
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
    var plan = replyPlan_(found, replies);
    if (!plan) return { status: "bad" };
    var cleanNote = plainText_(note);
    var when = new Date();
    var coming = 0;
    plan.forEach(function (item) {
      found.sheet.getRange(item.row, found.cols.response).setValue(item.attending);
      found.sheet.getRange(item.row, found.cols.note).setValue(cleanNote);
      found.sheet.getRange(item.row, found.cols.when).setValue(when);
      if (item.attending === "Yes") coming++;
    });
    return { status: "saved", summary: summaryFor_(plan.length, coming) };
  } finally {
    lock.releaseLock();
  }
}

function personAt_(found, row) {
  var line = found.values[row - 2] || [];
  var response = String(line[found.cols.response - 1] || "");
  return {
    firstName: String(line[found.cols.first - 1] || "").trim(),
    lastName: String(line[found.cols.last - 1] || "").trim(),
    response: response === "Yes" || response === "No" ? response : ""
  };
}

function noteAt_(found, row) {
  var line = found.values[row - 2] || [];
  return String(line[found.cols.note - 1] || "").trim().slice(0, 500);
}

function partyRowNumbers_(found, matchedRow) {
  if (!found.cols.group || !found.values) return [matchedRow];
  var matched = found.values[matchedRow - 2];
  if (!matched) return [matchedRow];
  var groupKey = nameKey_(matched[found.cols.group - 1]);
  if (!groupKey) return [matchedRow];
  var rows = [];
  for (var i = 0; i < found.values.length; i++) {
    if (nameKey_(found.values[i][found.cols.group - 1]) === groupKey) rows.push(i + 2);
  }
  return rows.length ? rows : [matchedRow];
}

function replyPlan_(found, replies) {
  if (!replies || !replies.length) return null;
  var rows = partyRowNumbers_(found, found.rows[0]);
  var byName = {};
  rows.forEach(function (row) {
    var person = personAt_(found, row);
    byName[nameKey_(person.firstName) + "|" + nameKey_(person.lastName)] = row;
  });
  if (replies.length !== rows.length) return null;
  var plan = [];
  var seen = {};
  for (var i = 0; i < replies.length; i++) {
    var reply = replies[i] || {};
    if (reply.attending !== "Yes" && reply.attending !== "No") return null;
    var key = nameKey_(reply.firstName) + "|" + nameKey_(reply.lastName);
    if (!byName[key] || seen[key]) return null;
    seen[key] = true;
    plan.push({ row: byName[key], attending: reply.attending });
  }
  return Object.keys(seen).length === rows.length ? plan : null;
}

function summaryFor_(count, coming) {
  if (count <= 1) {
    return coming ? "We have you down as coming." : "We have you down as not coming.";
  }
  if (count === 2 && coming === 2) return "We have you both down as coming.";
  if (count === 2 && coming === 0) return "We have you both down as not coming.";
  return "We have your replies.";
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
    when: columnFor_(sheet, headers, ["responded at", "replied at", "timestamp"], "Responded At"),
    group: columnFor_(sheet, headers, ["group", "party", "couple", "household"], "Group")
  };

  var firstKey = nameKey_(firstName);
  var lastKey = nameKey_(lastName);
  var rows = [];
  var values = [];
  var lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    values = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    if (firstKey && lastKey) {
      for (var i = 0; i < values.length; i++) {
        if (nameKey_(values[i][cols.first - 1]) === firstKey && nameKey_(values[i][cols.last - 1]) === lastKey) {
          rows.push(i + 2);
        }
      }
    }
  }

  return { error: "", rows: rows, sheet: sheet, cols: cols, values: values };
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
