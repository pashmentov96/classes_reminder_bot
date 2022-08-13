function startTrigger() {
  ScriptApp.newTrigger('notifyAboutNextClasses')
    .timeBased()
    .everyMinutes(10)
    .create();
}

function removeTriggers() {
  const allTriggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < allTriggers.length; ++i) {
    if (allTriggers[i].getTriggerSource() == ScriptApp.TriggerSource.CLOCK) {
      ScriptApp.deleteTrigger(allTriggers[i]);
    }
  }
}

function notifyAboutNextClasses() {
  reminderFor1Hour();
  reminderFor24Hours();
}

// Напоминаю, что на завтра в 19:00 запланировано занятие
function reminderFor24Hours() {
  function getMessageForEvent(event) {
    return `Напоминаю, что на завтра в ${formatTime(event.getStartTime())} запланировано занятие`;
  }

  reminderForHours(24, getMessageForEvent);
}

// Напоминаю, что сегодня в 19:00 состоится занятие (осталось 55 мин.)
function reminderFor1Hour() {
  function getMessageForEvent(event) {
    const minutes = Math.floor((event.getStartTime() - (new Date())) / (1000 * 60));
    return `Напоминаю, что сегодня в ${formatTime(event.getStartTime())} состоится занятие (осталось ${minutes} мин.)`;
  }

  reminderForHours(1, getMessageForEvent);
}

function reminderForHours(hours, getMessageForEvent) {
  const names = getAllNames();
  const res = getEventForLastHour(names, hours);
  if (!res) {
    return;
  }

  const [name, event] = res;
  const chatIds = getAllChatIdByName(name);
  chatIds.forEach(chatId => {
    const key = `${chatId}_${eventKey(event)}`;
    const now = new Date();
    if (isReminderTurnedOn(chatId) && !hasReminderWithKey(hours, key) && event.getStartTime() > now) {
      const message = getMessageForEvent(event);
      sendMessage(message, chatId);
      sendMessage(`${message}. Ученик: ${name}`, MY_TELEGRAM_CHAT_ID);
      addReminderWithKey(hours, key);
    }
  });
}
