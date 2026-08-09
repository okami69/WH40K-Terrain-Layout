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
    per: { objective: 'За цель', 'terrain-area': 'За зону ландшафта', unit: 'За подразделение' },
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
    per: { objective: 'Per objective', 'terrain-area': 'Per terrain area', unit: 'Per unit' },
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
  },
};

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
const terrainRulesImage = document.querySelector('#terrain-rules-image');
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

function fitSheet() {
  const bodyStyle = getComputedStyle(document.body);
  const sheetStyle = getComputedStyle(document.querySelector('#sheet'));
  const horizontalInsets = cssPixels(bodyStyle.paddingLeft) + cssPixels(bodyStyle.paddingRight);
  const verticalInsets = cssPixels(bodyStyle.paddingTop) + cssPixels(bodyStyle.paddingBottom);
  const availableWidth = document.documentElement.clientWidth - horizontalInsets;
  const availableHeight = document.documentElement.clientHeight - verticalInsets;
  const scale = Math.min(availableWidth / cssPixels(sheetStyle.width), availableHeight / cssPixels(sheetStyle.height));
  document.documentElement.style.setProperty('--sheet-scale', String(scale));
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
  return Array.isArray(twist.effects?.[language])
    && twist.effects[language].length > 0
    && twist.effects[language].every(effect => typeof effect === 'string' && effect.length > 0);
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
  delete twistDialog.dataset.cleared;
  renderTwistButton();
  renderTwistPanel();
}

function renderTwistChooser() {
  const copy = text[language];
  const note = createReferenceElement('p', 'twist-note', copy.twistOptional);
  const rows = twists.map(twist => {
    const row = document.createElement('section');
    row.className = 'twist-row';
    row.dataset.twist = twist.id;
    const available = hasTwistEffects(twist);
    const toggle = createTwistButton(twist.name[language], 'expand');
    toggle.className = 'twist-row-toggle';
    toggle.disabled = !available;
    toggle.setAttribute('aria-expanded', String(available && expandedTwist === twist.id));
    toggle.setAttribute('aria-current', String(selectedTwist?.id === twist.id));
    if (!available) toggle.title = copy.unavailable;
    toggle.addEventListener('click', () => {
      expandedTwist = expandedTwist === twist.id ? null : twist.id;
      renderTwistPanel();
    });
    row.append(toggle);

    if (available && expandedTwist === twist.id) {
      const panel = document.createElement('div');
      panel.className = 'twist-row-panel';
      const select = createTwistButton(copy.select, 'select');
      select.className = 'twist-select';
      select.addEventListener('click', () => selectTwist(twist));
      panel.append(createTwistEffects(twist), select);
      row.append(panel);
    }
    return row;
  });
  const children = [note];
  if (twistDialog.dataset.cleared === 'true') {
    children.push(createReferenceElement('p', 'twist-confirmation', copy.noTwistSelected));
  }
  twistDialogBody.replaceChildren(...children, ...rows);

  const random = createTwistButton(copy.random, 'random');
  random.addEventListener('click', () => selectTwist(pickRandomTwist()));
  const none = createTwistButton(copy.noTwist, 'none');
  none.addEventListener('click', () => {
    selectedTwist = null;
    expandedTwist = null;
    twistPanelView = 'chooser';
    twistDialog.dataset.cleared = 'true';
    renderTwistButton();
    renderTwistPanel();
  });
  twistDialogFooter.replaceChildren(random, none);
}

function renderTwistDetail() {
  const copy = text[language];
  const detail = document.createElement('section');
  detail.className = 'twist-detail';
  detail.append(createReferenceElement('h3', '', selectedTwist.name[language]));
  if (hasTwistEffects(selectedTwist)) detail.append(createTwistEffects(selectedTwist));
  else detail.append(createReferenceElement('p', 'twist-confirmation', copy.unavailable));
  twistDialogBody.replaceChildren(detail);

  const change = createTwistButton(copy.change, 'change');
  change.addEventListener('click', () => {
    twistPanelView = 'chooser';
    expandedTwist = null;
    renderTwistPanel();
  });
  const close = createTwistButton(copy.close, 'close');
  close.addEventListener('click', () => twistDialog.close());
  twistDialogFooter.replaceChildren(change, close);
}

function renderTwistPanel() {
  twistDialogTitle.textContent = text[language].twistTitle;
  twistDialogClose.textContent = text[language].close;
  if (twistPanelView === 'detail' && selectedTwist) renderTwistDetail();
  else renderTwistChooser();
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
    terrainRulesImage.alt = copy.mapDescription;
    document.querySelector('#terrain-rules-close').textContent = copy.close;
    keyTitle.textContent = copy.key;
    keyImage.alt = copy.keyAlt;
    document.querySelector('#layout-key-close').textContent = copy.close;
    document.querySelector('#close').textContent = copy.close;
    layoutGalleryTitle.textContent = copy.galleryTitle;
    document.querySelector('#layout-gallery-close').textContent = copy.close;
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
twistButton.addEventListener('click', openTwistDialog);
twistDialogClose.addEventListener('click', () => twistDialog.close());
twistDialog.addEventListener('close', () => twistButton.focus());
twistDialog.addEventListener('cancel', () => twistButton.focus());
mapButton.addEventListener('click', () => viewer.showModal());
document.querySelector('#close').addEventListener('click', () => viewer.close());
freeLayoutButton.addEventListener('click', openGallery);
document.querySelector('#layout-gallery-close').addEventListener('click', () => layoutGallery.close());
terrainRulesButton.addEventListener('click', () => terrainRulesViewer.showModal());
document.querySelector('#terrain-rules-close').addEventListener('click', () => terrainRulesViewer.close());
keyButton.addEventListener('click', () => keyViewer.showModal());
document.querySelector('#layout-key-close').addEventListener('click', () => keyViewer.close());
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
