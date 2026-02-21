let current = '0';
let expression = '';
let justCalc = false;

const resultEl = document.getElementById('result');
const exprEl = document.getElementById('expr');

function updateDisplay() {
  resultEl.textContent = current.length > 12 ? parseFloat(current).toExponential(4) : current;
  exprEl.textContent = expression;
}

function popAnim() {
  resultEl.classList.remove('pop');
  void resultEl.offsetWidth;
  resultEl.classList.add('pop');
  setTimeout(() => resultEl.classList.remove('pop'), 200);
}

function inputNum(n) {
  if (justCalc) { current = n; expression = ''; justCalc = false; }
  else if (current === '0') current = n;
  else if (current.length < 15) current += n;
  updateDisplay();
}

function inputDot() {
  if (justCalc) { current = '0.'; expression = ''; justCalc = false; }
  else if (!current.includes('.')) current += '.';
  updateDisplay();
}

function inputOp(op) {
  justCalc = false;
  const opDisplay = {'+':'+', '-':'−', '*':'×', '/':'÷', '%':'%'}[op] || op;
  if (expression && !isOperator(expression.slice(-1))) {
    try {
      const val = evalExpr(expression + current);
      expression = formatNum(val) + ' ' + opDisplay + ' ';
      current = '0';
    } catch { expression += ' ' + opDisplay + ' '; }
  } else {
    expression = current + ' ' + opDisplay + ' ';
    current = '0';
  }
  updateDisplay();
}

function isOperator(c) { return ['+','−','×','÷','%'].includes(c); }

function calculate() {
  if (!expression) return;
  const fullExpr = expression + current;
  exprEl.textContent = fullExpr + ' =';
  try {
    const val = evalExpr(fullExpr);
    current = formatNum(val);
    expression = '';
    justCalc = true;
    popAnim();
  } catch {
    current = 'Error';
    expression = '';
    justCalc = true;
  }
  updateDisplay();
  exprEl.textContent = fullExpr + ' =';
}

function evalExpr(expr) {
  const clean = expr
    .replace(/÷/g, '/')
    .replace(/×/g, '*')
    .replace(/−/g, '-')
    .replace(/%/g, '/100');
  // safe eval using Function
  return Function('"use strict"; return (' + clean + ')')();
}

function formatNum(n) {
  if (!isFinite(n)) return 'Error';
  const s = parseFloat(n.toPrecision(12)).toString();
  return s;
}

function clearAll() {
  current = '0'; expression = ''; justCalc = false;
  updateDisplay();
}

function backspace() {
  if (justCalc) return;
  current = current.length > 1 ? current.slice(0, -1) : '0';
  updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') inputNum(e.key);
  else if (e.key === '.') inputDot();
  else if (['+','-','*','/','%'].includes(e.key)) inputOp(e.key);
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') backspace();
  else if (e.key === 'Escape') clearAll();
});

// Ripple effect
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
    this.appendChild(r);
    setTimeout(() => r.remove(), 400);
  });
});
