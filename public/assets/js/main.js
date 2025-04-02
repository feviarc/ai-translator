const htmlInputText = document.querySelector('#inputText');
const htmlMessagesContainer = document.querySelector('.chat__messages');
const htmlTranslateButton = document.querySelector('#translateButton');

const botMessageIcons = {
   'aleman': ' 🇩🇪',
   'español de mexico': ' 🇲🇽',
   'frances': ' 🇫🇷',
   'ingles americano': ' 🇺🇸',
   'italiano': ' 🇮🇹',
   'portugues': ' 🇵🇹',
   '400': '⚠️',
   '500': '🛑'
};


const createMessageHtmlDiv = (role, text, icon) => {

   const htmlDiv = document.createElement('div');
   let styleClasses = `chat__message chat__message--${role}`;

   if (icon === '400' || icon === '500') {
      styleClasses = `${styleClasses} message__background--${icon}`;
   }

   htmlDiv.textContent = text;
   htmlDiv.className = styleClasses;

   if (role === 'bot') {
      const htmlIcon = document.createElement('div');
      htmlIcon.className = 'message__flag';
      htmlIcon.textContent = botMessageIcons[icon];
      htmlDiv.appendChild(htmlIcon);
   }

   htmlMessagesContainer.appendChild(htmlDiv);
   htmlMessagesContainer.scrollTop = htmlMessagesContainer.scrollHeight;
};


htmlTranslateButton.addEventListener('click', async () => {

   const targetLang = document.querySelector('#targetLang').value;
   const textToTranslate = htmlInputText.value.trim();

   if(!textToTranslate) {
      createMessageHtmlDiv('bot','🤖 Escribe una palabra o frase para traducirla.', '400');
      return false;
   }

   createMessageHtmlDiv('user', `💬 ${textToTranslate}`);

   try {
      const response = await fetch('/api/translate', {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
            textToTranslate,
            targetLang
         })
      });

      const responseData = await response.json();
      const icon = response.status === 200 ? targetLang : '500';
      createMessageHtmlDiv('bot', `🤖 ${responseData.translatedText}`, icon);

   } catch(e) {
      console.log('Error: ', e);
   }

   htmlInputText.value = '';
});
