import { renderExtensionTemplateAsync } from '../../../extensions.js';
import { setExtensionPrompt, extension_prompt_types, extension_prompt_roles } from '../../../../script.js';
import { eventSource, event_types } from '../../../../script.js'; 

/**
 * 1. НАСТРОЙКА ПРОМПТОВ
 */
const plotTwistPrompts = [
  { prompt: "[OOC: You will NOW introduce an unpredictable PLOT TWIST!]", name: "Неожиданный поворот" },
  { prompt: "[OOC: You will NOW introduce a new NPC that unexpectedly enters the scene and changes the situation!]", name: "Новый NPC" },
  { prompt: "[OOC: You will NOW make something break or malfunction in a surprising way, creating a complication!]", name: "Поломка" },
  { prompt: "[OOC: You will NOW add a sudden life event or everyday situation that twists the plot dramatically!]", name: "Жизненное событие" },
  { prompt: "[OOC: You will NOW reveal a hidden secret or unexpected connection between characters!]", name: "Секрет" },
  { prompt: "[OOC: You will NOW cause an environmental change, like weather or location shift, that alters the story!]", name: "Изменение окружения" }
];

const chaosPrompts = [
  { prompt: "[OOC: You will NOW do something UNPREDICTABLE that leads to ultimate CHAOS and DRAMA.]", name: "Хаос и драма" }
];

const neutralPrompt = { 
  prompt: "Actually, the scene is getting stale. Progress it, to make things more interesting! Reintroduce an unresolved plot point from the past. Be creative, but stay grounded in the setting.", 
  name: "Нейтральный" 
};

// Список событий для рандомных промптов
const randomEvents = [
  "stakes", "plot twist", "new character", "cataclysm", "fourth-wall-breaking joke",
  "sudden atmospheric phenomenon", "plot hook", "running gag", "ecchi scenario",
  "Death from Discworld", "new stake", "drama", "conflict", "angered entity",
  "god", "vision", "prophetic dream", "Il Dottore from Genshin Impact",
  "new development", "civilian in need", "emotional bit", "threat", "villain",
  "important memory recollection", "marriage proposal", "date idea",
  "angry horde of villagers with pitchforks", "talking animal", "enemy",
  "cliffhanger", "short omniscient POV shift", "quest", "unexpected revelation",
  "scandal", "evil clone", "death of important character", "harm to important character",
  "romantic setup", "gossip", "messenger", "plot point from past", "plot hole",
  "tragedy", "ghost", "otherworldly occurrence", "plot device", "curse",
  "magic device", "rival", "unexpected pregnancy", "brothel", "prostitute",
  "new location", "past lover", "completely random thing", "what-if scenario",
  "significant choice", "war", "love", "monster", "lewd undertones",
  "Professor Mari", "travelling troupe", "secret", "fortune-teller",
  "something completely different", "killer", "murder mystery", "mystery",
  "skill check", "deus ex machina", "three raccoons in a trench coat",
  "pet", "slave", "orphan", "psycho", "tentacles",
  "'there is only one bed' trope", "accidental marriage", "fun twist",
  "boss battle", "sexy corn", "eldritch horror", "character getting hungry/thirsty/exhausted",
  "horniness", "bathroom break need", "someone fainting", "assassination attempt",
  "meta narration of DND session", "dungeon", "friend in need", "old friend",
  "small time skip", "scene shift", "Aurora Borealis", "grand ball",
  "surprise party", "zombies", "foreshadowing", "Spanish Inquisition",
  "natural plot progression"
];

/**
 * 2. HTML-КОНТЕНТ
 */
const panelHtml = `
<div id="auto-event-panel-fix" class="auto-event-container-fix">
  <div class="auto-event-header-fix">
    <h4 id="auto-event-drag-handle">Быстрые События</h4>
    <button id="auto-event-minimize" class="auto-event-minimize-btn-fix">
      <i class="fa-solid fa-minus"></i>
    </button>
  </div>
 
  <button id="event-plot-twist" class="auto-event-button-fix">
    <i class="fa-solid fa-bolt"></i> СЮЖЕТНЫЙ ПОВОРОТ
  </button>
 
  <button id="event-chaos" class="auto-event-button-fix">
    <i class="fa-solid fa-fire"></i> ХАОС И ДРАМА
  </button>
 
  <button id="event-neutral" class="auto-event-button-fix">
    <i class="fa-solid fa-arrows-rotate"></i> НЕЙТРАЛЬНЫЙ
  </button>
 
  <button id="event-random" class="auto-event-button-fix">
    <i class="fa-solid fa-dice"></i> РАНДОМ
  </button>

  <button id="event-full-chaos" class="auto-event-button-fix">
    <i class="fa-solid fa-skull"></i> ПОЛНЫЙ ХАОС
  </button>
</div>

<!-- МИНИ-КНОПКА ДЛЯ МОБИЛЬНЫХ -->
<div id="auto-event-mini-btn" class="auto-event-mini-btn-fix">
  <i class="fa-solid fa-heart"></i>
</div>
`;

/**
 * 3. CSS-СТИЛИ (адаптированные под любую тему)
 */
const panelStyles = `
/* КОНТЕЙНЕР ПРИКРЕПЛЕННЫЙ К ОКНУ БРАУЗЕРА */
.auto-event-container-fix {
  position: fixed !important;
  z-index: 99999 !important;
  width: 250px;
  background: var(--SmartThemeBlurTintColor, rgba(30, 30, 30, 0.95)) !important;
  border: 1px solid var(--SmartThemeBorderColor, rgba(255, 255, 255, 0.2)) !important;
  top: 50px;
  right: 50px;
  padding: 8px 4px;
  border-radius: 8px;
  display: flex !important;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* ХЕДЕР С ДРАГ-ХЭНДЛОМ И КНОПКОЙ СВОРАЧИВАНИЯ */
.auto-event-header-fix {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#auto-event-drag-handle {
  flex-grow: 1;
  text-align: center;
  margin: 0;
  color: var(--SmartThemeBodyColor, #fff) !important;
  font-size: 0.9em;
  font-weight: bold;
  cursor: move !important;
  padding-bottom: 5px;
  border-bottom: 1px dashed var(--SmartThemeBorderColor, rgba(255, 255, 255, 0.3));
  letter-spacing: 0.5px;
}

.auto-event-minimize-btn-fix {
  background: none;
  border: none;
  color: var(--SmartThemeBodyColor, #fff);
  cursor: pointer;
  font-size: 1em;
  padding: 0 5px;
}

.auto-event-minimize-btn-fix:hover {
  color: var(--SmartThemeQuoteColor, #ffd700);
}

/* СТИЛЬ МИНИ-КНОПКИ ДЛЯ МОБИЛЬНЫХ */
.auto-event-mini-btn-fix {
  position: fixed !important;
  z-index: 99999 !important;
  top: 50px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: var(--SmartThemeBlurTintColor, rgba(30, 30, 30, 0.9)) !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--SmartThemeBodyColor, #fff);
  font-size: 1.2em;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  display: none;
}

.auto-event-mini-btn-fix:hover {
  background: var(--SmartThemeBorderColor, rgba(60, 60, 60, 1)) !important;
}

/* Скрытый класс для панели */
.auto-event-hidden {
  display: none !important;
}

/* Стиль для самих кнопок */
.auto-event-button-fix {
  background: var(--SmartThemeBlurTintColor, rgba(50, 50, 50, 0.8)) !important;
  color: var(--SmartThemeBodyColor, #fff) !important;
  border: 1px solid var(--SmartThemeBorderColor, rgba(255, 255, 255, 0.2)) !important;
  border-radius: 5px;
  padding: 8px 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s ease;
  width: 100%;
  letter-spacing: 0.5px;
}

/* Эффект при наведении */
.auto-event-button-fix:hover {
  background: var(--SmartThemeBorderColor, rgba(70, 70, 70, 0.9)) !important;
  color: var(--SmartThemeQuoteColor, #ffd700) !important;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Иконки внутри кнопок */
.auto-event-button-fix i {
  margin-right: 5px;
}

/* Активная кнопка */
.auto-event-button-fix.active {
  background: var(--SmartThemeQuoteColor, rgba(0, 128, 0, 0.8)) !important;
  color: #fff;
}
`;

/**
 * 4. ФУНКЦИЯ ДЛЯ ПОКАЗА УВЕДОМЛЕНИЯ
 */
function showNotification(eventName) {
  console.log('Showing notification:', eventName);
  
  // Используем toastr если доступен
  if (typeof toastr !== 'undefined') {
    toastr.success(`Применен ивент: ${eventName}`, 'Сюжетное событие', {
      timeOut: 3000,
      extendedTimeOut: 1000,
      positionClass: 'toast-top-center',
      closeButton: true
    });
  } else {
    // Fallback на кастомное уведомление
    const $notification = $('<div>')
      .css({
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--SmartThemeBlurTintColor, rgba(30, 30, 30, 0.95))',
        color: 'var(--SmartThemeBodyColor, #fff)',
        padding: '12px 24px',
        borderRadius: '8px',
        zIndex: 100001,
        fontSize: '0.95em',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        border: '1px solid var(--SmartThemeBorderColor, rgba(255, 255, 255, 0.2))',
        opacity: 0,
        transition: 'opacity 0.3s ease'
      })
      .html(`<strong>Ивент:</strong> ${eventName}`);
    
    $('body').append($notification);
    setTimeout(() => $notification.css('opacity', '1'), 10);
    setTimeout(() => {
      $notification.css('opacity', '0');
      setTimeout(() => $notification.remove(), 300);
    }, 3000);
  }
}

/**
 * 5. ФУНКЦИЯ ДЛЯ ДОБАВЛЕНИЯ СКРЫТОГО ПРОМПТА
 */
function addHiddenPrompt(promptData) {
  const { prompt, name } = promptData;
  setExtensionPrompt('auto-event', prompt, extension_prompt_types.IN_CHAT, 1, false, true, null, extension_prompt_roles.SYSTEM);
  console.log(`Скрытый промпт добавлен: ${name}`);
  showNotification(name);
}

/**
 * Функция для очистки промпта
 */
function clearHiddenPrompt() {
  setExtensionPrompt('auto-event', '', extension_prompt_types.IN_CHAT, 1, false, true, null, extension_prompt_roles.SYSTEM);
  console.log('Скрытый промпт очищен');
}

/**
 * Функция для генерации рандомного события
 */
function generateRandomEvent(isChaos = false) {
  const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
  const basePrompt = isChaos 
    ? "Actually, the scene is getting stale. Introduce {{EVENT}} to make things more interesting! Be creative and wild. Don't pay attention to the surroundings"
    : "Actually, the scene is getting stale. Introduce {{EVENT}} to make things more interesting! Be creative, but stay grounded in the setting.";
  
  const prompt = basePrompt.replace('{{EVENT}}', randomEvent);
  
  // Переводим название события на русский для уведомления
  const eventNameRu = translateEventName(randomEvent);
  
  return { prompt, name: eventNameRu };
}

/**
 * Функция для перевода названий событий
 */
function translateEventName(eventName) {
  const translations = {
    'plot twist': 'поворот сюжета',
    'new character': 'новый персонаж',
    'cataclysm': 'катаклизм',
    'drama': 'драма',
    'conflict': 'конфликт',
    'villain': 'злодей',
    'talking animal': 'говорящее животное',
    'enemy': 'враг',
    'quest': 'квест',
    'scandal': 'скандал',
    'ghost': 'призрак',
    'curse': 'проклятие',
    'rival': 'соперник',
    'monster': 'монстр',
    'zombies': 'зомби',
    'mystery': 'тайна',
    'assassination attempt': 'покушение',
    'boss battle': 'битва с боссом',
    'three raccoons in a trench coat': 'три енота в плаще',
    'angry horde of villagers with pitchforks': 'разъяренная толпа с вилами',
    'Spanish Inquisition': 'Испанская инквизиция',
    'Aurora Borealis': 'Северное сияние'
  };
  
  return translations[eventName] || eventName;
}

/**
 * 6. ФУНКЦИЯ ЗАПУСКА РАСШИРЕНИЯ
 */
jQuery(async () => {
  try {
    // Добавляем стили
    const styleElement = $('<style>').html(panelStyles);
    $('head').append(styleElement);
   
    // Добавляем HTML
    $('body').append(panelHtml);

    // Обработчики кнопок
    $('#auto-event-panel-fix').on('click', '.auto-event-button-fix', function() {
      const buttonId = $(this).attr('id');
      let promptData = null;
      
      if (buttonId === 'event-plot-twist') {
        promptData = plotTwistPrompts[Math.floor(Math.random() * plotTwistPrompts.length)];
      } else if (buttonId === 'event-chaos') {
        promptData = chaosPrompts[Math.floor(Math.random() * chaosPrompts.length)];
      } else if (buttonId === 'event-neutral') {
        promptData = neutralPrompt;
      } else if (buttonId === 'event-random') {
        promptData = generateRandomEvent(false);
      } else if (buttonId === 'event-full-chaos') {
        promptData = generateRandomEvent(true);
      }
      
      if (promptData) {
        addHiddenPrompt(promptData);
      } else {
        console.warn(`Кнопки Событий: Не найден промпт для кнопки с ID: ${buttonId}`);
      }
    });
   
    // Очистка промпта после получения сообщения
    eventSource.on(event_types.MESSAGE_RECEIVED, () => {
      clearHiddenPrompt();
    });
   
    eventSource.on(event_types.MESSAGE_SWIPED, () => {
      clearHiddenPrompt();
    });

    // ЛОГИКА ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ
    const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    console.log("Is mobile device:", isMobile);
    
    const $panel = $('#auto-event-panel-fix');
    const $miniBtn = $('#auto-event-mini-btn');
    const $minimizeBtn = $('#auto-event-minimize');
    
    if (isMobile) {
      $panel.addClass('auto-event-hidden');
      $miniBtn.css('display', 'flex');
      
      $miniBtn.on('click touchend', function(e) {
        e.preventDefault();
        $panel.removeClass('auto-event-hidden');
        $miniBtn.hide();
      });
      
      $minimizeBtn.on('click touchend', function(e) {
        e.preventDefault();
        $panel.addClass('auto-event-hidden');
        $miniBtn.css('display', 'flex');
      });
      
      // Драг для мини-кнопки
      let isMiniDragging = false;
      let miniOffset = { x: 0, y: 0 };
      
      $miniBtn.on('mousedown touchstart', function(e) {
        isMiniDragging = true;
        const miniPosition = $miniBtn.position();
        $miniBtn.css({
          top: miniPosition.top + 'px',
          left: miniPosition.left + 'px',
          right: 'auto',
          bottom: 'auto'
        });
        
        const coords = getClientCoords(e);
        miniOffset = {
          x: coords.clientX - miniPosition.left,
          y: coords.clientY - miniPosition.top
        };
        
        $miniBtn.css('cursor', 'grabbing');
        e.preventDefault();
        e.stopPropagation();
      });
      
      $(document).on('mousemove touchmove', function(e) {
        if (!isMiniDragging) return;
        if (e.type === 'touchmove') {
          e.preventDefault();
        }
        const coords = getClientCoords(e);
        const newX = coords.clientX - miniOffset.x;
        const newY = coords.clientY - miniOffset.y;
        $miniBtn.css({
          top: newY + 'px',
          left: newX + 'px',
        });
      });
      
      $(document).on('mouseup touchend', function() {
        if (isMiniDragging) {
          isMiniDragging = false;
          $miniBtn.css('cursor', '');
        }
      });
    } else {
      $miniBtn.remove();
      $minimizeBtn.remove();
    }

    // ЛОГИКА ПЕРЕТАСКИВАНИЯ ДЛЯ ПАНЕЛИ
    const $handle = $('#auto-event-drag-handle');
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    
    function getClientCoords(e) {
      if (e.type.startsWith('touch')) {
        return {
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        };
      }
      return {
        clientX: e.clientX,
        clientY: e.clientY
      };
    }
    
    $handle.on('mousedown touchstart', function(e) {
      isDragging = true;
      const panelPosition = $panel.position();
      $panel.css({
        top: panelPosition.top + 'px',
        left: panelPosition.left + 'px',
        right: 'auto',
        bottom: 'auto'
      });
      
      const coords = getClientCoords(e);
      offset = {
        x: coords.clientX - panelPosition.left,
        y: coords.clientY - panelPosition.top
      };
      
      $panel.css('cursor', 'grabbing');
      e.preventDefault();
      e.stopPropagation();
    });
    
    $(document).on('mousemove touchmove', function(e) {
      if (!isDragging) return;
      if (e.type === 'touchmove') {
        e.preventDefault();
      }
      const coords = getClientCoords(e);
      const newX = coords.clientX - offset.x;
      const newY = coords.clientY - offset.y;
      $panel.css({
        top: newY + 'px',
        left: newX + 'px',
      });
    });
    
    $(document).on('mouseup touchend', function() {
      if (isDragging) {
        isDragging = false;
        $panel.css('cursor', '');
      }
    });
    
    console.log("Расширение 'Кнопки Авто-Событий' успешно настроено.");
  } catch (error) {
    console.error("Критическая ошибка при загрузке 'Кнопок Авто-Событий':", error);
  }
});

