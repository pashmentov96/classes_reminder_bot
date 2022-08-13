function doPost(e) {
  if (e.postData.type === "application/json") {
    const update = JSON.parse(e.postData.contents);
    const chatId = update.message.chat.id;

    addToLog(JSON.stringify(update.message));

    if (update.message.chat.type !== "private") {
      sendMessage('Я работаю только в личных сообщениях', chatId);

      return;
    }

    const messageText = update.message.text;
    if (isWaitingForNameByChatId(chatId)) {
      if (hasName(messageText)) {
        setNameByChatId(messageText, chatId);
        sendMessage(`Отлично. Я свяжу Ваш аккаунт с расписанием ученика: ${messageText}`, chatId);
        
        const commands = [
          '1. /next_class - Узнать дату и время следующего запланированного занятия',
          '2. /next_classes - Узнать расписание занятий на ближайшие две недели',
          '3. /turn_off - Выключить напоминания о занятиях',
          '4. /turn_on - Включить напоминания о занятиях'
        ];

        sendMessage(`Я буду присылать Вам напоминания за сутки и за один час до занятия. Также Вам доступны следующие команды:\n\n${commands.join('\n\n')}`, chatId);
      } else {
        sendMessage('К сожалению, я не нашел данного ученика у себя в базе. Попробуйте еще раз.', chatId);
      }

      setWaitingForNameByChatId(chatId, IS_NOT_WAITING_FOR_NAME);
      return;
    }

    if (messageText === "/start") {
      if (checkAuthorization(chatId)) {
        sendMessage(`Данный чат уже настроен для работы (ученик: ${getNameByChatId(chatId)}). В данный момент доступны команды /next_class, /next_classes, /turn_off и /turn_on`, chatId);
      } else {
        sendMessage('Для начала работы с ботом необходимо пройти авторизацию при помощи команды /authenticate', chatId);
      }
      
      return;
    }

    if (messageText === "/authenticate") {
      if (checkAuthorization(chatId)) {
        sendMessage(`Данный чат уже настроен для работы (ученик: ${getNameByChatId(chatId)})`, chatId);

        return;
      }

      sendMessage('Введите имя и фамилию ученика, для которого настраивается чат в формате *Имя Фамилия*', chatId, true);
      setWaitingForNameByChatId(chatId, IS_WAITING_FOR_NAME);
      
      return;
    }

    if (!checkAuthorization(chatId)) {
      sendMessage('Для начала работы с ботом необходимо пройти авторизацию при помощи команды /authenticate', chatId);

      return;
    }

    if (messageText === "/next_class") {
      sendMessage(notificationAboutNextEvent(getNameByChatId(chatId)), chatId);

      return;
    }

    if (messageText === "/next_classes") {
      sendMessage(notificationAboutNextEvents(getNameByChatId(chatId)), chatId);

      return;
    }

    if (messageText === "/turn_off") {
      if (!isReminderTurnedOn(chatId)) {
        sendMessage('Напоминания уже отключены', chatId);

        return;
      }

      turnOffReminder(chatId);
      sendMessage('Я отключил напоминания. Если передумаете, то для включения напоминаний достаточно вызвать /turn_on', chatId);

      return;
    }

    if (messageText === "/turn_on") {
      if (isReminderTurnedOn(chatId)) {
        sendMessage('Напоминания уже включены', chatId);

        return;
      }

      turnOnReminder(chatId);
      sendMessage('Я включил напоминания. Они будут приходить за сутки и за один час до занятия', chatId);

      return;
    }

    sendMessage('В данный момент я понимаю только команды /start, /authenticate, /next_class, /next_classes, /turn_off и /turn_on', chatId);
  }
}
