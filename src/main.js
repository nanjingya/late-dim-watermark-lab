import { JoinEngine } from './joinEngine.js';
import { bindControls } from './ui/controls.js';
const engine = new JoinEngine(5);
const els = {
  status: document.querySelector('#status'),
  out: document.querySelector('#out'),
  stats: document.querySelector('#stats'),
  lateness: document.querySelector('#lateness'),
  btnLoad: document.querySelector('#btn-load'),
  btnRun: document.querySelector('#btn-run'),
  btnExport: document.querySelector('#btn-export'),
};
bindControls({ engine, els });
els.status.textContent = 'ready';
