/* eslint-env browser */
class Random {
  static int(min, max) {
    return Math.floor(Math.random() * (max - min + 1));
  }
}

class CellularAutomata {
  constructor(size) {
    this.target = document.getElementById('target');
    this.settings = document.getElementById('settings');
    this.size = size;
    this.hue = Random.int(0, 360);
    this.seed = this.randomSeed;
    this.rule = this.randomRule;
    this.inputs = Array.from(this.settings.querySelectorAll('input'));

    this.setupInputs();

    this.addEventListeners();
    this.render();
  }

  setupInputs() {
    this.rule.forEach(id => {
      const input = this.settings.querySelector(`#rule${id}`);
      input.checked = !input.checked;
    });
  }

  get active() {
    return 'hsla(' + this.hue + ', 80%, 50%, .8)';
  }
  get inactive() {
    return 'hsla(' + (this.hue + 180) + ', 80%, 50%, .8)';
  }

  addEventListeners() {
    this.inputs.forEach(el => el.addEventListener('change', this.update.bind(this)));
  }

  update(evt) {
    const target = evt.target;
    const id = target.id.slice(-1) | 0;
    if (target.checked) {
      this.rule.push(id);
    } else {
      this.rule = this.rule.filter(r => r !== id);
    }
    this.render();
  }

  render() {
    this.target.innerHTML = '';
    let seed = this.seed;
    this.createRow(seed);
    for (let i = 0; i < this.size; i++) {
      seed = seed.map(this.processRule.bind(this));
      this.createRow(seed);
    }
  }

  createRow(seed) {
    var frag = document.createDocumentFragment();
    seed.forEach(state => {
      var div = document.createElement('div');
      div.style.backgroundColor = (state ? this.active : this.inactive);
      div.style.width = `${100 / this.size}vw`;
      div.style.height = `${100 / this.size}vh`;
      div.style.float = 'left';
      frag.appendChild(div);
    });
    this.target.appendChild(frag);
  }

  processRule(v, i, a) {
    var l = a[i - 1] || 0;
    var r = a[i + 1] || 0;

    return (this.rule.map(v => ('000' + v.toString(2)).slice(-3)).indexOf(`${l}${v}${r}`) > -1) | 0;
  }

  get randomRule() {
    return [0, 1, 2, 3, 4, 5, 6, 7]
      .filter(v => Random.int(0, 1));
  }

  get randomSeed() {
    return Array(this.size).fill(0)
      .map(() => Random.int(0, 1));
  }


}

new CellularAutomata(50);
