const DB_URL = ScriptProperties.getProperty('DB_URL');

function checkAuthorization(chatId) {
  const sheets = SpreadsheetApp.openByUrl(DB_URL);
  const sheet = sheets.getSheetByName("chats");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; ++i) {
    if (data[i][0] == chatId && data[i][1] !== "") {
      return true;
    }
  }

  return false;
}

function getNameByChatId(chatId) {
  const sheets = SpreadsheetApp.openByUrl(DB_URL);
  const sheet = sheets.getSheetByName("chats");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; ++i) {
    if (data[i][0] == chatId) {
      return data[i][1];
    }
  }

  return "None";
}

const IS_WAITING_FOR_NAME = 1;
const IS_NOT_WAITING_FOR_NAME = 0;
const TURN_ON = 1;
const TURN_OFF = 0;

function isWaitingForNameByChatId(chatId) {
  const sheets = SpreadsheetApp.openByUrl(DB_URL);
  const sheet = sheets.getSheetByName("chats");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; ++i) {
    if (data[i][0] == chatId && data[i][2] == IS_WAITING_FOR_NAME) {
      return true;
    }
  }

  return false;
}

function setWaitingForNameByChatId(chatId, value) {
  const sheets = SpreadsheetApp.openByUrl(DB_URL);
  const sheet = sheets.getSheetByName("chats");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; ++i) {
    if (data[i][0] == chatId) {
      sheet.getDataRange().getCell(i + 1, 3).setValue(value);
      return;
    }
  }

  sheet.appendRow([chatId, "", value, TURN_ON]);
}

function hasName(name) {
  const sheets = SpreadsheetApp.openByUrl(DB_URL);
  const sheet = sheets.getSheetByName("names");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; ++i) {
    if (data[i][0] === name) {
      return true;
    }
  }

  return false;
}

function setNameByChatId(name, chatId) {
  const sheets = SpreadsheetApp.openByUrl(DB_URL);
  const sheet = sheets.getSheetByName("chats");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; ++i) {
    if (data[i][0] == chatId) {
      sheet.getDataRange().getCell(i + 1, 2).setValue(name);
      break;
    }
  }
}

function getAllNames() {
  const sheets = SpreadsheetApp.openByUrl(DB_URL);
  const sheet = sheets.getSheetByName("names");
  const data = sheet.getDataRange().getValues();
  const result = [];
  for (let i = 1; i < data.length; ++i) {
    result.push(data[i][0]);
  }

  return result;
}

function getAllChatIdByName(name) {
  const sheets = SpreadsheetApp.openByUrl(DB_URL);
  const sheet = sheets.getSheetByName("chats");
  const data = sheet.getDataRange().getValues();
  const result = [];
  for (let i = 1; i < data.length; ++i) {
    if (data[i][1] == name) {
      result.push(data[i][0]);
    }
  }

  return result;
}

function hasReminderWithKey(hours, key) {
  const sheets = SpreadsheetApp.openByUrl(DB_URL);
  const sheet = sheets.getSheetByName(`reminders${hours}`);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; ++i) {
    if (data[i][0] === key) {
      return true;
    }
  }

  return false;
}

function addReminderWithKey(hours, key) {
  const sheets = SpreadsheetApp.openByUrl(DB_URL);
  const sheet = sheets.getSheetByName(`reminders${hours}`);
  const now = new Date();
  sheet.appendRow([key, now.toString()]);
}

function isReminderTurnedOn(chatId) {
  const sheets = SpreadsheetApp.openByUrl(DB_URL);
  const sheet = sheets.getSheetByName("chats");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; ++i) {
    if (data[i][0] == chatId) {
      return data[i][3] === TURN_ON;
    }
  }

  return false;
}

function turnOnReminder(chatId) {
  setReminderState(chatId, TURN_ON);
}

function turnOffReminder(chatId) {
  setReminderState(chatId, TURN_OFF);
}

function setReminderState(chatId, state) {
  const sheets = SpreadsheetApp.openByUrl(DB_URL);
  const sheet = sheets.getSheetByName("chats");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; ++i) {
    if (data[i][0] == chatId) {
      sheet.getDataRange().getCell(i + 1, 4).setValue(state);
    }
  }
}

function addToLog(text) {
  const sheets = SpreadsheetApp.openByUrl(DB_URL);
  const sheet = sheets.getSheetByName("logs");
  sheet.appendRow([text]);
}
