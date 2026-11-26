/**
 * KESARI STUDIO CHECK-IN GOOGLE APPS SCRIPT
 *
 * 4-Hour Session Column Divider:
 * - Each check-in session occupies 12 columns.
 * - Whenever 4 hours have passed since the previous check-in, the script leaves
 *   2 blank gap columns and starts the next 4-hour block to the right with a
 *   fresh header row.
 */

var FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
var SESSION_COLS = 12;
var GAP_COLS = 2;

var HEADERS = [
  'Entry #',
  'Session',
  'Date',
  'Time',
  'Full Name',
  'Role',
  'Phone Number',
  'Device',
  'OS',
  'Browser',
  'Gate',
  'IP Address',
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);

  try {
    var sheet = getOrCreateTargetSheet();
    var payload = {};

    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var name = payload.name || 'Guest';
    var phone = payload.phone || 'N/A';
    var role = payload.role || payload.attendeeType || 'Audience';
    var clientInfo = payload.clientInfo || {};

    var now = new Date();
    var nowMs = now.getTime();
    var timeZone = Session.getScriptTimeZone() || 'Asia/Kolkata';

    var props = PropertiesService.getScriptProperties();
    var startCol = parseInt(props.getProperty('SESSION_START_COL') || '1', 10);
    var sessionNum = parseInt(props.getProperty('SESSION_NUM') || '1', 10);
    var lastCheckinMs = parseInt(props.getProperty('LAST_CHECKIN_MS') || '0', 10);

    // Divide into a new column block after 4 hours with 2 blank gap columns
    if (lastCheckinMs > 0 && nowMs - lastCheckinMs >= FOUR_HOURS_MS) {
      startCol = startCol + SESSION_COLS + GAP_COLS;
      sessionNum = sessionNum + 1;
      props.setProperty('SESSION_START_COL', String(startCol));
      props.setProperty('SESSION_NUM', String(sessionNum));
      writeSessionHeader(sheet, startCol, sessionNum, now, timeZone);
    } else if (sheet.getLastRow() === 0 || !sheet.getRange(1, startCol).getValue()) {
      writeSessionHeader(sheet, startCol, sessionNum, now, timeZone);
    }

    props.setProperty('LAST_CHECKIN_MS', String(nowMs));

    // Find next empty row in this session's column block
    var colValues = sheet.getRange(1, startCol, Math.max(sheet.getLastRow(), 1), 1).getValues();
    var nextRow = 2;
    var entryInSession = 0;
    for (var r = 1; r < colValues.length; r++) {
      if (colValues[r][0] !== '' && colValues[r][0] !== null) {
        nextRow = r + 2;
        entryInSession++;
      }
    }
    var entryNumber = entryInSession + 1;

    var actualDate = clientInfo.clientDate || Utilities.formatDate(now, timeZone, 'dd/MM/yy');
    var actualTime = clientInfo.clientTime || Utilities.formatDate(now, timeZone, 'hh:mm:ss a');

    var rowValues = [
      entryNumber,
      'Session ' + sessionNum,
      "'" + actualDate,
      actualTime,
      name,
      role,
      "'" + phone,
      clientInfo.device || 'Unknown',
      clientInfo.os || 'Unknown',
      clientInfo.browser || 'Unknown',
      clientInfo.gate || 'Main Entrance',
      payload.ip || 'N/A',
    ];

    sheet.getRange(nextRow, startCol, 1, SESSION_COLS).setValues([rowValues]);

    return jsonResponse({
      success: true,
      entryNumber: entryNumber,
      dayNumber: sessionNum,
      slotInDay: 'Session ' + sessionNum,
      eventDate: actualDate,
      actualDate: actualDate,
      actualTime: actualTime,
      role: role,
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function writeSessionHeader(sheet, startCol, sessionNum, now, timeZone) {
  var label = Utilities.formatDate(now, timeZone, 'dd/MM/yy hh:mm a');
  var headerRow = HEADERS.slice();
  headerRow[1] = 'Session ' + sessionNum + ' (' + label + ')';
  var range = sheet.getRange(1, startCol, 1, SESSION_COLS);
  range.setValues([headerRow]);
  range.setFontWeight('bold');
  range.setBackground('#111827');
  range.setFontColor('#D8FF48');
  sheet.setFrozenRows(1);
}

function getOrCreateTargetSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Check-Ins') || ss.getSheets()[0];
  return sheet;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
