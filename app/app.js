import { deployments, dispositions, labels, languages, layoutCatalog, missions, resolveMatchup } from './matchups.js';
import { missionReferences, pickRandomTwist, twists } from './rules.js';

const text = {
  ru: {
    title: 'Карта террейна',
    language: 'Язык',
    leftDisposition: 'Диспозиция левой армии',
    rightDisposition: 'Диспозиция правой армии',
    forceDisposition: 'Диспозиция армии',
    mission: 'Миссия',
    exactScoring: 'Физическая карта миссии или официальное приложение задает точный подсчет очков.',
    vp: value => `${value} ПО`,
    cumulative: 'Дополнительно',
    alternative: 'Альтернатива',
    per: { marker: 'За маркер', objective: 'За цель', 'terrain-area': 'За зону ландшафта', unit: 'За подразделение' },
    primaryLimit: limit => `${limit.text.ru}: ${limit.total} ПО всего; ${limit.perBattleRound} ПО за боевой раунд; подсчёт в конце боя не входит в лимит.`,
    layout: layout => `Расстановка ${layout}`,
    layoutGroup: 'Расстановка террейна',
    openMap: 'Открыть карту в полном размере',
    mapDescription: 'Официальная схема расстановки террейна. Контуры террейна, позиции целей и точные отступы напечатаны на изображении.',
    mapAlt: (leftLabel, rightLabel, layout) => `${leftLabel} против ${rightLabel}, расстановка террейна ${layout}`,
    fullSize: 'в полном размере',
    key: 'Ключ схем',
    openKey: 'Открыть ключ схем',
    close: 'Закрыть',
    keyAlt: 'Официальный ключ схем расстановки',
    loadError: 'Не удалось загрузить эту расстановку.',
    missingImage: layout => `Изображение расстановки ${layout} отсутствует. Выберите другую пару или расстановку.`,
    freeLayout: 'Свободная расстановка',
    chooseFreeLayout: 'Выбрать любую расстановку',
    galleryTitle: 'Все расстановки',
    layoutSource: (left, right, value) => `${left} / ${right} · Расстановка ${value}`,
    twistTitle: 'Особенность',
    twistOptional: 'Необязательно. Выберите одну, только если оба игрока хотят её использовать.',
    noTwist: 'Без особенности',
    noTwistSelected: 'Особенность не выбрана. Играйте стандартную миссию.',
    twistButtonEmpty: 'Необязательная особенность: ничего не выбрано',
    twistButtonSelected: name => `Необязательная особенность: ${name}`,
    select: 'Выбрать',
    random: 'Случайная',
    change: 'Изменить',
    unavailable: 'Описание недоступно',
    noTwistsAvailable: 'Нет доступных особенностей. Оставьте «Без особенности».',
  },
  en: {
    title: 'Terrain Layout',
    language: 'Language',
    leftDisposition: 'Left Force Disposition',
    rightDisposition: 'Right Force Disposition',
    forceDisposition: 'Force Disposition',
    mission: 'Mission',
    exactScoring: 'Use the physical mission card or official app for exact scoring.',
    vp: value => `${value} VP`,
    cumulative: 'Cumulative',
    alternative: 'Alternative',
    per: { marker: 'Per marker', objective: 'Per objective', 'terrain-area': 'Per terrain area', unit: 'Per unit' },
    primaryLimit: limit => `${limit.text.en}: ${limit.total} VP total; ${limit.perBattleRound} VP per battle round; end-of-battle scoring is exempt.`,
    layout: layout => `Layout ${layout}`,
    layoutGroup: 'Terrain layout',
    openMap: 'Open layout at full size',
    mapDescription: 'Official terrain placement diagram. Terrain footprints, objective positions and exact edge measurements are printed in the image.',
    mapAlt: (leftLabel, rightLabel, layout) => `${leftLabel} versus ${rightLabel}, terrain layout ${layout}`,
    fullSize: 'full size',
    key: 'Layouts Key',
    openKey: 'Open layouts key',
    close: 'Close',
    keyAlt: 'Official layouts key',
    loadError: 'Unable to load this terrain layout.',
    missingImage: layout => `Layout ${layout} image is missing. Choose another matchup or layout.`,
    freeLayout: 'Free layout',
    chooseFreeLayout: 'Choose any layout',
    galleryTitle: 'All layouts',
    layoutSource: (left, right, value) => `${left} / ${right} · Layout ${value}`,
    twistTitle: 'Twist',
    twistOptional: 'Optional. Select one only if both players want to use it.',
    noTwist: 'No Twist',
    noTwistSelected: 'No twist selected. Play the standard mission.',
    twistButtonEmpty: 'Optional Twist: no Twist selected',
    twistButtonSelected: name => `Optional Twist: ${name}`,
    select: 'Select',
    random: 'Random',
    change: 'Change',
    unavailable: 'Details unavailable',
    noTwistsAvailable: 'No Twists are available. Keep No Twist selected.',
  },
};

const terrainRulesCopy = {
  en: {
    intro: [
      "The following layouts are presented for Warhammer Event organisers and players to use in all of their games of Warhammer 40,000 using the most recent Chapter Approved Mission Deck. These are the layouts that are used at Games Workshop events and are designed for the best experience by the Warhammer Studio team, to reflect battlefields that create risk-and-reward decisions with each player's objectives in mind.",
      'Each combination of Primary Missions has three recommended layouts, labelled A, B and C. As directed by the Warhammer Event organiser, the players either use the layout specified or randomly determine which of these layouts to use.',
    ],
    footprintsHeading: 'Recommended Terrain Area Footprints',
    footprintsIntro: 'We have listed the terrain area footprints these recommended layouts use. You can find a PDF with these footprints ready for you to print on warhammer-community.com.',
    sizeHeading: 'Terrain area footprint size',
    quantityHeading: 'Quantity',
    polygon: 'Polygon',
    featuresHeading: 'Terrain Features',
    features: [
      "Each layout is shown with the terrain features from the Battlefields: Armageddon box using the 'Warhammer recommended' build configuration from the construction booklet. We've denoted each terrain feature from that set as either a dense or light terrain feature in these layouts. The configurations of the terrain features and terrain areas are designed to create the best experience with the Hidden rule and movement rules for various units, and to create plenty of interesting decisions during a battle. We've also purposely left space between a terrain feature and the edge of the terrain area to allow a line of models to be on the terrain area from the 'outside'.",
      'If you do not have the Battlefields: Armageddon terrain, it is possible to recreate these layouts with your own terrain that is close to the same size of the various terrain features by denoting for all players if they are dense or light terrain features.',
    ],
  },
  ru: {
    intro: [
      'Следующие схемы предназначены для организаторов мероприятий Warhammer и игроков и могут использоваться во всех играх Warhammer 40,000 с самой актуальной колодой миссий Chapter Approved. Эти схемы используются на мероприятиях Games Workshop и разработаны командой Warhammer Studio для наиболее интересной игры на полях боя, где игрокам приходится сопоставлять риск и награду с учётом своих целей.',
      'Для каждой комбинации основных миссий предусмотрены три рекомендуемые схемы: A, B и C. По указанию организатора мероприятия Warhammer игроки используют назначенную схему или определяют одну из этих схем случайным образом.',
    ],
    footprintsHeading: 'Рекомендуемые размеры зон террейна',
    footprintsIntro: 'Ниже перечислены размеры зон террейна, используемых в рекомендуемых схемах. На сайте warhammer-community.com можно найти готовый к печати PDF с этими контурами.',
    sizeHeading: 'Размер зоны террейна',
    quantityHeading: 'Количество',
    polygon: 'Многоугольник',
    featuresHeading: 'Элементы террейна',
    features: [
      'Каждая схема показана с элементами террейна из набора Battlefields: Armageddon в рекомендованной Warhammer конфигурации сборки из инструкции. Каждый элемент этого набора обозначен на схемах как плотный или лёгкий элемент террейна. Конфигурации элементов и зон террейна рассчитаны на наиболее интересную игру с учётом правила Hidden и правил перемещения различных подразделений и создают множество значимых решений во время боя. Между элементом террейна и краем зоны террейна намеренно оставлено место, чтобы ряд моделей мог размещаться в зоне террейна со стороны внешнего края.',
      'Если у вас нет террейна Battlefields: Armageddon, эти схемы можно воспроизвести с собственным террейном близкого размера. Перед игрой сообщите всем игрокам, какие элементы считаются плотными, а какие лёгкими.',
    ],
  },
};

const terrainFootprints = [
  ['6" x 4"', 4],
  ['10" x 2.5"', 2],
  ['6" x 2"', 4],
  ['7" x 11.5"', 4],
  ['8" x 11.5"', 2, 'polygon'],
];

const deploymentNames = {
  'crucible-of-battle': { ru: 'Горнило битвы', en: 'Crucible of Battle' },
  'dawn-of-war': { ru: 'Рассвет войны', en: 'Dawn of War' },
  'hammer-and-anvil': { ru: 'Молот и наковальня', en: 'Hammer and Anvil' },
  'search-and-destroy': { ru: 'Найти и уничтожить', en: 'Search and Destroy' },
  'sweeping-engagement': { ru: 'Охватывающее сражение', en: 'Sweeping Engagement' },
  'tipping-point': { ru: 'Переломный момент', en: 'Tipping Point' },
};

const left = document.querySelector('#left');
const right = document.querySelector('#right');
const leftDispositionButton = document.querySelector('#left-disposition-button');
const rightDispositionButton = document.querySelector('#right-disposition-button');
const dispositionMenu = document.querySelector('#disposition-menu');
const leftIcon = document.querySelector('#left-icon');
const rightIcon = document.querySelector('#right-icon');
const leftMission = document.querySelector('#left-mission');
const rightMission = document.querySelector('#right-mission');
const title = document.querySelector('#layout-title');
const terrainRulesButton = document.querySelector('#terrain-rules-button');
const viewerTitle = document.querySelector('#viewer-title');
const terrainRulesTitle = document.querySelector('#terrain-rules-title');
const terrainRulesContent = document.querySelector('#terrain-rules-content');
const keyTitle = document.querySelector('#layout-key-title');
const mapButton = document.querySelector('.map-button');
const map = document.querySelector('#map');
const largeMap = document.querySelector('#large-map');
const keyButton = document.querySelector('#layout-key-button');
const keyImage = document.querySelector('#layout-key-image');
const error = document.querySelector('#error');
const freeLayoutButton = document.querySelector('#free-layout-button');
const viewer = document.querySelector('#viewer');
const terrainRulesViewer = document.querySelector('#terrain-rules-viewer');
const keyViewer = document.querySelector('#layout-key-viewer');
const layoutGallery = document.querySelector('#layout-gallery');
const layoutGalleryTitle = document.querySelector('#layout-gallery-title');
const layoutGalleryScroll = document.querySelector('#layout-gallery-scroll');
const popover = document.querySelector('#mission-popover');
const twistButton = document.querySelector('#twist-button');
const twistButtonLabel = document.querySelector('#twist-button-label');
const twistDialog = document.querySelector('#twist-dialog');
const twistDialogTitle = document.querySelector('#twist-dialog-title');
const twistDialogBody = document.querySelector('#twist-dialog-body');
const twistDialogFooter = document.querySelector('#twist-dialog-footer');
const twistDialogClose = document.querySelector('#twist-dialog-close');
const terrainRulesClose = document.querySelector('#terrain-rules-close');
const layoutKeyClose = document.querySelector('#layout-key-close');
const viewerClose = document.querySelector('#close');
const layoutGalleryClose = document.querySelector('#layout-gallery-close');
const dialogCloseButtons = [twistDialogClose, terrainRulesClose, layoutKeyClose, viewerClose, layoutGalleryClose];
const layoutButtons = [...document.querySelectorAll('[data-layout]')];
const languageButtons = [...document.querySelectorAll('[data-lang]')];
const summaryTriggers = [leftMission, rightMission];
const dispositionTriggers = new Map([
  [leftDispositionButton, left],
  [rightDispositionButton, right],
]);
let layout = 'A';
let language = initialLanguage();
let pinnedSummary = null;
let mapMode = 'official';
let freeMap = null;
let activeDispositionTrigger = null;
let activeSummaryTrigger = null;
let selectedTwist = null;
let twistPanelView = 'chooser';
let expandedTwist = null;
const paperGeometry = Object.freeze({ width: 3570, height: 5052, cropLeft: 1354, cropTop: 2174 });

for (const select of [left, right]) {
  for (const disposition of dispositions) select.add(new Option('', disposition));
}

left.value = 'disruption';
right.value = 'priority-assets';

const dispositionMenuButtons = dispositions.map(disposition => {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.disposition = disposition;
  button.addEventListener('click', () => {
    const select = dispositionTriggers.get(activeDispositionTrigger);
    if (!select) return;
    select.value = disposition;
    select.dispatchEvent(new Event('change'));
    closeDispositionMenu(true);
  });
  return button;
});
dispositionMenu.append(...dispositionMenuButtons);

function initialLanguage() {
  const saved = localStorage.getItem('wh40k-language');
  if (languages.includes(saved)) return saved;
  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

function cssPixels(value) {
  return Number.parseFloat(value) || 0;
}

function positiveDimension(...values) {
  return values.find(value => Number.isFinite(value) && value > 0) ?? 1;
}

function fitSheet() {
  const bodyStyle = getComputedStyle(document.body);
  const horizontalInsets = cssPixels(bodyStyle.paddingLeft) + cssPixels(bodyStyle.paddingRight);
  const verticalInsets = cssPixels(bodyStyle.paddingTop) + cssPixels(bodyStyle.paddingBottom);
  const layoutWidth = positiveDimension(document.documentElement.clientWidth, window.innerWidth, 768);
  const layoutHeight = positiveDimension(document.documentElement.clientHeight, window.innerHeight, 1080);
  const visualViewport = window.visualViewport;
  const viewportScale = visualViewport?.scale ?? 1;
  const useVisualViewport = visualViewport
    && Number.isFinite(viewportScale)
    && Math.abs(viewportScale - 1) < 0.01
    && Number.isFinite(visualViewport.width) && visualViewport.width > 0
    && Number.isFinite(visualViewport.height) && visualViewport.height > 0;
  const viewportWidth = useVisualViewport ? visualViewport.width : layoutWidth;
  const viewportHeight = useVisualViewport ? visualViewport.height : layoutHeight;
  const availableWidth = positiveDimension(viewportWidth - horizontalInsets);
  const availableHeight = positiveDimension(viewportHeight - verticalInsets);
  const sheetWidth = 768;
  const portrait = layoutWidth <= 600 && layoutHeight > layoutWidth;
  const widthScale = availableWidth / sheetWidth;
  let sheetHeight = portrait ? 1280 : 1080;
  if (portrait && sheetHeight * widthScale < availableHeight) sheetHeight = availableHeight / widthScale;
  const scale = Math.min(widthScale, availableHeight / sheetHeight);
  document.documentElement.style.setProperty('--sheet-height', `${sheetHeight}px`);
  document.documentElement.style.setProperty('--sheet-scale', String(scale));
  document.documentElement.style.setProperty('--disposition-menu-font-size', `${scale}rem`);
}

function syncMapPaper() {
  if (!map.naturalWidth || !map.naturalHeight || !map.clientWidth || !map.clientHeight) return;
  const logicalScale = Math.min(map.clientWidth / map.naturalWidth, map.clientHeight / map.naturalHeight);
  const logicalLeft = (mapButton.clientWidth - map.naturalWidth * logicalScale) / 2;
  const logicalTop = (mapButton.clientHeight - map.naturalHeight * logicalScale) / 2;
  mapButton.style.setProperty('--map-paper-size', `${paperGeometry.width * logicalScale}px ${paperGeometry.height * logicalScale}px`);
  mapButton.style.setProperty('--map-paper-position', `${logicalLeft - paperGeometry.cropLeft * logicalScale}px ${logicalTop - paperGeometry.cropTop * logicalScale}px`);
  const rect = map.getBoundingClientRect();
  const viewportScale = Math.min(rect.width / map.naturalWidth, rect.height / map.naturalHeight);
  const viewportLeft = rect.left + (rect.width - map.naturalWidth * viewportScale) / 2;
  const viewportTop = rect.top + (rect.height - map.naturalHeight * viewportScale) / 2;
  document.documentElement.style.setProperty('--paper-size', `${paperGeometry.width * viewportScale}px ${paperGeometry.height * viewportScale}px`);
  document.documentElement.style.setProperty('--paper-position', `${viewportLeft - paperGeometry.cropLeft * viewportScale}px ${viewportTop - paperGeometry.cropTop * viewportScale}px`);
}

function showError(message) {
  error.textContent = message;
  error.hidden = false;
  mapButton.hidden = true;
}

function setDialogBackdropClose(dialog) {
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
}

function setPopoverVisible(visible) {
  popover.hidden = !visible;
  if ('showPopover' in popover) {
    if (visible && !popover.matches(':popover-open')) popover.showPopover();
    if (!visible && popover.matches(':popover-open')) popover.hidePopover();
  }
}

function closeSummary(restoreFocus = false) {
  const trigger = pinnedSummary;
  if (restoreFocus) trigger?.focus();
  pinnedSummary = null;
  activeSummaryTrigger = null;
  setPopoverVisible(false);
  for (const trigger of summaryTriggers) trigger.setAttribute('aria-expanded', 'false');
}

function setDispositionMenuVisible(visible) {
  if (visible) {
    dispositionMenu.hidden = false;
    if (typeof dispositionMenu.showPopover === 'function') dispositionMenu.showPopover();
    return;
  }
  if (typeof dispositionMenu.hidePopover === 'function'
      && typeof dispositionMenu.matches === 'function'
      && dispositionMenu.matches(':popover-open')) dispositionMenu.hidePopover();
  dispositionMenu.hidden = true;
}

function closeDispositionMenu(restoreFocus = false) {
  const trigger = activeDispositionTrigger;
  if (!trigger) return;
  setDispositionMenuVisible(false);
  trigger.setAttribute('aria-expanded', 'false');
  activeDispositionTrigger = null;
  if (restoreFocus) trigger.focus();
}

function openDispositionMenu(trigger) {
  if (activeDispositionTrigger) closeDispositionMenu();
  activeDispositionTrigger = trigger;
  const select = dispositionTriggers.get(trigger);
  const rect = trigger.getBoundingClientRect();
  let currentButton;
  for (const button of dispositionMenuButtons) {
    const current = button.dataset.disposition === select.value;
    button.setAttribute('aria-current', String(current));
    if (current) currentButton = button;
  }
  trigger.setAttribute('aria-expanded', 'true');
  dispositionMenu.style.width = `${rect.width}px`;
  setDispositionMenuVisible(true);
  const width = dispositionMenu.offsetWidth || rect.width;
  const height = dispositionMenu.offsetHeight || dispositionMenuButtons.length * 44 + 8;
  dispositionMenu.style.left = `${Math.max(12, Math.min(rect.left, document.documentElement.clientWidth - width - 12))}px`;
  dispositionMenu.style.top = `${Math.max(12, Math.min(rect.bottom + 8, document.documentElement.clientHeight - height - 12))}px`;
  currentButton.focus();
}

function createReferenceElement(tag, className, content) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = content;
  return element;
}

function createTwistButton(label, action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.dataset.action = action;
  return button;
}

function hasTwistEffects(twist) {
  return ['ru', 'en'].every(locale => Array.isArray(twist.effects?.[locale])
    && twist.effects[locale].length > 0
    && twist.effects[locale].every(effect => typeof effect === 'string' && effect.length > 0));
}

function createTwistEffects(twist) {
  const list = document.createElement('ul');
  list.className = 'twist-effects';
  for (const effect of twist.effects[language]) list.append(createReferenceElement('li', '', effect));
  return list;
}

function selectTwist(twist) {
  selectedTwist = twist;
  expandedTwist = twist.id;
  twistPanelView = 'detail';
  delete twistDialog.dataset.notice;
  renderTwistButton();
  renderTwistPanel({ focusDetail: true });
}

function renderTwistChooser({ focusTwist = null, focusConfirmation = false } = {}) {
  const copy = text[language];
  const note = createReferenceElement('p', 'twist-note', copy.twistOptional);
  note.id = 'twist-chooser-note';
  note.tabIndex = -1;
  let focusedHeader = null;
  const rows = twists.map(twist => {
    const row = document.createElement('section');
    row.className = 'twist-row';
    row.dataset.twist = twist.id;
    const available = hasTwistEffects(twist);
    const toggle = createTwistButton(twist.name[language], 'expand');
    toggle.className = 'twist-row-toggle';
    toggle.id = `twist-header-${twist.id}`;
    toggle.disabled = !available;
    toggle.setAttribute('aria-expanded', String(available && expandedTwist === twist.id));
    toggle.setAttribute('aria-current', String(selectedTwist?.id === twist.id));
    toggle.setAttribute('aria-controls', `twist-panel-${twist.id}`);
    if (focusTwist === twist.id && available) focusedHeader = toggle;
    if (!available) toggle.title = copy.unavailable;
    toggle.addEventListener('click', () => {
      expandedTwist = expandedTwist === twist.id ? null : twist.id;
      renderTwistPanel({ focusTwist: twist.id });
    });
    const panel = document.createElement('div');
    panel.className = 'twist-row-panel';
    panel.id = `twist-panel-${twist.id}`;
    panel.hidden = !available || expandedTwist !== twist.id;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', toggle.id);
    if (!panel.hidden) {
      const select = createTwistButton(copy.select, 'select');
      select.className = 'twist-select';
      select.addEventListener('click', () => selectTwist(twist));
      panel.append(createTwistEffects(twist), select);
    }
    row.append(toggle, panel);
    return row;
  });
  const children = [note];
  let confirmation = null;
  if (twistDialog.dataset.notice) {
    const message = twistDialog.dataset.notice === 'unavailable' ? copy.noTwistsAvailable : copy.noTwistSelected;
    confirmation = createReferenceElement('p', 'twist-confirmation', message);
    confirmation.tabIndex = -1;
    children.push(confirmation);
  }
  twistDialogBody.replaceChildren(...children, ...rows);
  if (focusConfirmation) confirmation?.focus();
  else if (focusTwist) (focusedHeader ?? note).focus();

  const random = createTwistButton(copy.random, 'random');
  random.addEventListener('click', () => {
    const selectableTwists = twists.filter(hasTwistEffects);
    if (!selectableTwists.length) {
      twistDialog.dataset.notice = 'unavailable';
      renderTwistPanel({ focusConfirmation: true });
      return;
    }
    selectTwist(pickRandomTwist(Math.random, selectableTwists));
  });
  const none = createTwistButton(copy.noTwist, 'none');
  none.addEventListener('click', () => {
    selectedTwist = null;
    expandedTwist = null;
    twistPanelView = 'chooser';
    twistDialog.dataset.notice = 'none';
    renderTwistButton();
    renderTwistPanel({ focusConfirmation: true });
  });
  twistDialogFooter.replaceChildren(random, none);
}

function renderTwistDetail(focusDetail = false) {
  const copy = text[language];
  const detail = document.createElement('section');
  detail.className = 'twist-detail';
  const heading = createReferenceElement('h3', 'twist-detail-title', selectedTwist.name[language]);
  heading.tabIndex = -1;
  detail.append(heading);
  if (hasTwistEffects(selectedTwist)) detail.append(createTwistEffects(selectedTwist));
  else detail.append(createReferenceElement('p', 'twist-confirmation', copy.unavailable));
  twistDialogBody.replaceChildren(detail);
  if (focusDetail) heading.focus();

  const change = createTwistButton(copy.change, 'change');
  change.addEventListener('click', () => {
    twistPanelView = 'chooser';
    expandedTwist = null;
    renderTwistPanel({ focusTwist: selectedTwist.id });
  });
  twistDialogFooter.replaceChildren(change);
}

function renderTerrainRules() {
  const scrollTop = terrainRulesContent.scrollTop;
  const copy = terrainRulesCopy[language];
  const intro = copy.intro.map(paragraph => createReferenceElement('p', 'terrain-rules-paragraph', paragraph));
  const footprintsHeading = createReferenceElement('h3', 'terrain-rules-heading', copy.footprintsHeading);
  const footprintsIntro = createReferenceElement('p', 'terrain-rules-paragraph', copy.footprintsIntro);
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const tbody = document.createElement('tbody');
  table.className = 'terrain-footprints';
  for (const heading of [copy.sizeHeading, copy.quantityHeading]) {
    const cell = createReferenceElement('th', '', heading);
    cell.setAttribute('scope', 'col');
    headerRow.append(cell);
  }
  thead.append(headerRow);
  for (const [size, quantity, shape] of terrainFootprints) {
    const row = document.createElement('tr');
    row.append(
      createReferenceElement('td', '', shape === 'polygon' ? `${size} ${copy.polygon}` : size),
      createReferenceElement('td', '', quantity),
    );
    tbody.append(row);
  }
  table.append(thead, tbody);
  const featuresHeading = createReferenceElement('h3', 'terrain-rules-heading', copy.featuresHeading);
  const features = copy.features.map(paragraph => createReferenceElement('p', 'terrain-rules-paragraph', paragraph));
  terrainRulesContent.replaceChildren(...intro, footprintsHeading, footprintsIntro, table, featuresHeading, ...features);
  terrainRulesContent.scrollTop = scrollTop;
}

function renderTwistPanel(focus = {}) {
  twistDialogTitle.textContent = text[language].twistTitle;
  if (twistPanelView === 'detail' && selectedTwist) renderTwistDetail(focus.focusDetail);
  else renderTwistChooser(focus);
}

function renderTwistButton() {
  const copy = text[language];
  const name = selectedTwist?.name[language] ?? copy.noTwist;
  twistButtonLabel.textContent = name;
  twistButton.title = name;
  twistButton.setAttribute('aria-label', selectedTwist ? copy.twistButtonSelected(name) : copy.twistButtonEmpty);
  twistButton.setAttribute('aria-pressed', String(Boolean(selectedTwist)));
}

function openTwistDialog() {
  twistPanelView = selectedTwist ? 'detail' : 'chooser';
  renderTwistPanel();
  if (!twistDialog.open) twistDialog.showModal();
}

function renderMissionReference(missionId) {
  const reference = missionReferences[missionId];
  const copy = text[language];
  const title = createReferenceElement('h3', 'mission-reference-title', `${copy.mission}: ${missions[missionId].name[language]}`);
  title.id = 'mission-popover-title';
  const overview = createReferenceElement('p', 'mission-reference-overview', reference.overview[language]);
  const sections = reference.sections.map(item => {
    const section = createReferenceElement('section', 'mission-reference-section', '');
    const heading = createReferenceElement('h4', 'mission-reference-heading', item.heading[language]);
    const timing = createReferenceElement('p', 'mission-reference-timing', item.timing[language]);
    const conditions = document.createElement('ul');
    conditions.className = 'mission-reference-conditions';

    for (const condition of item.conditions) {
      const row = document.createElement('li');
      const conditionText = createReferenceElement('span', 'mission-reference-condition-text', condition.text[language]);
      const badges = document.createElement('span');
      badges.className = 'mission-reference-badges';
      if (condition.vp !== null) badges.append(createReferenceElement('span', 'mission-reference-vp', copy.vp(condition.vp)));
      if (condition.cumulative) badges.append(createReferenceElement('span', 'mission-reference-tag', copy.cumulative));
      if (condition.per) badges.append(createReferenceElement('span', 'mission-reference-tag', copy.per[condition.per]));
      if (condition.alternative) badges.append(createReferenceElement('span', 'mission-reference-tag', copy.alternative));
      row.append(conditionText, badges);
      conditions.append(row);
    }

    section.append(heading, timing);
    if (item.limit) section.append(createReferenceElement('p', 'mission-reference-limit', copy.primaryLimit(item.limit)));
    section.append(conditions);
    return section;
  });
  const reminder = createReferenceElement('p', 'mission-reference-reminder', copy.exactScoring);
  popover.replaceChildren(title, overview, ...sections, reminder);
}

function positionSummary(trigger = activeSummaryTrigger) {
  if (!trigger) return;
  const rect = trigger.getBoundingClientRect();
  const cardRect = trigger.closest('.selector-card').getBoundingClientRect();
  const viewportWidth = window.visualViewport?.width || window.innerWidth || document.documentElement.clientWidth;
  const viewportHeight = window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight;
  const viewportLeft = window.visualViewport?.offsetLeft || 0;
  const viewportTop = window.visualViewport?.offsetTop || 0;
  const width = Math.max(0, Math.min(500, viewportWidth - 24));
  const anchor = trigger === rightMission ? 'right' : 'left';
  const targetLeft = anchor === 'right' ? cardRect.right - width : cardRect.left;
  const left = Math.max(viewportLeft + 12, Math.min(targetLeft, viewportLeft + viewportWidth - width - 12));
  const top = Math.max(viewportTop + 12, Math.min(rect.bottom + 8, viewportTop + viewportHeight - 12));
  popover.dataset.anchor = anchor;
  popover.style.setProperty('--mission-popover-width', '500px');
  popover.style.width = `${width}px`;
  popover.style.left = `${left}px`;
  popover.style.top = `${top}px`;
  popover.style.maxHeight = `${Math.max(0, Math.min(viewportHeight * 0.65, viewportTop + viewportHeight - top - 12))}px`;
}

function openSummary(trigger, pin = false) {
  if (pinnedSummary && !pin) return;
  const mission = trigger.dataset.mission;
  if (!mission) return;

  renderMissionReference(mission);
  activeSummaryTrigger = trigger;
  if (pin) pinnedSummary = trigger;
  positionSummary(trigger);
  setPopoverVisible(true);
  for (const item of summaryTriggers) item.setAttribute('aria-expanded', String(item === trigger));
  if (pin) popover.focus({ preventScroll: true });
}

function withinSummary(target, trigger = activeSummaryTrigger) {
  return Boolean(target && (trigger?.contains(target) || popover.contains(target)));
}

function canReceiveFocus(target) {
  for (let element = target; element; element = element.parentElement) {
    if (element.tabIndex >= 0 && !element.disabled) return true;
  }
  return false;
}

function sourceText(item) {
  return text[language].layoutSource(labels[item.left][language], labels[item.right][language], item.layout);
}

function renderGallery() {
  layoutGalleryScroll.replaceChildren(...deployments.map(deployment => {
    const section = document.createElement('section');
    const heading = document.createElement('h3');
    const grid = document.createElement('div');
    heading.textContent = deploymentNames[deployment][language];
    grid.className = 'layout-gallery-grid';

    for (const item of layoutCatalog.filter(entry => entry.deployment === deployment)) {
      const button = document.createElement('button');
      const image = document.createElement('img');
      const label = document.createElement('span');
      const failure = document.createElement('span');
      button.className = 'layout-gallery-card';
      button.type = 'button';
      button.dataset.layoutId = item.id;
      button.setAttribute('aria-pressed', String(freeMap?.id === item.id));
      image.src = item.image;
      image.alt = sourceText(item);
      image.loading = 'lazy';
      image.decoding = 'async';
      label.textContent = sourceText(item);
      failure.className = 'gallery-error';
      failure.textContent = text[language].missingImage(item.layout);
      failure.hidden = true;
      image.addEventListener('error', () => {
        image.hidden = true;
        failure.hidden = false;
        button.disabled = true;
      });
      button.addEventListener('click', () => {
        freeMap = item;
        mapMode = 'free';
        layoutGallery.close();
        render();
      });
      button.append(image, label, failure);
      grid.append(button);
    }

    section.append(heading, grid);
    return section;
  }));
}

function openGallery() {
  renderGallery();
  layoutGallery.showModal();
  layoutGalleryScroll.querySelector('[aria-pressed="true"]')?.scrollIntoView({ block: 'nearest' });
}

function render() {
  try {
    const copy = text[language];
    const matchup = resolveMatchup(left.value, right.value);
    const item = mapMode === 'free' ? freeMap : null;
    const image = item?.image ?? matchup.image(layout);
    const leftLabel = labels[left.value][language];
    const rightLabel = labels[right.value][language];
    const alt = item ? sourceText(item) : copy.mapAlt(leftLabel, rightLabel, layout);

    document.documentElement.lang = language;
    terrainRulesButton.textContent = copy.title;
    terrainRulesButton.setAttribute('aria-label', copy.title);
    document.querySelector('#language-toggle').setAttribute('aria-label', copy.language);
    document.querySelector('.layouts').setAttribute('aria-label', copy.layoutGroup);
    document.querySelectorAll('.card-kicker').forEach(item => { item.textContent = copy.forceDisposition; });
    document.querySelectorAll('.mission-label').forEach(item => { item.textContent = copy.mission; });
    document.querySelector('#map-description').textContent = copy.mapDescription;
    left.setAttribute('aria-label', copy.leftDisposition);
    right.setAttribute('aria-label', copy.rightDisposition);
    leftDispositionButton.setAttribute('aria-label', copy.leftDisposition);
    rightDispositionButton.setAttribute('aria-label', copy.rightDisposition);
    keyButton.setAttribute('aria-label', copy.openKey);
    keyButton.title = copy.openKey;
    mapButton.setAttribute('aria-label', copy.openMap);
    freeLayoutButton.setAttribute('aria-label', copy.chooseFreeLayout);
    freeLayoutButton.setAttribute('aria-pressed', String(Boolean(item)));
    terrainRulesTitle.textContent = copy.title;
    renderTerrainRules();
    keyTitle.textContent = copy.key;
    keyImage.alt = copy.keyAlt;
    layoutGalleryTitle.textContent = copy.galleryTitle;
    for (const button of dialogCloseButtons) {
      button.setAttribute('aria-label', copy.close);
      button.setAttribute('title', copy.close);
    }
    renderTwistButton();
    if (twistDialog.open) renderTwistPanel();

    for (const select of [left, right]) {
      for (const option of select.options) option.textContent = labels[option.value][language];
    }
    for (const button of languageButtons) button.setAttribute('aria-pressed', String(button.dataset.lang === language));

    error.hidden = true;
    mapButton.hidden = false;
    leftIcon.src = labels[left.value].icon;
    leftIcon.alt = leftLabel;
    leftDispositionButton.textContent = leftLabel;
    rightIcon.src = labels[right.value].icon;
    rightIcon.alt = rightLabel;
    rightDispositionButton.textContent = rightLabel;
    for (const button of dispositionMenuButtons) {
      button.textContent = labels[button.dataset.disposition][language];
      if (activeDispositionTrigger) {
        const select = dispositionTriggers.get(activeDispositionTrigger);
        button.setAttribute('aria-current', String(button.dataset.disposition === select.value));
      }
    }
    leftMission.textContent = missions[matchup.leftMission].name[language];
    leftMission.dataset.mission = matchup.leftMission;
    leftMission.setAttribute('aria-label', `${copy.mission}: ${missions[matchup.leftMission].name[language]}`);
    rightMission.textContent = missions[matchup.rightMission].name[language];
    rightMission.dataset.mission = matchup.rightMission;
    rightMission.setAttribute('aria-label', `${copy.mission}: ${missions[matchup.rightMission].name[language]}`);
    title.textContent = item ? copy.freeLayout : copy.layout(layout);
    viewerTitle.textContent = item ? `${copy.freeLayout}: ${sourceText(item)}` : copy.layout(layout);
    map.src = image;
    map.alt = alt;
    largeMap.src = image;
    largeMap.alt = `${alt}, ${copy.fullSize}`;

    for (const button of layoutButtons) button.setAttribute('aria-pressed', String(!item && button.dataset.layout === layout));
    if (pinnedSummary) openSummary(pinnedSummary, true);
  } catch (cause) {
    showError(cause instanceof Error ? cause.message : text[language].loadError);
  }
}

left.addEventListener('change', () => {
  closeSummary();
  render();
});
right.addEventListener('change', () => {
  closeSummary();
  render();
});

for (const trigger of dispositionTriggers.keys()) {
  trigger.addEventListener('click', () => openDispositionMenu(trigger));
}

for (const button of layoutButtons) {
  button.addEventListener('click', () => {
    mapMode = 'official';
    layout = button.dataset.layout;
    render();
  });
}

for (const button of languageButtons) {
  button.addEventListener('click', () => {
    language = button.dataset.lang;
    localStorage.setItem('wh40k-language', language);
    render();
  });
}

for (const trigger of summaryTriggers) {
  trigger.addEventListener('pointerenter', () => openSummary(trigger));
  trigger.addEventListener('focus', () => openSummary(trigger));
  trigger.addEventListener('pointerleave', event => {
    if (!pinnedSummary && !withinSummary(event.relatedTarget, trigger)) closeSummary();
  });
  trigger.addEventListener('focusout', event => {
    if (!pinnedSummary && !withinSummary(event.relatedTarget, trigger)) closeSummary();
  });
  trigger.addEventListener('click', () => {
    if (pinnedSummary === trigger) closeSummary();
    else openSummary(trigger, true);
  });
}

popover.addEventListener('pointerleave', event => {
  if (!pinnedSummary && !withinSummary(event.relatedTarget)) closeSummary();
});
popover.addEventListener('focusout', event => {
  if (!pinnedSummary && !withinSummary(event.relatedTarget)) closeSummary();
});

map.addEventListener('error', () => showError(text[language].missingImage(mapMode === 'free' ? freeMap?.layout ?? layout : layout)));
map.addEventListener('load', syncMapPaper);
twistButton.addEventListener('click', openTwistDialog);
twistDialogClose.addEventListener('click', () => twistDialog.close());
twistDialog.addEventListener('close', () => twistButton.focus());
twistDialog.addEventListener('cancel', () => twistButton.focus());
mapButton.addEventListener('click', () => viewer.showModal());
viewerClose.addEventListener('click', () => viewer.close());
freeLayoutButton.addEventListener('click', openGallery);
layoutGalleryClose.addEventListener('click', () => layoutGallery.close());
terrainRulesButton.addEventListener('click', () => terrainRulesViewer.showModal());
terrainRulesClose.addEventListener('click', () => terrainRulesViewer.close());
keyButton.addEventListener('click', () => keyViewer.showModal());
layoutKeyClose.addEventListener('click', () => keyViewer.close());
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeDispositionMenu(true);
    closeSummary(true);
  }
});
document.addEventListener('pointerdown', event => {
  if (activeDispositionTrigger
      && !activeDispositionTrigger.contains(event.target)
      && !dispositionMenu.contains(event.target)) closeDispositionMenu();
  if (activeSummaryTrigger && !withinSummary(event.target)) {
    const restoreFocus = Boolean(pinnedSummary && popover.contains(document.activeElement) && !canReceiveFocus(event.target));
    closeSummary(restoreFocus);
  }
});
function handleViewportResize() {
  fitSheet();
  syncMapPaper();
  positionSummary();
}

window.addEventListener('resize', handleViewportResize);
window.addEventListener('orientationchange', handleViewportResize);
window.visualViewport?.addEventListener('resize', handleViewportResize);
setDialogBackdropClose(viewer);
setDialogBackdropClose(terrainRulesViewer);
setDialogBackdropClose(keyViewer);
setDialogBackdropClose(layoutGallery);
setDialogBackdropClose(twistDialog);

fitSheet();
render();
syncMapPaper();
