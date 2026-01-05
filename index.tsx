/**
 * D5 Navigator - Vanilla Implementation
 */

enum Winner {
    PLAYER = 'Player',
    BANKER = 'Banker',
    TIE = 'Tie'
}

enum Result {
    WIN = 'Win',
    LOSS = 'Loss',
    PUSH = 'Push',
    PENDING = 'Pending'
}

interface Hand {
    id: number;
    playerScore: number;
    bankerScore: number;
    winner: Winner;
    prediction: Winner | null;
    result: Result;
    runningTotal: number;
    delta: number;
}

class D5App {
    private hands: Hand[] = [];
    private nextPrediction: Winner | null = null;
    private keypadInput: string = '';
    private isHistoryExpanded: boolean = false;

    // DOM Elements
    private elements: { [key: string]: HTMLElement | null } = {};

    constructor() {
        this.cacheElements();
        this.setupEventListeners();
        this.renderKeypad();
        this.updateUI();
        this.renderChart();
    }

    private cacheElements() {
        const ids = [
            'next-bet-indicator', 'next-bet-text', 'download-btn', 'reset-trigger-btn', 
            'menu-btn', 'main-chart', 'chart-container', 'history-container', 
            'history-header', 'history-count', 'history-chevron', 'history-list',
            'keypad-backdrop', 'keypad-panel', 'close-keypad-btn', 'p-score', 
            'b-score', 'keypad-buttons', 'reset-modal', 'cancel-reset-btn', 'confirm-reset-btn'
        ];
        ids.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });
    }

    private setupEventListeners() {
        this.elements['menu-btn']?.addEventListener('click', () => this.toggleKeypad(true));
        this.elements['close-keypad-btn']?.addEventListener('click', () => this.toggleKeypad(false));
        this.elements['keypad-backdrop']?.addEventListener('click', () => this.toggleKeypad(false));
        this.elements['history-header']?.addEventListener('click', () => this.toggleHistory());
        this.elements['reset-trigger-btn']?.addEventListener('click', () => this.toggleResetModal(true));
        this.elements['cancel-reset-btn']?.addEventListener('click', () => this.toggleResetModal(false));
        this.elements['confirm-reset-btn']?.addEventListener('click', () => this.resetData());
        this.elements['download-btn']?.addEventListener('click', () => this.downloadChart());
        window.addEventListener('resize', () => this.renderChart());
    }

    private toggleKeypad(show: boolean) {
        this.elements['keypad-panel']?.classList.toggle('hidden', !show);
        this.elements['keypad-backdrop']?.classList.toggle('hidden', !show);
        if (show) this.keypadInput = '';
        this.updateKeypadDisplay();
    }

    private toggleHistory() {
        this.isHistoryExpanded = !this.isHistoryExpanded;
        const container = this.elements['history-container'];
        const list = this.elements['history-list'];
        const chevron = this.elements['history-chevron'];
        
        if (this.isHistoryExpanded) {
            container?.classList.replace('h-[92px]', 'h-[260px]');
            list?.classList.replace('overflow-hidden', 'overflow-y-auto');
            if (chevron) (chevron as any).innerHTML = '<path d="M6 9l6 6 6-6"/>';
        } else {
            container?.classList.replace('h-[260px]', 'h-[92px]');
            list?.classList.replace('overflow-y-auto', 'overflow-hidden');
            if (chevron) (chevron as any).innerHTML = '<path d="M18 15l-6-6-6 6"/>';
        }
    }

    private toggleResetModal(show: boolean) {
        this.elements['reset-modal']?.classList.toggle('hidden', !show);
    }

    private resetData() {
        this.hands = [];
        this.nextPrediction = null;
        this.toggleResetModal(false);
        this.updateUI();
        this.renderChart();
    }

    private renderKeypad() {
        const btnContainer = this.elements['keypad-buttons'];
        if (!btnContainer) return;

        btnContainer.innerHTML = '';
        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(num => {
            const btn = document.createElement('button');
            btn.className = "h-14 text-2xl font-medium bg-zinc-800 rounded-lg hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 transition-colors";
            btn.textContent = num.toString();
            btn.onclick = () => this.handleKeyPress(num.toString());
            btnContainer.appendChild(btn);
        });

        const backBtn = document.createElement('button');
        backBtn.className = "h-14 flex items-center justify-center bg-zinc-800/50 rounded-lg hover:bg-zinc-700/50 text-red-400 transition-colors";
        backBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>`;
        backBtn.onclick = () => this.handleBackspace();
        btnContainer.appendChild(backBtn);

        const zeroBtn = document.createElement('button');
        zeroBtn.className = "h-14 text-2xl font-medium bg-zinc-800 rounded-lg hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 transition-colors";
        zeroBtn.textContent = '0';
        zeroBtn.onclick = () => this.handleKeyPress('0');
        btnContainer.appendChild(zeroBtn);

        const submitBtn = document.createElement('button');
        submitBtn.id = 'submit-score-btn';
        submitBtn.className = "h-14 flex items-center justify-center rounded-lg font-bold transition-all shadow-lg bg-zinc-800/50 text-zinc-600 cursor-not-allowed";
        submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
        submitBtn.onclick = () => this.submitScore();
        btnContainer.appendChild(submitBtn);
    }

    private handleKeyPress(char: string) {
        if (this.keypadInput.length < 2) {
            this.keypadInput += char;
            this.updateKeypadDisplay();
        }
    }

    private handleBackspace() {
        this.keypadInput = this.keypadInput.slice(0, -1);
        this.updateKeypadDisplay();
    }

    private updateKeypadDisplay() {
        const p = this.elements['p-score'];
        const b = this.elements['b-score'];
        const submit = document.getElementById('submit-score-btn');
        const v1 = this.keypadInput[0];
        const v2 = this.keypadInput[1];
        if (p) { p.textContent = v1 ?? '0'; p.className = v1 ? 'font-bold text-blue-500' : 'font-bold text-zinc-700'; }
        if (b) { b.textContent = v2 ?? '0'; b.className = v2 ? 'font-bold text-red-500' : 'font-bold text-zinc-700'; }
        if (submit) {
            const complete = this.keypadInput.length === 2;
            const tie = complete && v1 === v2;
            if (complete && !tie) {
                submit.className = "h-14 flex items-center justify-center rounded-lg transition-all font-bold text-white shadow-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 shadow-emerald-900/20";
                (submit as HTMLButtonElement).disabled = false;
            } else {
                submit.className = "h-14 flex items-center justify-center rounded-lg font-bold text-white bg-zinc-800/50 text-zinc-600 cursor-not-allowed";
                (submit as HTMLButtonElement).disabled = true;
                if (tie) submit.innerHTML = `<span class="text-[10px] text-rose-500">NO TIE</span>`;
                else submit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
            }
        }
    }

    private submitScore() {
        if (this.keypadInput.length !== 2) return;
        const p = parseInt(this.keypadInput[0]);
        const b = parseInt(this.keypadInput[1]);
        if (p === b) return;
        this.processHand(p, b);
        this.toggleKeypad(false);
    }

    private processHand(p: number, b: number) {
        let winner = p > b ? Winner.PLAYER : Winner.BANKER;
        let unitChange = 0;
        let res = Result.PUSH;
        if (this.nextPrediction) {
            if (winner === this.nextPrediction) { unitChange = 1; res = Result.WIN; }
            else { unitChange = -1; res = Result.LOSS; }
        }
        const delta = Math.abs(p - b);
        const prevTotal = this.hands.length > 0 ? this.hands[this.hands.length - 1].runningTotal : 0;
        const strat = delta >= 5 ? winner : (winner === Winner.PLAYER ? Winner.BANKER : Winner.PLAYER);
        this.hands.push({
            id: this.hands.length + 1,
            playerScore: p, bankerScore: b, winner,
            prediction: this.nextPrediction, result: res,
            runningTotal: prevTotal + unitChange, delta
        });
        this.nextPrediction = strat;
        this.updateUI();
        this.renderChart();
    }

    private updateUI() {
        const txt = this.elements['next-bet-text'];
        const ind = this.elements['next-bet-indicator'];
        const list = this.elements['history-list'];
        const count = this.elements['history-count'];
        const dBtn = this.elements['download-btn'];
        if (count) count.textContent = `(${this.hands.length})`;
        if (dBtn) (dBtn as HTMLButtonElement).disabled = this.hands.length === 0;
        if (txt) txt.textContent = this.nextPrediction ? (this.nextPrediction === Winner.PLAYER ? 'P' : 'B') : '-';
        if (ind) {
            if (!this.nextPrediction) ind.className = "flex items-center justify-center w-12 h-12 rounded-xl border-2 bg-zinc-800/50 border-zinc-700 text-zinc-700";
            else if (this.nextPrediction === Winner.PLAYER) ind.className = "flex items-center justify-center w-12 h-12 rounded-xl border-2 shadow-[0_0_15px_rgba(59,130,246,0.2)] bg-blue-500/10 border-blue-500 text-blue-500";
            else ind.className = "flex items-center justify-center w-12 h-12 rounded-xl border-2 shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-red-500/10 border-red-500 text-red-500";
        }
        if (list) {
            if (this.hands.length === 0) list.innerHTML = `<div class="text-center text-zinc-600 py-4 text-[10px] italic">Waiting...</div>`;
            else list.innerHTML = [...this.hands].reverse().map(h => `
                <div class="grid grid-cols-12 gap-2 items-center p-2 rounded hover:bg-zinc-800/50 text-sm h-[40px]">
                    <div class="col-span-1 text-zinc-500 font-mono text-[10px]">#${h.id}</div>
                    <div class="col-span-4 font-mono">
                        <span class="${h.winner === Winner.PLAYER ? 'text-blue-500' : 'text-zinc-600'}">P:${h.playerScore}</span>
                        <span class="${h.winner === Winner.BANKER ? 'text-red-500' : 'text-zinc-600'}"> B:${h.bankerScore}</span>
                        <span class="text-[10px] text-amber-500 ml-1">Δ${h.delta}</span>
                    </div>
                    <div class="col-span-3 text-center text-[10px]">${h.prediction ? h.prediction[0] : '-'}</div>
                    <div class="col-span-2 text-[10px] font-bold ${h.result === Result.WIN ? 'text-emerald-500' : 'text-rose-500'}">${h.result}</div>
                    <div class="col-span-2 text-right font-mono font-bold">${h.runningTotal > 0 ? '+' : ''}${h.runningTotal}</div>
                </div>`).join('');
        }
    }

    private renderChart() {
        const svg = this.elements['main-chart'] as any as SVGElement;
        const container = this.elements['chart-container'];
        if (!svg || !container) return;
        const w = container.clientWidth - 32; const h = container.clientHeight - 32;
        svg.innerHTML = '';
        const xMax = 75; const yMin = -20; const yMax = 20; const yRange = yMax - yMin;
        const getX = (id: number) => (id / xMax) * w;
        const getY = (v: number) => h - ((v - yMin) / yRange) * h;
        for (let i = yMin; i <= yMax; i += 5) {
            const py = getY(i);
            const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            l.setAttribute('x1', '0'); l.setAttribute('y1', py.toString()); l.setAttribute('x2', w.toString()); l.setAttribute('y2', py.toString());
            l.setAttribute('stroke', i === 0 ? '#002455' : '#27272a');
            if (i !== 0) l.setAttribute('stroke-dasharray', '3 3');
            svg.appendChild(l);
        }
        if (this.hands.length > 0) {
            let pts = `0,${getY(0)}`;
            this.hands.forEach(hand => { pts += ` ${getX(hand.id)},${getY(hand.runningTotal)}`; });
            const p = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            p.setAttribute('points', pts); p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#fbbf24'); p.setAttribute('stroke-width', '1.5');
            svg.appendChild(p);
        }
    }

    private downloadChart() {
        const svg = this.elements['main-chart'] as any as SVGElement;
        if (!svg) return;
        const b = svg.getBoundingClientRect();
        const canvas = document.createElement('canvas');
        canvas.width = b.width * 2; canvas.height = b.height * 2;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const xml = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([xml], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => {
            ctx?.scale(2,2); if (ctx) { ctx.fillStyle = '#09090b'; ctx.fillRect(0,0,b.width,b.height); }
            ctx?.drawImage(img, 0, 0);
            const a = document.createElement('a'); a.download = 'chart.png'; a.href = canvas.toDataURL(); a.click();
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }
}

window.addEventListener('DOMContentLoaded', () => new D5App());
