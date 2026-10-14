import { createScenario } from './scenario/scenario';
import { playwrightScenes } from '../playwright-tests/scenarios';

if (import.meta.env.DEV) {
  const queryString = location.search;
  const params = new URLSearchParams(queryString);
  const scenario = params.get('scenario');
  console.log('scenario is: ', scenario);
  console.log(scenario === null);

  if (scenario === 'default' || scenario === null) {
    createScenario();
  } else if (Object.hasOwn(playwrightScenes, scenario)) {
    playwrightScenes[scenario]();
  }
  const body = document.getElementsByTagName('body')[0];
  const div = document.createElement('div');
  const link = document.createElement('a');
  link.setAttribute('href', '?scenario=default');
  link.textContent = 'default';
  body.appendChild(div);
  div.appendChild(link);

  for (const item in playwrightScenes) {
    const body = document.getElementsByTagName('body')[0];
    const div = document.createElement('div');
    const link = document.createElement('a');
    link.setAttribute('href', `?scenario=${item}`);
    link.textContent = item;
    body.appendChild(div);
    div.appendChild(link);
  }
} else {
  createScenario();
}
