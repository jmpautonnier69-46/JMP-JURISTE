/* JMP Juriste — animations « droit + IA », diagnostic et mini-jeu.
   Aucun appel réseau : tout s'exécute dans le navigateur. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onVisible(el, cb, threshold) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { cb(e.isIntersecting); });
    }, { threshold: threshold || 0.25 }).observe(el);
  }

  /* ---------- 1. Hero : délibération analysée ---------- */
  function initAiScan(root) {
    var marks = root.querySelectorAll('mark[data-k]');
    var notes = root.querySelectorAll('.ai-notes li');
    var bar = root.querySelector('.ai-progress');
    var count = root.querySelector('[data-ai-count]');
    var status = root.querySelector('.ai-status');
    var n = marks.length, timers = [], running = false, visible = false;

    function clear() { timers.forEach(clearTimeout); timers = []; }
    function setStep(i) {
      for (var j = 0; j < n; j++) {
        marks[j].classList.toggle('on', j < i);
        if (notes[j]) notes[j].classList.toggle('on', j < i);
      }
      bar.style.setProperty('--p', Math.round(i / n * 100) + '%');
      count.textContent = i;
    }
    function finalState() {
      setStep(n); root.classList.remove('is-scanning'); root.classList.add('is-done');
      status.textContent = 'Analyse terminée';
    }
    function cycle() {
      clear(); running = true;
      setStep(0); root.classList.remove('is-done'); root.classList.add('is-scanning');
      status.textContent = 'Analyse en cours';
      for (var i = 1; i <= n; i++) {
        (function (k) { timers.push(setTimeout(function () { setStep(k); }, 900 + k * 1300)); })(i);
      }
      timers.push(setTimeout(finalState, 900 + n * 1300 + 500));
      timers.push(setTimeout(function () { if (visible && !document.hidden) cycle(); else running = false; }, 900 + n * 1300 + 7500));
    }
    if (reduce) { finalState(); return; }
    onVisible(root, function (v) { visible = v; if (v && !running) cycle(); }, 0.3);
    document.addEventListener('visibilitychange', function () { if (!document.hidden && visible && !running) cycle(); });
  }

  /* ---------- 2. Réseau animé (hero de la page IA) ---------- */
  function initNetwork(canvas) {
    var ctx = canvas.getContext('2d'); if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2), w, h, pts = [], mouse = { x: -999, y: -999 }, raf = null, active = false;
    function size() {
      var r = canvas.getBoundingClientRect(); w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(90, Math.max(28, w * h / 16000)));
      pts = [];
      for (var i = 0; i < count; i++) pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .8 });
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      var max = 130;
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        if (!reduce) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1; }
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < max) { ctx.strokeStyle = 'rgba(94,230,208,' + (0.22 * (1 - d / max)).toFixed(3) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
        var md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (md < 170) { ctx.strokeStyle = 'rgba(159,212,255,' + (0.35 * (1 - md / 170)).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
        ctx.fillStyle = md < 170 ? 'rgba(159,212,255,.95)' : 'rgba(94,230,208,.75)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      if (active && !reduce) raf = requestAnimationFrame(draw);
    }
    size(); draw();
    window.addEventListener('resize', function () { size(); if (!active || reduce) draw(); });
    var host = canvas.parentElement;
    host.addEventListener('pointermove', function (e) { var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; if (reduce) draw(); });
    host.addEventListener('pointerleave', function () { mouse.x = mouse.y = -999; if (reduce) draw(); });
    if (reduce) return;
    onVisible(canvas, function (v) { active = v; if (v && !raf) { raf = requestAnimationFrame(draw); } if (!v && raf) { cancelAnimationFrame(raf); raf = null; } }, 0.01);
  }

  /* ---------- 3. Démo : sécuriser un prompt ---------- */
  function initPromptLab(lab) {
    var toks = lab.querySelectorAll('.tok'), btn = lab.parentElement.querySelector('[data-secure]'), counter = lab.parentElement.querySelector('[data-tok-count]');
    var state = lab.querySelector('.is-input .state'), safe = false, auto = false;
    toks.forEach(function (t) { t.dataset.raw = t.textContent; });
    function render() {
      var timers = 0;
      toks.forEach(function (t, i) {
        setTimeout(function () { t.textContent = safe ? t.dataset.safe : t.dataset.raw; t.classList.toggle('safe', safe); }, reduce ? 0 : i * (safe ? 260 : 60));
        timers = i;
      });
      lab.classList.toggle('is-safe', safe);
      state.textContent = safe ? 'Prompt sécurisé' : toks.length + ' données exposées';
      counter.textContent = safe ? '0 donnée personnelle transmise' : toks.length + ' données personnelles détectées';
      btn.textContent = safe ? 'Revoir le prompt d’origine' : 'Sécuriser le prompt';
      btn.setAttribute('aria-pressed', safe ? 'true' : 'false');
    }
    btn.addEventListener('click', function () { safe = !safe; auto = true; render(); });
    render();
    if (!reduce) onVisible(lab, function (v) { if (v && !auto) { auto = true; setTimeout(function () { safe = true; render(); }, 1600); } }, 0.5);
  }

  /* ---------- 4. Diagnostic IA ---------- */
  var AXES = { U: 'Usages', D: 'Données', C: 'Cadre', K: 'Compétences' };
  var AXIS_COLOR = { U: '#9fd4ff', D: '#ff9d8f', C: '#f2b84b', K: '#5ee6d0' };
  var PROFILE = {
    q: 'Votre structure est…',
    o: ['Une commune de moins de 1\u00a0000 habitants', 'Une commune de 1\u00a0000 à 3\u00a0500 habitants', 'Une commune de plus de 3\u00a0500 habitants', 'Une intercommunalité ou un syndicat', 'Une autre structure (association, entreprise…)']
  };
  var Q = [
    { a: 'U', q: 'Vos agents utilisent-ils déjà des outils d’IA générative (ChatGPT, Copilot, Le Chat…) ?', o: [['Je ne sais pas', 0], ['Oui, chacun de son côté', 1], ['Oui, sur quelques usages identifiés', 2], ['Oui, avec des outils choisis par la collectivité', 3]], tip: 'Faire un état des lieux des usages réels : ils existent souvent déjà, sans être connus de la hiérarchie.' },
    { a: 'U', q: 'Avez-vous repéré les tâches où l’IA ferait gagner du temps ?', o: [['Non', 0], ['Quelques idées', 1], ['Oui, une liste existe', 2], ['Oui, testées et évaluées', 3]], tip: 'Cibler 3 à 5 usages utiles (courriers, comptes rendus, synthèses, veille) plutôt que « tout l’IA ».' },
    { a: 'D', q: 'Les agents savent-ils quelles informations ne doivent jamais être saisies dans une IA ?', o: [['Non', 0], ['Vaguement', 1], ['Oui, par des consignes orales', 2], ['Oui, par une règle écrite', 3]], tip: 'Écrire noir sur blanc les données interdites : données personnelles, sociales, de santé, offres des candidats.' },
    { a: 'D', q: 'Des documents nominatifs (courriers d’administrés, dossiers sociaux, état civil) ont-ils pu être copiés dans un outil grand public ?', o: [['Je ne sais pas', 0], ['Probablement', 0], ['Rarement', 2], ['Non, c’est encadré', 3]], tip: 'Vérifier si des données personnelles ont pu être transmises et sensibiliser sans attendre les agents concernés.' },
    { a: 'D', q: 'Quels comptes sont utilisés ?', o: [['Des comptes personnels gratuits', 0], ['Un mélange de comptes personnels et professionnels', 1], ['Des comptes professionnels', 2], ['Une offre professionnelle encadrant contractuellement les données', 3]], tip: 'Privilégier des comptes professionnels dont les conditions d’utilisation encadrent le sort des données saisies.' },
    { a: 'C', q: 'Existe-t-il une charte ou une note interne sur l’usage de l’IA ?', o: [['Non', 0], ['En réflexion', 1], ['Un projet est rédigé', 2], ['Adoptée et diffusée', 3]], tip: 'Adopter une charte courte et lisible : usages autorisés, usages interdits, vérification, responsabilité.' },
    { a: 'C', q: 'Votre délégué à la protection des données (DPO) a-t-il été associé ?', o: [['Nous n’avons pas de DPO identifié', 0], ['Non', 1], ['Il a été informé', 2], ['Il est associé aux décisions', 3]], tip: 'Associer le DPO (souvent mutualisé) à la définition des règles d’usage de l’IA.' },
    { a: 'C', q: 'Un élu ou un responsable suit-il le sujet ?', o: [['Non', 0], ['De façon informelle', 1], ['Oui, un référent est désigné', 2], ['Oui, avec une feuille de route', 3]], tip: 'Désigner un référent IA, élu ou agent, chargé de suivre les usages et de les faire évoluer.' },
    { a: 'K', q: 'Les agents ont-ils été formés à l’IA générative ?', o: [['Aucune formation', 0], ['Autoformation individuelle', 1], ['Une sensibilisation ponctuelle', 2], ['Une formation adaptée à leurs métiers', 3]], tip: 'Former les agents à des usages concrets de leur métier : c’est aussi la réponse la plus directe à l’exigence de maîtrise de l’IA du règlement européen.' },
    { a: 'K', q: 'Les réponses de l’IA sont-elles vérifiées avant d’être utilisées ?', o: [['Rarement', 0], ['Parfois', 1], ['Souvent', 2], ['Toujours, avec une méthode', 3]], tip: 'Installer un réflexe de vérification : une IA peut inventer des articles de loi ou des jurisprudences plausibles.' }
  ];
  var MODULES = {
    decouvrir: ['Demi-journée', 'Découvrir l’IA générative au service public'],
    secretaires: ['1 journée', 'L’IA pour les secrétaires de mairie'],
    achat: ['1 journée', 'IA et commande publique'],
    charte: ['Atelier', 'Rédiger la charte IA de votre collectivité']
  };

  function initDiagnostic(app) {
    var steps = [PROFILE].concat(Q), answers = new Array(steps.length), i = 0;
    var card = app.querySelector('[data-diag-card]');

    function renderQuestion() {
      var s = steps[i], isProfile = i === 0;
      var html = '<div class="diag-top"><span>Question ' + (i + 1) + ' / ' + steps.length + '</span><span class="diag-axis">' + (isProfile ? 'Profil' : AXES[s.a]) + '</span></div>' +
        '<div class="diag-bar" aria-hidden="true"><span style="width:' + Math.round(i / steps.length * 100) + '%"></span></div>' +
        '<h2 class="diag-q" tabindex="-1">' + s.q + '</h2><div class="diag-options" role="group" aria-label="Réponses">';
      s.o.forEach(function (opt, k) {
        var label = isProfile ? opt : opt[0];
        html += '<button type="button" class="diag-option' + (answers[i] === k ? ' is-picked' : '') + '" data-k="' + k + '"><span class="key">' + String.fromCharCode(65 + k) + '</span>' + label + '</button>';
      });
      html += '</div><div class="diag-nav"><button type="button" class="diag-back" ' + (i === 0 ? 'disabled' : '') + '>← Précédent</button><span class="diag-hint">Touches A, B, C… acceptées</span></div>';
      card.innerHTML = html;
      card.querySelectorAll('.diag-option').forEach(function (b) {
        b.addEventListener('click', function () { pick(+b.dataset.k); });
      });
      card.querySelector('.diag-back').addEventListener('click', function () { if (i > 0) { i--; renderQuestion(); } });
      var h = card.querySelector('.diag-q'); if (h && started) h.focus({ preventScroll: true });
    }
    var started = false;
    function pick(k) {
      started = true; answers[i] = k;
      card.querySelectorAll('.diag-option').forEach(function (b) { b.classList.toggle('is-picked', +b.dataset.k === k); });
      setTimeout(function () { if (i < steps.length - 1) { i++; renderQuestion(); } else renderResult(); }, reduce ? 0 : 260);
    }
    document.addEventListener('keydown', function (e) {
      if (!card.querySelector('.diag-options') || e.altKey || e.ctrlKey || e.metaKey) return;
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      var r = app.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) return;
      var k = e.key.toUpperCase().charCodeAt(0) - 65;
      if (e.key.length === 1 && k >= 0 && k < steps[i].o.length) { e.preventDefault(); pick(k); }
    });

    function renderResult() {
      var tot = 0, ax = { U: [0, 0], D: [0, 0], C: [0, 0], K: [0, 0] }, weak = [];
      Q.forEach(function (q, idx) {
        var v = q.o[answers[idx + 1]][1]; tot += v; ax[q.a][0] += v; ax[q.a][1] += 3;
        if (v <= 1) weak.push({ tip: q.tip, v: v, a: q.a });
      });
      var score = Math.round(tot / (Q.length * 3) * 100);
      var level = score < 30 ? ['Usages à découvrir', 'L’IA est peu présente ou utilisée sans repères. C’est le bon moment pour poser des bases saines avant que les usages ne s’installent.']
        : score < 55 ? ['Usages spontanés à encadrer', 'L’IA est déjà là, mais chacun l’utilise à sa façon. Le principal enjeu est la protection des données et la vérification des résultats.']
        : score < 80 ? ['En structuration', 'Les bases sont posées. Il reste à consolider le cadre et à généraliser les bonnes pratiques par métier.']
        : ['Usages maîtrisés', 'Votre structure a une longueur d’avance. L’enjeu devient l’approfondissement par métier et le suivi dans le temps.'];
      weak.sort(function (a, b) { var o = { D: 0, C: 1, K: 2, U: 3 }; return a.v - b.v || o[a.a] - o[b.a]; });
      var prios = weak.slice(0, 4).map(function (w) { return w.tip; });
      if (!prios.length) prios = ['Approfondir les usages par métier (urbanisme, commande publique, état civil) et mesurer le temps gagné.', 'Réviser la charte chaque année au regard des nouveaux outils et des évolutions réglementaires.'];
      var pct = function (a) { return Math.round(ax[a][0] / ax[a][1] * 100); };
      var mods = [];
      if (pct('K') < 67 || pct('U') < 50) mods.push(answers[0] <= 1 ? 'secretaires' : 'decouvrir');
      if (pct('C') < 67 || pct('D') < 67) mods.push('charte');
      if (answers[0] >= 2 && answers[0] <= 3) mods.push('achat');
      if (!mods.length) mods.push('achat', 'secretaires');
      mods = mods.filter(function (m, k) { return mods.indexOf(m) === k; }).slice(0, 3);

      var C = 2 * Math.PI * 64;
      var html = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="diagGrad" x1="0" x2="1"><stop offset="0" stop-color="#5ee6d0"/><stop offset="1" stop-color="#9fd4ff"/></linearGradient></defs></svg>' +
        '<div class="diag-result-head"><div class="diag-ring" role="img" aria-label="Score de maturité : ' + score + ' sur 100"><svg viewBox="0 0 150 150"><circle class="track" cx="75" cy="75" r="64"/><circle class="val" cx="75" cy="75" r="64" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '"/></svg><b><span><span data-score>0</span><small>/ 100</small></span></b></div>' +
        '<div><span class="diag-level">' + level[0] + '</span><h2 tabindex="-1" class="diag-q" style="margin-bottom:8px">Votre maturité IA</h2><p>' + level[1] + '</p></div></div>' +
        '<div class="diag-axes">' + Object.keys(AXES).map(function (a) { return '<div><div class="lbl"><span>' + AXES[a] + '</span><b>' + pct(a) + ' %</b></div><div class="track"><span data-w="' + pct(a) + '" style="background:' + AXIS_COLOR[a] + '"></span></div></div>'; }).join('') + '</div>' +
        '<h3 class="diag-section-title">Vos priorités</h3><ol class="diag-prios">' + prios.map(function (p) { return '<li><span>' + p + '</span></li>'; }).join('') + '</ol>' +
        '<h3 class="diag-section-title">Formations adaptées</h3><div class="diag-modules">' + mods.map(function (m) { return '<a href="/intelligence-artificielle/#modules"><small>' + MODULES[m][0] + '</small><strong>' + MODULES[m][1] + '</strong></a>'; }).join('') + '</div>' +
        '<div class="diag-actions"><a class="button" data-mail href="#">Recevoir un programme adapté</a><button type="button" class="button secondary" data-print>Imprimer ou enregistrer en PDF</button><button type="button" class="button secondary" data-restart>Recommencer</button></div>' +
        '<p class="diag-disclaimer">Outil de sensibilisation : ce diagnostic indicatif ne constitue ni un audit, ni un avis juridique. Vos réponses ne quittent pas votre navigateur, sauf si vous choisissez de me les envoyer par courriel.</p>';
      card.innerHTML = html;
      var body = 'Bonjour,\n\nJ’ai réalisé le diagnostic IA sur jmp-juriste.fr.\n\nStructure : ' + PROFILE.o[answers[0]] + '\nScore : ' + score + ' / 100 (' + level[0] + ')\n' +
        Object.keys(AXES).map(function (a) { return '- ' + AXES[a] + ' : ' + pct(a) + ' %'; }).join('\n') +
        '\n\nPriorités :\n' + prios.map(function (p, k) { return (k + 1) + '. ' + p; }).join('\n') +
        '\n\nJe souhaite recevoir un programme de formation adapté.\n\nNom :\nCollectivité :\nTéléphone :\n';
      card.querySelector('[data-mail]').href = 'mailto:contact@jmp-juriste.fr?subject=' + encodeURIComponent('Diagnostic IA : demande de programme') + '&body=' + encodeURIComponent(body);
      card.querySelector('[data-print]').addEventListener('click', function () { window.print(); });
      card.querySelector('[data-restart]').addEventListener('click', function () { answers = new Array(steps.length); i = 0; renderQuestion(); card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); });
      var h = card.querySelector('h2'); if (h) h.focus({ preventScroll: true });
      card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      requestAnimationFrame(function () {
        setTimeout(function () {
          card.querySelector('.diag-ring .val').style.strokeDashoffset = (C * (1 - score / 100)).toFixed(1);
          card.querySelectorAll('[data-w]').forEach(function (s) { s.style.width = s.dataset.w + '%'; });
          var el = card.querySelector('[data-score]');
          if (reduce) { el.textContent = score; return; }
          var t0 = performance.now();
          (function tick(t) { var k = Math.min(1, (t - t0) / 1300); el.textContent = Math.round(score * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); })(t0);
        }, 60);
      });
    }
    renderQuestion();
  }

  /* ---------- 5. Mini-jeu : peut-on le confier à une IA grand public ? ---------- */
  var ITEMS = [
    ['Un modèle de courrier d’invitation à la cérémonie du 11 Novembre, sans aucun nom', true, 'Aucune donnée personnelle ni confidentielle : c’est l’usage idéal pour gagner du temps.'],
    ['La liste des bénéficiaires de l’aide sociale du CCAS, pour la mettre en forme', false, 'Données personnelles, potentiellement sensibles et protégées par le secret : elles ne doivent pas sortir des outils maîtrisés par la collectivité.'],
    ['Le compte rendu du dernier conseil municipal, déjà publié, pour en faire un résumé', true, 'Document public : l’usage est adapté. Pensez tout de même à vérifier le résumé produit.'],
    ['Les offres des entreprises candidates à un marché en cours, pour les comparer', false, 'Le secret des affaires des candidats doit être protégé : un outil grand public n’offre pas cette garantie.'],
    ['Le courrier d’un administré qui conteste un refus de permis, avec son nom et son adresse', false, 'Pas tel quel. En retirant le nom, l’adresse et la référence du dossier, vous pouvez en revanche demander de l’aide pour structurer la réponse.'],
    ['Le texte d’un article du code de l’urbanisme, pour le reformuler en langage clair', true, 'Texte public : usage pertinent, à condition de relire et de vérifier que le sens n’a pas été déformé.'],
    ['L’arrêt maladie d’un agent, pour rédiger le courrier de prolongation', false, 'Donnée de santé, catégorie particulière au sens du RGPD : à exclure absolument d’un outil grand public.']
  ];
  function initDataGame(root) {
    var idx = 0, score = 0, answered = false;
    var item = root.querySelector('[data-game-item]'), pos = root.querySelector('[data-game-pos]'), sc = root.querySelector('[data-game-score]');
    var fb = root.querySelector('.game-feedback'), choices = root.querySelector('.game-choices'), next = root.querySelector('[data-game-next]');
    function show() {
      answered = false; fb.hidden = true; next.hidden = true; choices.hidden = false;
      item.textContent = ITEMS[idx][0]; pos.textContent = (idx + 1) + ' / ' + ITEMS.length; sc.textContent = score;
    }
    root.querySelectorAll('[data-answer]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (answered) return; answered = true;
        var yes = b.dataset.answer === 'oui', ok = yes === ITEMS[idx][1]; if (ok) score++;
        sc.textContent = score;
        fb.className = 'game-feedback ' + (ok ? 'good' : 'bad');
        fb.innerHTML = '<strong>' + (ok ? 'Bonne réponse' : 'Attention') + ' · ' + (ITEMS[idx][1] ? 'Oui, possible' : 'Non, à éviter') + '</strong>' + ITEMS[idx][2];
        fb.hidden = false; choices.hidden = true; next.hidden = false;
        next.textContent = idx < ITEMS.length - 1 ? 'Situation suivante' : 'Voir mon résultat';
        next.focus();
      });
    });
    next.addEventListener('click', function () {
      if (idx < ITEMS.length - 1) { idx++; show(); return; }
      item.textContent = score + ' bonne' + (score > 1 ? 's' : '') + ' réponse' + (score > 1 ? 's' : '') + ' sur ' + ITEMS.length + '.';
      fb.className = 'game-feedback'; fb.hidden = false;
      fb.innerHTML = '<strong>Le bon réflexe</strong>Avant de coller un texte dans une IA, demandez-vous s’il contient un nom, une donnée sociale ou de santé, ou une information confidentielle. Dans le doute, anonymisez ou abstenez-vous. C’est l’un des exercices de mes formations.';
      choices.hidden = true; next.textContent = 'Rejouer'; idx = -1; score = 0;
    });
    show();
  }

  function boot() {
    document.querySelectorAll('[data-ai-scan]').forEach(initAiScan);
    document.querySelectorAll('canvas[data-network]').forEach(initNetwork);
    document.querySelectorAll('[data-prompt-lab]').forEach(initPromptLab);
    document.querySelectorAll('[data-diagnostic]').forEach(initDiagnostic);
    document.querySelectorAll('[data-data-game]').forEach(initDataGame);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
