const path=location.pathname.replace(/\/+$/,'')||'/';
const nav=[['/intelligence-artificielle/','Formation IA'],['/urbanisme/','Urbanisme'],['/actes-juridiques/','Actes'],['/commande-publique/','Commande publique'],['/ressources/','Ressources'],['/a-propos/','À propos'],['/modalites/','Modalités']];
const active=href=>path===href.replace(/\/+$/,'');
const header=`<a class="skip-link" href="#contenu">Aller au contenu</a><header class="site-header"><div class="container nav"><a class="brand" href="/"><img src="/logo-jmp-160.webp" alt="Logo JMP Juriste" width="76" height="76"><span>JMP Juriste<small>Formation · Droit public · IA</small></span></a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="navigation">Menu</button><nav class="nav-links" id="navigation" aria-label="Navigation principale">${nav.map(([href,label])=>`<a href="${href}" ${active(href)?'aria-current="page"':''}>${label}</a>`).join('')}<a class="button" href="/contact/" ${active('/contact/')?'aria-current="page"':''}>Me contacter</a></nav></div></header>`;
const footer=`<footer class="site-footer"><div class="container footer-grid"><div><p><strong>Jean-Maxime Pautonnier, juriste et formateur</strong> · Lot (46) · <a href="mailto:contact@jmp-juriste.fr">contact@jmp-juriste.fr</a></p><p>Organisme de formation déclaré sous le n° 76460082546 (cet enregistrement ne vaut pas agrément de l'État).</p><p>JMP n'est pas avocat et ne délivre pas de consultations juridiques au sens de la loi n° 71-1130 du 31 décembre 1971. Les articles publiés ont une vocation d'information générale.</p></div><nav class="footer-links" aria-label="Informations légales"><a href="/juriste-independant/">Mon cadre d'intervention</a><a href="/ressources/">Actualités & ressources</a><a href="/mentions-legales/">Mentions légales</a><a href="/confidentialite/">Confidentialité</a><a href="/modalites/">Modalités</a></nav></div></footer>`;
document.querySelector('[data-header]')?.replaceWith(document.createRange().createContextualFragment(header));
document.querySelector('[data-footer]')?.replaceWith(document.createRange().createContextualFragment(footer));
const toggle=document.querySelector('.nav-toggle'),links=document.querySelector('.nav-links');toggle?.addEventListener('click',()=>{const open=links.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
const visual=(src,alt,wide=false,priority=false)=>`<figure class="site-visual${wide?' wide':''}"><img src="${src}" alt="${alt}" width="${wide?'1600':'1400'}" height="${wide?'600':'788'}" ${priority?'fetchpriority="high"':'loading="lazy"'} decoding="async"></figure>`;
const profileFigure=()=>`<figure class="profile-portrait"><img src="/images/jean-maxime-pautonnier.webp" alt="Portrait de Jean-Maxime Pautonnier, juriste et formateur" width="800" height="800" fetchpriority="high" decoding="async"></figure>`;
const profileHero=(selector,className)=>{const container=document.querySelector(selector);if(!container)return;const copy=document.createElement('div');copy.className='profile-copy';[...container.childNodes].forEach(node=>copy.append(node));container.append(copy,document.createRange().createContextualFragment(profileFigure()));container.classList.add(className)};
if(path==='/a-propos'){profileHero('.page-hero .container','about-profile-layout')}
const pageVisuals={
  '/urbanisme':['/images/urbanisme-analyse-v2-page.webp',"Analyse d'un plan d'urbanisme dans une mairie du Lot"],
  '/actes-juridiques':['/images/actes-conseil-v2-page.webp',"Salle de conseil municipal avant une séance"],
  '/commande-publique':['/images/commande-projet-v2-page.webp',"Réunion de préparation d'un projet de commande publique"],
  '/intelligence-artificielle':['/images/formation-ia-session-v2-page.webp',"Formation pratique à l'intelligence artificielle auprès de professionnels"]
};
if(pageVisuals[path]){const [src,alt]=pageVisuals[path],container=document.querySelector('.page-hero .container');container?.insertAdjacentHTML('beforeend',visual(src,alt));container?.classList.add('has-page-visual');container?.querySelector('.site-visual')?.classList.add('image-reveal','parallax-media')}
const articleImages={
  'faire-evoluer-plu-quelle-procedure':'article-plu-procedure.webp',
  'permis-construire-sensible-verifications':'article-permis-sensible.webp',
  'motiver-refus-autorisation-urbanisme':'article-refus-urbanisme.webp',
  'recours-gracieux-permis-reaction-commune':'article-recours-gracieux.webp',
  'sursis-a-statuer-conditions':'article-sursis-statuer.webp',
  'certificat-urbanisme-effets':'article-certificat-urbanisme.webp',
  'dia-bons-reflexes-preemption':'article-dia-preemption.webp',
  'construction-sans-autorisation-pouvoirs-maire':'article-construction-sans-autorisation.webp',
  'zan-communes-rurales-marges-manoeuvre':'article-zan-rural.webp',
  'conflit-interets-elu-conseil':'article-conflit-interets.webp',
  'deliberation-checklist-conseil-municipal':'article-deliberation.webp',
  'arrete-police-maire-proportionnalite':'article-arrete-police.webp',
  'commune-intercommunalite-competence':'article-competence-intercommunalite.webp',
  'controle-legalite-repondre-prefecture':'article-controle-legalite.webp',
  'marche-sans-publicite-traces-conserver':'article-marche-sans-publicite.webp',
  'offre-anormalement-basse-methode':'article-offre-anormalement-basse.webp',
  'rc-ccap-incoherences-avant-publication':'article-rc-ccap.webp',
  'loi-huwart-urbanisme-changements':'article-loi-huwart.webp',
  'loi-sve-urbanisme-consequences':'article-simplification-vie-economique.webp',
  'travaux-site-classe-pieces-autorisations':'article-site-classe.webp',
  'seuils-marches-publics-2026':'article-seuils-marches-2026.webp',
  'maitrise-ia-collectivites':'article-maitrise-ia.webp',
  'duree-validite-permis-construire':'article-duree-permis.webp'
};
const resourceCatalog=[
  ['seuils-marches-publics-2026','Marchés publics : les seuils applicables en 2026','Commande publique'],
  ['maitrise-ia-collectivites',"Maîtrise de l'IA : les obligations des collectivités",'Intelligence artificielle'],
  ['duree-validite-permis-construire','Durée de validité d’un permis de construire','Urbanisme'],
  ['travaux-site-classe-pieces-autorisations','Travaux en site classé : pièces et autorisations','Actualité juridique'],
  ['loi-sve-urbanisme-consequences','Simplification de la vie économique et urbanisme','Actualité juridique'],
  ['loi-huwart-urbanisme-changements','Loi Huwart : changements en urbanisme','Actualité juridique'],
  ['rc-ccap-incoherences-avant-publication','RC et CCAP : repérer les incohérences','Commande publique'],
  ['offre-anormalement-basse-methode','Offre anormalement basse : la méthode','Commande publique'],
  ['marche-sans-publicite-traces-conserver','Achat direct : quelles traces conserver ?','Commande publique'],
  ['controle-legalite-repondre-prefecture','Répondre aux observations de la préfecture','Collectivités'],
  ['commune-intercommunalite-competence','Commune ou intercommunalité : qui décide ?','Collectivités'],
  ['arrete-police-maire-proportionnalite','Rédiger un arrêté de police proportionné','Collectivités'],
  ['deliberation-checklist-conseil-municipal','La checklist d’une délibération municipale','Collectivités'],
  ['conflit-interets-elu-conseil',"Conflit d’intérêts d’un élu : les précautions",'Collectivités'],
  ['zan-communes-rurales-marges-manoeuvre','ZAN : les marges des communes rurales','Urbanisme'],
  ['construction-sans-autorisation-pouvoirs-maire','Construction sans autorisation : les pouvoirs du maire','Urbanisme'],
  ['dia-bons-reflexes-preemption','DIA : les réflexes avant de préempter','Urbanisme'],
  ['certificat-urbanisme-effets','Certificat d’urbanisme : portée et garanties','Urbanisme'],
  ['sursis-a-statuer-conditions','Sursis à statuer : conditions et durée','Urbanisme'],
  ['recours-gracieux-permis-reaction-commune','Recours gracieux contre un permis : comment réagir ?','Urbanisme'],
  ['motiver-refus-autorisation-urbanisme','Motiver un refus d’autorisation d’urbanisme','Urbanisme'],
  ['permis-construire-sensible-verifications','Permis sensible : les vérifications avant signature','Urbanisme'],
  ['faire-evoluer-plu-quelle-procedure','Faire évoluer un PLU : quelle procédure ?','Urbanisme']
].map(([slug,title,category])=>({slug,title,category}));
const articleSlug=value=>value.replace(/^.*\/ressources\//,'').replace(/\/+$/,'');
const resourceImage=(url,title='')=>{const file=articleImages[articleSlug(url)];return file?[`/images/${file}`,`Illustration de l’article « ${title} »`]:['/images/ressources-juridiques.webp','Ressources juridiques pour les collectivités']};
if(path==='/ressources'){const container=document.querySelector('.page-hero .container');container?.insertAdjacentHTML('beforeend',visual('/images/ressources-juridiques.webp','Table de travail consacrée à la veille et aux ressources juridiques'));container?.querySelector('.site-visual')?.classList.add('image-reveal')}
if(path.startsWith('/ressources/')&&path!=='/ressources'){const title=document.querySelector('.page-hero h1')?.textContent||'';const [src,alt]=resourceImage(path,title),container=document.querySelector('.page-hero .container');container?.insertAdjacentHTML('beforeend',visual(src,alt));container?.querySelector('.site-visual')?.classList.add('image-reveal')}
document.querySelectorAll('.resource-card').forEach(card=>{if(card.querySelector('.card-media'))return;const title=card.querySelector('h2,h3')?.textContent||'';const href=card.querySelector('a[href*="/ressources/"]')?.getAttribute('href')||'';const [src,alt]=resourceImage(href,title),cardSrc=src.replace(/\.webp$/, '-card.webp'),smallSrc=src.replace(/\.webp$/, '-card-480.webp');card.insertAdjacentHTML('afterbegin',`<img class="card-media" src="${smallSrc}" srcset="${smallSrc} 480w, ${cardSrc} 720w" sizes="(max-width:620px) 88vw, (max-width:920px) 50vw, 357px" alt="${alt}" width="480" height="270" loading="lazy" decoding="async">`)})
const enhanceCarousel=(track,index)=>{
  const items=[...track.children];
  if(items.length<3||track.closest('.carousel-shell'))return;
  const heading=track.closest('.section')?.querySelector('h2')?.textContent?.trim()||`Contenus à parcourir ${index+1}`;
  const shell=document.createElement('div');shell.className='carousel-shell';
  const controls=document.createElement('div');controls.className='carousel-controls';
  controls.innerHTML=`<p class="carousel-status" aria-live="polite"></p><button class="carousel-arrow previous" type="button" aria-label="Voir les éléments précédents">←</button><button class="carousel-arrow next" type="button" aria-label="Voir les éléments suivants">→</button>`;
  track.before(shell);shell.append(controls,track);track.classList.add('carousel-track');track.setAttribute('tabindex','0');track.setAttribute('aria-label',heading);
  const previous=controls.querySelector('.previous'),next=controls.querySelector('.next'),status=controls.querySelector('.carousel-status');
  const metrics=()=>{const first=items[0];if(!first)return{step:1,visible:1,current:0};const gap=parseFloat(getComputedStyle(track).columnGap)||20;const step=first.getBoundingClientRect().width+gap;return{step,visible:Math.max(1,Math.round((track.clientWidth+gap)/step)),current:Math.max(0,Math.round(track.scrollLeft/step))}};
  const update=()=>{const {visible,current}=metrics(),last=Math.min(items.length,current+visible);status.textContent=`${current+1}–${last} sur ${items.length}`;previous.disabled=current===0;next.disabled=last>=items.length};
  previous.addEventListener('click',()=>{const {step,visible}=metrics();track.scrollBy({left:-step*visible,behavior:'smooth'})});
  next.addEventListener('click',()=>{const {step,visible}=metrics();track.scrollBy({left:step*visible,behavior:'smooth'})});
  track.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update,{passive:true});update();
};
if(path==='/'){document.querySelectorAll('main .grid').forEach((track,index)=>{if(track.querySelector('.resource-card'))enhanceCarousel(track,index)})}

const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reducedMotion){
  document.documentElement.classList.add('motion-enabled');
  document.body.insertAdjacentHTML('afterbegin','<div class="scroll-progress" aria-hidden="true"><span></span></div>');
  const progress=document.querySelector('.scroll-progress span'),siteHeader=document.querySelector('.site-header');
  const updateScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;const value=max>0?Math.min(1,scrollY/max):0;progress.style.transform=`scaleX(${value})`;siteHeader?.classList.toggle('scrolled',scrollY>18)};
  updateScroll();addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',updateScroll,{passive:true});
  const reveal=[];
  document.querySelectorAll('.section').forEach(section=>{
    const intro=section.querySelector('.section-intro');if(intro)reveal.push(intro);
    section.querySelectorAll('.grid:not(.carousel-track)>*,.content-grid>*,.faq details,.cta').forEach((el,index)=>{el.style.setProperty('--reveal-delay',`${Math.min(index,5)*70}ms`);reveal.push(el)});
  });
  document.querySelectorAll('.page-hero .container>*,.hero .container>*').forEach((el,index)=>{el.classList.add('intro-motion');el.style.setProperty('--intro-delay',`${80+index*90}ms`)});
  document.querySelectorAll('.article>h2,.article>h3,.article>p,.article>ul,.article>.source-box').forEach(el=>reveal.push(el));
  reveal.forEach(el=>el.classList.add('reveal-motion'));
  if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -7%'});reveal.forEach(el=>observer.observe(el))}else{reveal.forEach(el=>el.classList.add('is-visible'))}
  requestAnimationFrame(()=>requestAnimationFrame(()=>document.documentElement.classList.add('motion-ready')));
}

// Titre d'accueil révélé mot par mot, sans altérer son contenu accessible.
const heroTitle=document.querySelector('.hero-immersive h1');
if(heroTitle&&!reducedMotion){
  const label=heroTitle.textContent.trim(),words=label.split(/\s+/);
  heroTitle.setAttribute('aria-label',label);
  heroTitle.innerHTML=words.map((word,index)=>`<span class="hero-word" aria-hidden="true"><span style="--word-delay:${120+index*55}ms">${word}</span></span>${index<words.length-1?' ':''}`).join('');
}

// Navigation visuelle entre les quatre domaines d'intervention.
const showcase=document.querySelector('[data-service-showcase]');
if(showcase){
  const tabs=[...showcase.querySelectorAll('.service-tab')],panel=showcase.querySelector('.service-panel'),image=panel.querySelector('img'),title=panel.querySelector('h3'),textNode=panel.querySelector('.service-panel-copy>p:not(.eyebrow)'),link=panel.querySelector('.card-link');
  tabs.forEach(tab=>{const preload=new Image();preload.src=tab.dataset.image});
  const activate=(tab,focus=false)=>{
    if(tab.classList.contains('is-active'))return;
    tabs.forEach(item=>{const selected=item===tab;item.classList.toggle('is-active',selected);item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1});
    panel.classList.add('is-changing');
    const swap=()=>{image.src=tab.dataset.image;image.alt=tab.dataset.alt;title.textContent=tab.dataset.title;textNode.textContent=tab.dataset.text;link.href=tab.dataset.link;link.textContent=tab.dataset.cta;panel.classList.remove('is-changing');if(focus)tab.focus()};
    reducedMotion?swap():setTimeout(swap,170);
  };
  tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activate(tab));if(matchMedia('(hover:hover)').matches)tab.addEventListener('pointerenter',()=>activate(tab));tab.addEventListener('keydown',event=>{if(!['ArrowDown','ArrowRight','ArrowUp','ArrowLeft'].includes(event.key))return;event.preventDefault();const direction=['ArrowDown','ArrowRight'].includes(event.key)?1:-1;activate(tabs[(index+direction+tabs.length)%tabs.length],true)})});
}

// Révélation par masque des photographies.
const revealImages=[...document.querySelectorAll('.image-reveal')];
if(reducedMotion){revealImages.forEach(item=>item.classList.add('is-revealed'))}
else if('IntersectionObserver'in window){
  const imageObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');imageObserver.unobserve(entry.target)}}),{threshold:.18});
  revealImages.forEach(item=>imageObserver.observe(item));
}else revealImages.forEach(item=>item.classList.add('is-revealed'));

const advancedReveals=[...document.querySelectorAll('.service-showcase,.editorial-item,.method-timeline li,.ai-flow-step')];
advancedReveals.forEach((item,index)=>{item.classList.add('advanced-reveal');item.style.setProperty('--advanced-delay',`${Math.min(index%4,3)*70}ms`)});
if(reducedMotion)advancedReveals.forEach(item=>item.classList.add('is-visible'));
else if('IntersectionObserver'in window){const advancedObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');advancedObserver.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -6%'});advancedReveals.forEach(item=>advancedObserver.observe(item))}else advancedReveals.forEach(item=>item.classList.add('is-visible'));

// Profondeur légère sur les images, pilotée par le pointeur et le défilement.
if(!reducedMotion){
  document.querySelector('.hero-immersive')?.addEventListener('pointermove',event=>{const rect=event.currentTarget.getBoundingClientRect(),x=((event.clientX-rect.left)/rect.width-.5)*-10,y=((event.clientY-rect.top)/rect.height-.5)*-10;event.currentTarget.style.setProperty('--parallax-x',`${x}px`);event.currentTarget.style.setProperty('--parallax-y',`${y}px`)});
  const updateDepth=()=>{
    document.querySelectorAll('.method-visual').forEach(item=>{const rect=item.getBoundingClientRect(),ratio=Math.max(-1,Math.min(1,(innerHeight/2-(rect.top+rect.height/2))/innerHeight));item.style.setProperty('--scroll-shift',`${-7+ratio*6}%`)});
    const timeline=document.querySelector('.method-timeline');
    if(timeline){const rect=timeline.getBoundingClientRect(),progress=Math.max(0,Math.min(1,(innerHeight*.68-rect.top)/Math.max(rect.height,1)));timeline.style.setProperty('--timeline-progress',`${progress*100}%`);const items=[...timeline.children];items.forEach((item,index)=>item.classList.toggle('is-active',progress>index/items.length-.02))}
    const flow=document.querySelector('.ai-flow-track');
    if(flow){const rect=flow.getBoundingClientRect(),progress=Math.max(0,Math.min(1,(innerHeight*.72-rect.top)/Math.max(rect.height*.75,1)));flow.style.setProperty('--flow-progress',`${progress*100}%`);[...flow.children].forEach((item,index)=>item.classList.toggle('is-active',progress>index/4-.03))}
  };
  addEventListener('scroll',updateDepth,{passive:true});addEventListener('resize',updateDepth,{passive:true});updateDepth();
}

// Parcours pédagogique propre à la formation IA.
if(path==='/intelligence-artificielle'){
  const program=[...document.querySelectorAll('section')].find(section=>section.querySelector('h2')?.textContent.trim()==='Programme');
  program?.querySelector('.container')?.insertAdjacentHTML('beforeend',`<div class="ai-flow"><div class="ai-flow-head"><p class="eyebrow">Usage raisonné</p><h2>De la demande à l'utilisation sécurisée</h2><p>Un cheminement simple pour conserver la maîtrise de l'outil et de ses résultats.</p></div><div class="ai-flow-track"><div class="ai-flow-step"><span>Étape 1</span><strong>Besoin professionnel</strong><p>Identifier précisément la tâche et le résultat attendu.</p></div><div class="ai-flow-step"><span>Étape 2</span><strong>Outil d'IA</strong><p>Formuler une demande adaptée sans exposer de données sensibles.</p></div><div class="ai-flow-step"><span>Étape 3</span><strong>Vérification</strong><p>Contrôler les informations, les références et la cohérence.</p></div><div class="ai-flow-step"><span>Étape 4</span><strong>Usage sécurisé</strong><p>Conserver un contrôle humain avant toute utilisation professionnelle.</p></div></div></div>`);
  const aiSteps=[...document.querySelectorAll('.ai-flow-step')];aiSteps.forEach((item,index)=>{item.classList.add('advanced-reveal');item.style.setProperty('--advanced-delay',`${index*70}ms`)});
  if(reducedMotion){document.querySelector('.ai-flow-track')?.style.setProperty('--flow-progress','100%');aiSteps.forEach(item=>item.classList.add('is-visible','is-active'))}
  else if('IntersectionObserver'in window){const aiObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');aiObserver.unobserve(entry.target)}}),{threshold:.12});aiSteps.forEach(item=>aiObserver.observe(item))}
}

if(reducedMotion){const timeline=document.querySelector('.method-timeline');timeline?.style.setProperty('--timeline-progress','100%');timeline?.querySelectorAll('li').forEach(item=>item.classList.add('is-active'))}

// Démonstration juridique synchronisée avec le défilement de la page d'accueil.
const legalStory=document.querySelector('[data-legal-story]');
if(legalStory){
  const steps=[...legalStory.querySelectorAll('[data-story-step]')],stage=legalStory.querySelector('.legal-story-stage'),counter=legalStory.querySelector('[data-story-current]'),progress=legalStory.querySelector('.story-progress span');
  const activateStoryStep=index=>{
    const safeIndex=Math.max(0,Math.min(steps.length-1,index));
    steps.forEach((step,stepIndex)=>step.classList.toggle('is-active',stepIndex===safeIndex));
    stage.dataset.scene=String(safeIndex);
    counter.textContent=String(safeIndex+1).padStart(2,'0');
    progress.style.transform=`scaleX(${(safeIndex+1)/steps.length})`;
  };
  if(reducedMotion)activateStoryStep(steps.length-1);
  else{
    let storyFrame=false;
    const syncStory=()=>{
      const readingLine=innerHeight*.52;
      const closest=steps.reduce((best,step)=>{
        const rect=step.getBoundingClientRect(),distance=Math.abs(rect.top+rect.height*.5-readingLine);
        return !best||distance<best.distance?{step,distance}:best;
      },null);
      if(closest)activateStoryStep(Number(closest.step.dataset.storyStep));
      storyFrame=false;
    };
    const requestStorySync=()=>{if(!storyFrame){storyFrame=true;requestAnimationFrame(syncStory)}};
    addEventListener('scroll',requestStorySync,{passive:true});
    addEventListener('resize',requestStorySync,{passive:true});
    syncStory();
  }
}

// Recherche et filtres accessibles pour la bibliothèque de ressources.
if(path==='/ressources'){
  const grid=document.querySelector('.section.white .grid'),cards=grid?[...grid.querySelectorAll('.resource-card')]:[];
  if(grid&&cards.length){
    const categories=['Tous',...new Set(cards.map(card=>card.querySelector('.tag')?.textContent.trim()).filter(Boolean))];
    const tools=document.createElement('div');tools.className='resource-tools';
    tools.innerHTML=`<div class="resource-search"><label for="resource-search">Rechercher dans les articles</label><input id="resource-search" type="search" placeholder="Ex. permis, délibération, marché public…" autocomplete="off"></div><p class="resource-count" aria-live="polite"></p>`;
    const controls=document.createElement('div');controls.className='resource-filters';controls.setAttribute('aria-label','Filtrer les ressources');
    controls.innerHTML=categories.map((category,index)=>`<button class="resource-filter${index===0?' is-active':''}" type="button" data-filter="${category}" aria-pressed="${index===0}">${category}</button>`).join('');
    const order=document.createElement('p');order.className='resource-order';order.textContent='Articles classés du plus récent au plus ancien.';
    grid.before(tools,controls,order);
    const input=tools.querySelector('input'),count=tools.querySelector('.resource-count');let activeCategory='Tous';
    const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const update=()=>{const query=normalize(input.value.trim());let visible=0;cards.forEach(card=>{const category=card.querySelector('.tag')?.textContent.trim()||'';const matchesCategory=activeCategory==='Tous'||category===activeCategory;const matchesSearch=!query||normalize(card.textContent).includes(query);card.hidden=!(matchesCategory&&matchesSearch);if(!card.hidden)visible++});count.textContent=`${visible} article${visible>1?'s':''} affiché${visible>1?'s':''}`;let empty=grid.querySelector('.resource-empty');if(!visible){if(!empty){empty=document.createElement('p');empty.className='resource-empty';empty.textContent='Aucun article ne correspond à cette recherche.';grid.append(empty)}}else empty?.remove()};
    controls.addEventListener('click',event=>{const button=event.target.closest('.resource-filter');if(!button)return;activeCategory=button.dataset.filter;controls.querySelectorAll('.resource-filter').forEach(item=>{const active=item===button;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',String(active))});update()});
    input.addEventListener('input',update);update();
  }
}

// Toute la carte d'une ressource devient cliquable, tout en conservant le lien natif.
document.querySelectorAll('.resource-card').forEach(card=>{const link=card.querySelector('a[href]');if(!link)return;card.addEventListener('click',event=>{if(event.target.closest('a'))return;link.click()})});

// Progression de lecture et navigation entre les articles.
if(path.startsWith('/ressources/')&&path!=='/ressources'){
  document.body.insertAdjacentHTML('afterbegin','<div class="article-reading-progress" aria-hidden="true"></div>');
  const reading=document.querySelector('.article-reading-progress'),article=document.querySelector('.article');
  const updateReading=()=>{if(!article)return;const start=article.offsetTop-innerHeight*.2,total=Math.max(1,article.offsetHeight-innerHeight*.55),value=Math.max(0,Math.min(1,(scrollY-start)/total));reading.style.transform=`scaleX(${value})`};
  addEventListener('scroll',updateReading,{passive:true});addEventListener('resize',updateReading,{passive:true});updateReading();
  const slugs=Object.keys(articleImages),current=articleSlug(path),index=slugs.indexOf(current),previous=slugs[index-1],next=slugs[index+1];
  if(article&&(previous||next)){article.querySelector('.article-nav')?.insertAdjacentHTML('beforebegin',`<nav class="article-nav-rich" aria-label="Articles voisins">${previous?`<a href="/ressources/${previous}/"><small>Article précédent</small><strong>Consulter la ressource</strong></a>`:'<span></span>'}${next?`<a href="/ressources/${next}/"><small>Article suivant</small><strong>Consulter la ressource</strong></a>`:''}</nav>`)}
  const currentResource=resourceCatalog.find(item=>item.slug===current),related=resourceCatalog.filter(item=>item.slug!==current&&item.category===currentResource?.category).slice(0,3),anchor=article?.querySelector('.article-nav-rich,.article-nav');
  if(article&&anchor){anchor.insertAdjacentHTML('beforebegin',`<aside class="author-box"><img src="/images/jean-maxime-pautonnier.webp" alt="" width="74" height="74" loading="lazy" decoding="async"><div><h2>À propos de l'auteur</h2><p><strong>Jean-Maxime Pautonnier</strong>, juriste et formateur en droit des collectivités territoriales, en urbanisme et en usages de l'IA dans le secteur public, installé dans le Lot. <a href="/a-propos/">Découvrir mon parcours.</a></p></div></aside>${related.length?`<section class="related-resources" aria-labelledby="related-title"><h2 id="related-title">Articles liés</h2><div class="related-grid">${related.map(item=>`<a class="related-card" href="/ressources/${item.slug}/"><span>${item.category}</span><strong>${item.title}</strong></a>`).join('')}</div></section>`:''}`)}
}

// Transition courte entre les pages internes.
document.body.insertAdjacentHTML('beforeend','<div class="page-transition" aria-hidden="true"></div><button class="back-to-top" type="button" aria-label="Retour en haut">↑</button>');
const transitionLayer=document.querySelector('.page-transition'),backToTop=document.querySelector('.back-to-top');
document.addEventListener('click',event=>{const anchor=event.target.closest('a[href]');if(!anchor||event.defaultPrevented||event.button>0||event.metaKey||event.ctrlKey||event.shiftKey||anchor.target==='_blank')return;const href=anchor.getAttribute('href');if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:'))return;const destination=new URL(anchor.href,location.href);if(destination.origin!==location.origin||destination.href===location.href)return;if(reducedMotion)return;event.preventDefault();transitionLayer.classList.add('is-leaving');setTimeout(()=>location.href=destination.href,360)});
const updateBackToTop=()=>backToTop.classList.toggle('is-visible',scrollY>700);addEventListener('scroll',updateBackToTop,{passive:true});updateBackToTop();backToTop.addEventListener('click',()=>scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'}));
