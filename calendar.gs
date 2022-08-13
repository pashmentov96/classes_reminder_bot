const CALENDAR_NAME = ScriptProperties.getProperty('CALENDAR_NAME');

// name: Nikita Pashmentov
function nextEventByName(name) {
  return nextEventsByName(name)?.[0];
}

// name: Nikita Pashmentov
function nextEventsByName(name) {
  const calendar = CalendarApp.getOwnedCalendarsByName(CALENDAR_NAME)[0];
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 14);

  const nextEvents = calendar.getEvents(startDate, endDate);
  const result = [];
  for (let i = 0; i < nextEvents.length; ++i) {
    const event = nextEvents[i];
    if (event.getTitle().includes(name)) {
      result.push(event);
    }
  }

  return result;
}

function formatDate(date, showWeekday = true) {
  const weekday = showWeekday ? { weekday: 'long' } : {};
  const options = { month: 'long', day: 'numeric', ...weekday };
  return date.toLocaleDateString('ru-Ru', options);
}

function formatTime(date) {
  const options = { hour: 'numeric', minute: '2-digit' };
  return date.toLocaleTimeString('ru-RU', options);
}

function getWeekday(date) {
  const options = { weekday: 'long' };
  return date.toLocaleDateString('ru-Ru', options);
}

function eventKey(event) {
  return `${event.getId()}_${event.getStartTime().toISOString()}`;
}

function notificationAboutNextEvent(name) {
  const event = nextEventByName(name);
  if (!event) {
    return 'В ближайшее время занятий не запланировано';
  } else {
    const startTime = event.getStartTime();
    
    return `Следующее занятие состоится ${formatDate(startTime, false)} в ${formatTime(startTime)} (${getWeekday(startTime)})`;
  }
}

function notificationAboutNextEvents(name) {
  const events = nextEventsByName(name);
  if (!events.length) {
    return 'В ближайшее время занятий не запланировано';
  } else {
    const results = events.map(event => `- ${formatDate(event.getStartTime())} в ${formatTime(event.getStartTime())}`);
    return `Календарь занятий на ближайшие дни:\n${results.join("\n")}`;
  }
}

function getEventForLastHour(names, hours) {
  const calendar = CalendarApp.getOwnedCalendarsByName(CALENDAR_NAME)[0];
  const startDate = new Date();
  startDate.setHours(startDate.getHours() + hours - 1);
  const endDate = new Date();
  endDate.setHours(endDate.getHours() + hours);

  const nextEvents = calendar.getEvents(startDate, endDate);
  for (let i = 0; i < names.length; ++i) {
    const name = names[i];
    for (let j = 0; j < nextEvents.length; ++j) {
      const event = nextEvents[j];
      if (event.getTitle().includes(name)) {
        return [name, event];
      }
    }
  }
  
  return null;
}
