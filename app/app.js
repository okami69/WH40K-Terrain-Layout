import { deployments, dispositions, labels, languages, layoutCatalog, missions, resolveMatchup } from './matchups.js';

const text = {
  ru: {
    title: 'Карта террейна',
    language: 'Язык',
    leftDisposition: 'Диспозиция левой армии',
    rightDisposition: 'Диспозиция правой армии',
    forceDisposition: 'Диспозиция армии',
    mission: 'Миссия',
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
  },
  en: {
    title: 'Terrain Layout',
    language: 'Language',
    leftDisposition: 'Left Force Disposition',
    rightDisposition: 'Right Force Disposition',
    forceDisposition: 'Force Disposition',
    mission: 'Mission',
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
const layoutSource = document.querySelector('#layout-source');
const viewer = document.querySelector('#viewer');
const terrainRulesViewer = document.querySelector('#terrain-rules-viewer');
const keyViewer = document.querySelector('#layout-key-viewer');
const layoutGallery = document.querySelector('#layout-gallery');
const layoutGalleryTitle = document.querySelector('#layout-gallery-title');
const layoutGalleryScroll = document.querySelector('#layout-gallery-scroll');
const popover = document.querySelector('#mission-popover');
const layoutButtons = [...document.querySelectorAll('[data-layout]')];
const languageButtons = [...document.querySelectorAll('[data-lang]')];
const summaryTriggers = [leftMission, rightMission];
let layout = 'A';
let language = initialLanguage();
let pinnedSummary = null;
let mapMode = 'official';
let freeMap = null;

for (const select of [left, right]) {
  for (const disposition of dispositions) select.add(new Option('', disposition));
}

left.value = 'disruption';
right.value = 'priority-assets';

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
  const horizontalInsets = cssPixels(bodyStyle.paddingLeft) + cssPixels(bodyStyle.paddingRight);
  const verticalInsets = cssPixels(bodyStyle.paddingTop) + cssPixels(bodyStyle.paddingBottom);
  const availableWidth = document.documentElement.clientWidth - horizontalInsets;
  const availableHeight = document.documentElement.clientHeight - verticalInsets;
  const scale = Math.min(availableWidth / 768, availableHeight / 1080);
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

function closeSummary() {
  pinnedSummary = null;
  setPopoverVisible(false);
  for (const trigger of summaryTriggers) trigger.setAttribute('aria-expanded', 'false');
}

function openSummary(trigger, pin = false) {
  const mission = trigger.dataset.mission;
  if (!mission) return;

  const rect = trigger.getBoundingClientRect();
  popover.textContent = missions[mission].summary[language];
  popover.style.width = `${rect.width}px`;
  popover.style.left = `${rect.left}px`;
  popover.style.top = `${rect.bottom + 8}px`;
  setPopoverVisible(true);
  for (const item of summaryTriggers) item.setAttribute('aria-expanded', String(item === trigger));
  pinnedSummary = pin ? trigger : pinnedSummary;
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

    for (const select of [left, right]) {
      for (const option of select.options) option.textContent = labels[option.value][language];
    }
    for (const button of languageButtons) button.setAttribute('aria-pressed', String(button.dataset.lang === language));

    error.hidden = true;
    mapButton.hidden = false;
    leftIcon.src = labels[left.value].icon;
    leftIcon.alt = leftLabel;
    rightIcon.src = labels[right.value].icon;
    rightIcon.alt = rightLabel;
    leftMission.textContent = missions[matchup.leftMission].name[language];
    leftMission.dataset.mission = matchup.leftMission;
    leftMission.setAttribute('aria-label', `${copy.mission}: ${missions[matchup.leftMission].name[language]}`);
    rightMission.textContent = missions[matchup.rightMission].name[language];
    rightMission.dataset.mission = matchup.rightMission;
    rightMission.setAttribute('aria-label', `${copy.mission}: ${missions[matchup.rightMission].name[language]}`);
    title.textContent = item ? copy.freeLayout : copy.layout(layout);
    layoutSource.textContent = item ? sourceText(item) : '';
    layoutSource.hidden = !item;
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
  trigger.addEventListener('pointerleave', () => {
    if (pinnedSummary !== trigger) closeSummary();
  });
  trigger.addEventListener('blur', () => {
    if (pinnedSummary !== trigger) closeSummary();
  });
  trigger.addEventListener('click', () => {
    if (pinnedSummary === trigger) closeSummary();
    else openSummary(trigger, true);
  });
}

map.addEventListener('error', () => showError(text[language].missingImage(mapMode === 'free' ? freeMap?.layout ?? layout : layout)));
mapButton.addEventListener('click', () => viewer.showModal());
document.querySelector('#close').addEventListener('click', () => viewer.close());
freeLayoutButton.addEventListener('click', openGallery);
document.querySelector('#layout-gallery-close').addEventListener('click', () => layoutGallery.close());
terrainRulesButton.addEventListener('click', () => terrainRulesViewer.showModal());
document.querySelector('#terrain-rules-close').addEventListener('click', () => terrainRulesViewer.close());
keyButton.addEventListener('click', () => keyViewer.showModal());
document.querySelector('#layout-key-close').addEventListener('click', () => keyViewer.close());
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeSummary();
});
window.addEventListener('resize', fitSheet);
window.visualViewport?.addEventListener('resize', fitSheet);
setDialogBackdropClose(viewer);
setDialogBackdropClose(terrainRulesViewer);
setDialogBackdropClose(keyViewer);
setDialogBackdropClose(layoutGallery);

fitSheet();
render();
