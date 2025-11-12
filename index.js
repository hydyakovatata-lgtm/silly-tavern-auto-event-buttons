import { renderExtensionTemplateAsync } from '../../../extensions.js';
import { setExtensionPrompt, extension_prompt_types, extension_prompt_roles } from '../../../../script.js';
/**
 * 1. НАСТРОЙКА ПРОМПТОВ
 */
const plotTwistPrompts = [
  "[OOC: You will NOW introduce an unpredictable PLOT TWIST!]",
  "[OOC: You will NOW introduce a new NPC that unexpectedly enters the scene and changes the situation!]",
  "[OOC: You will NOW make something break or malfunction in a surprising way, creating a complication!]",
  "[OOC: You will NOW add a sudden life event or everyday situation that twists the plot dramatically!]",
  "[OOC: You will NOW reveal a hidden secret or unexpected connection between characters!]",
  "[OOC: You will NOW cause an environmental change, like weather or location shift, that alters the story!]"
];
const chaosPrompts = [
  "[OOC: You will NOW do something UNPREDICTABLE that leads to ultimate CHAOS and DRAMA.]"
];
// Гигантский рандомный промпт с {{random::...}}
const randomStalePrompt = `Actually, the scene is getting stale. Introduce {{random::stakes::a plot twist::a new character::a cataclysm::a fourth-wall-breaking joke::a sudden atmospheric phenomenon::a plot hook::a running gag::an ecchi scenario::Death from Discworld::a new stake::a drama::a conflict::an angered entity::a god::a vision::a prophetic dream::Il Dottore from Genshin Impact::a new development::a civilian in need::an emotional bit::a threat::a villain::an important memory recollection::a marriage proposal::a date idea::an angry horde of villagers with pitchforks::a talking animal::an enemy::a cliffhanger::a short omniscient POV shift to a completely different character::a quest::an unexpected revelation::a scandal::an evil clone::death of an important character::harm to an important character::a romantic setup::a gossip::a messenger::a plot point from the past::a plot hole::a tragedy::a ghost::an otherworldly occurrence::a plot device::a curse::a magic device::a rival::an unexpected pregnancy::a brothel::a prostitute::a new location::a past lover::a completely random thing::a what-if scenario::a significant choice::war::love::a monster::lewd undertones::Professor Mari::a travelling troupe::a secret::a fortune-teller::something completely different::a killer::a murder mystery::a mystery::a skill check::a deus ex machina::three raccoons in a trench coat::a pet::a slave::an orphan::a psycho::tentacles::"there is only one bed" trope::accidental marriage::a fun twist::a boss battle::sexy corn::an eldritch horror::a character getting hungry, thirsty, or exhausted::horniness::a need for a bathroom break need::someone fainting::an assassination attempt::a meta narration of this all being an out of hand DND session::a dungeon::a friend in need::an old friend::a small time skip::a scene shift::Aurora Borealis, at this time of year, at this time of day, at this part of the country::a grand ball::a surprise party::zombies::foreshadowing::a Spanish Inquisition (nobody expects it)::a natural plot progression}} to make things more interesting! Be creative, but stay grounded in the setting.`;
const neutralPrompt = "Actually, the scene is getting stale. Progress it, to make things more interesting! Reintroduce an unresolved plot point from the past. Be creative, but stay grounded in the setting.";
const promptTypes = {
  "[OOC: You will NOW introduce an unpredictable PLOT TWIST!]": "Неожиданный поворот",
  "[OOC: You will NOW introduce a new NPC that unexpectedly enters the scene and changes the situation!]": "Новый NPC",
  "[OOC: You will NOW make something break or malfunction in a surprising way, creating a complication!]": "Поломка",
  "[OOC: You will NOW add a sudden life event or everyday situation that twists the plot dramatically!]": "Жизненное событие",
  "[OOC: You will NOW reveal a hidden secret or unexpected connection between characters!]": "Секрет",
  "[OOC: You will NOW cause an environmental change, like weather or location shift, that alters the story!]": "Изменение окружения",
  "[OOC: You will NOW do something UNPREDICTABLE that leads to ultimate CHAOS and DRAMA.]": "Хаос и драма",
  "Actually, the scene is getting stale. Progress it, to make things more interesting! Reintroduce an unresolved plot point from the past. Be creative, but stay grounded in the setting.": "Нейтральный",
  [randomStalePrompt]: "Случайный поворот (гигантский рандом)"
};
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
</div>
<!-- МИНИ-КНОПКА ДЛЯ МОБИЛЬНЫХ -->
<div id="auto-event-mini-btn" class="auto-event-mini-btn-fix">
  <i class="fa-solid fa-heart"></i>
</div>
`;
/**
 * 3. CSS-СТИЛИ
 */
const panelStyles = `
/* КОНТЕЙНЕР ПРИКРЕПЛЕН К ОКНУ БРАУЗЕРА */
.auto-event-container-fix {
  position: fixed !important;
  z-index: 99999 !important;
  width: 250px;
  background: rgba(80, 100, 80, 0.9) !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
  top: 50px;
  right: 50px;
  padding: 8px 4px;
  border-radius: 8px;
  display: flex !important;
  flex-direction: column;
  gap: 8px;
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
  color: #fff !important;
  font-size: 0.9em;
  font-weight: bold;
  cursor: move !important;
  padding-bottom: 5px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  letter-spacing: 0.5px;
}
.auto-event-minimize-btn-fix {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1em;
  padding: 0 5px;
}
.auto-event-minimize-btn-fix:hover {
  color: #ffd700;
}
/* СТИЛЬ МИНИ-КНОПКИ ДЛЯ МОБИЛЬНЫХ */
.auto-event-mini-btn-fix {
  position: fixed !important;
  z-index: 99999 !important;
  top: 50px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: rgba(80, 100, 80, 0.7) !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.2em;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  display: none;
}
.auto-event-mini-btn-fix:hover {
  background: rgba(80, 100, 80, 1) !important;
}
/* Скрытый класс для панели */
.auto-event-hidden {
  display: none !important;
}
/* Стиль для самих кнопок */
.auto-event-button-fix {
  background: var(--secondary-btn-bg);
  color: var(--secondary-btn-text);
  border: 1px solid var(--secondary-btn-border);
  border-radius: 5px;
  padding: 8px 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s ease;
  width: 100%;
  letter-spacing: 0.5px;
}
/* Эффект при наведении */
.auto-event-button-fix:hover {
  background: var(--secondary-btn-hover-bg);
  color: var(--secondary-btn-hover-text);
}
/* Иконки внутри кнопок */
.auto-event-button-fix i {
  margin-right: 5px;
}
/* Активная кнопка (для РАНДОМ) */
.auto-event-button-fix.active {
  background: rgba(0, 128, 0, 0.8) !important;
  color: #fff;
}
/* Стили для кастомного уведомления */
.auto-event-notification {
  position: fixed !important;
  top: 20px !important;
  right: 20px !important;
  background: rgba(80, 100, 80, 0.9) !important;
  color: #fff !important;
  padding: 10px 20px !important;
  border-radius: 5px !important;
  z-index: 100001 !important;
  font-size: 0.9em !important;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3) !important;
  opacity: 0 !important;
  transition: opacity 0.3s ease !important;
}
.auto-event-notification.show {
  opacity: 1 !important;
}
`;
/**
 * 4. ФУНКЦИЯ ДЛЯ ПОКАЗА УВЕДОМЛЕНИЯ
 */
function showNotification(message) {
  console.log('Showing notification:', message);
  if (typeof toastr !== 'undefined') {
    toastr.info(message, 'Сюжетный поворот', {
      timeOut: 3000,
      extendedTimeOut: 1000,
      positionClass: 'toast-top-right'
    });
  } else {
    const $notification = $('<div>')
      .addClass('auto-event-notification')
      .text(message)
      .css({ 'z-index': 100001 });
    $('body').append($notification);
    setTimeout(() => $notification.addClass('show'), 10);
    setTimeout(() => {
      $notification.removeClass('show');
      setTimeout(() => $notification.remove(), 300);
    }, 3000);
  }
}
/**
 * 5. ФУНКЦИЯ ДЛЯ ДОБАВЛЕНИЯ СКРЫТОГО ПРОМПТА
 */
function addHiddenPrompt(prompt) {
  setExtensionPrompt('auto-event', prompt, extension_prompt_types.IN_CHAT, 1, false, true, null, extension_prompt_roles.SYSTEM);
  console.log(`Скрытый промпт добавлен как extension_prompt в content system: ${prompt}`);
}
/**
 * 6. ФУНКЦИЯ ЗАПУСКА РАСШИРЕНИЯ
 */
jQuery(async () => {
  try {
    // 1. Инжектируем стили
    const styleElement = $('<style>').html(panelStyles);
    $('head').append(styleElement);
    // 2. Инжектируем HTML в тело страницы
    $('body').append(panelHtml);
    // 3. Переменные для режима рандома (теперь не используется, но оставляем логику выбора для кнопки)
    // 4. Удаляем слушатель на кнопку отправки, так как рандом теперь работает как другие кнопки
    // 5. Слушатель событий (кнопки событий)
    $('#auto-event-panel-fix').on('click', '.auto-event-button-fix', function() {
      const buttonId = $(this).attr('id');
      let prompt = '';
      if (buttonId === 'event-plot-twist') {
        prompt = plotTwistPrompts[Math.floor(Math.random() * plotTwistPrompts.length)];
      } else if (buttonId === 'event-chaos') {
        prompt = chaosPrompts[Math.floor(Math.random() * chaosPrompts.length)];
      } else if (buttonId === 'event-neutral') {
        prompt = neutralPrompt;
      } else if (buttonId === 'event-random') {
        // Логика случайного выбора промпта, как в бывшем автоматическом режиме
        const eventChance = Math.random();
        if (eventChance < 0.4) {
          // 40% — обычные повороты
          prompt = plotTwistPrompts[Math.floor(Math.random() * plotTwistPrompts.length)];
        } else if (eventChance < 0.6) {
          // 20% — хаос
          prompt = chaosPrompts[Math.floor(Math.random() * chaosPrompts.length)];
        } else {
          // 40% — гигантский рандом с {{random::}}
          prompt = randomStalePrompt;
        }
      }
      if (prompt) {
        addHiddenPrompt(prompt);
        const promptType = promptTypes[prompt] || 'Неизвестный поворот';
        showNotification(`Применился сюжетный поворот: ${promptType}`);
      } else {
        console.warn(`Кнопки Событий: Не найден промпт для кнопки с ID: ${buttonId}`);
      }
    });
    // 6. ЛОГИКА ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ
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
    // 7. ЛОГИКА ПЕРЕТАСКИВАНИЯ ДЛЯ ПАНЕЛИ
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
    console.log("Расширение 'Кнопки Авто-Событий' успешно настроено. Промпты добавляются как hidden extension prompts в content system.");
  } catch (error) {
    console.error("Критическая ошибка при загрузке 'Кнопок Авто-Событий':", error);
  }
});