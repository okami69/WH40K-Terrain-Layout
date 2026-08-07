import { dispositions, labels, resolveMatchup } from './matchups.js';

const left = document.querySelector('#left');
const right = document.querySelector('#right');
const leftMission = document.querySelector('#left-mission');
const rightMission = document.querySelector('#right-mission');
const title = document.querySelector('#layout-title');
const viewerTitle = document.querySelector('#viewer-title');
const mapButton = document.querySelector('.map-button');
const map = document.querySelector('#map');
const largeMap = document.querySelector('#large-map');
const error = document.querySelector('#error');
const viewer = document.querySelector('#viewer');
const layoutButtons = [...document.querySelectorAll('[data-layout]')];
let layout = 'A';

for (const select of [left, right]) {
  for (const disposition of dispositions) {
    select.add(new Option(labels[disposition], disposition));
  }
}

left.value = 'disruption';
right.value = 'priority-assets';

function showError(message) {
  error.textContent = message;
  error.hidden = false;
  mapButton.hidden = true;
}

function render() {
  try {
    const matchup = resolveMatchup(left.value, right.value);
    const image = matchup.image(layout);
    const alt = `${labels[left.value]} versus ${labels[right.value]}, terrain layout ${layout}`;

    error.hidden = true;
    mapButton.hidden = false;
    leftMission.textContent = matchup.leftMission;
    rightMission.textContent = matchup.rightMission;
    title.textContent = `Layout ${layout}`;
    viewerTitle.textContent = `Layout ${layout}`;
    map.src = image;
    map.alt = alt;
    largeMap.src = image;
    largeMap.alt = `${alt}, full size`;

    for (const button of layoutButtons) {
      button.toggleAttribute('aria-pressed', button.dataset.layout === layout);
    }
  } catch (cause) {
    showError(cause instanceof Error ? cause.message : 'Unable to load this terrain layout.');
  }
}

left.addEventListener('change', render);
right.addEventListener('change', render);

for (const button of layoutButtons) {
  button.addEventListener('click', () => {
    layout = button.dataset.layout;
    render();
  });
}

map.addEventListener('error', () => {
  showError(`Layout ${layout} image is missing. Choose another matchup or layout.`);
});

mapButton.addEventListener('click', () => viewer.showModal());
document.querySelector('#close').addEventListener('click', () => viewer.close());

render();
