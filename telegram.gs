const CURRENT_WEB_APP_URL = ScriptProperties.getProperty('CURRENT_WEB_APP_URL');
const TELEGRAM_API_TOKEN = ScriptProperties.getProperty('TELEGRAM_API_TOKEN');
const MY_TELEGRAM_CHAT_ID = ScriptProperties.getProperty('MY_TELEGRAM_CHAT_ID');

function sendMessage(text, chat_id, hasFormatting=false) {
  const formatting = hasFormatting ? {'parse_mode': 'MarkdownV2'} : {};
  return request('sendMessage', {
    'text': text,
    'chat_id': chat_id,
    ...formatting
  });
}

function setWebhook() {
  return request('setWebhook', { url: CURRENT_WEB_APP_URL });
}

function deleteWebhook() {
  return request('deleteWebhook', {});
}

function webHookInfo() {
  return request('getWebhookInfo');
}

function request(method, data) {
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(data)
  };

  const response = UrlFetchApp.fetch(`https://api.telegram.org/bot${TELEGRAM_API_TOKEN}/${method}`, options);

  if (response.getResponseCode() === 200) {
    return JSON.parse(response.getContentText());
  }

  return `Error with code ${response.getResponseCode()}`;
}
