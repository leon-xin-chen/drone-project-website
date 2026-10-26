(function(){
  var root=document.documentElement;

  // ---------- theme ----------
  var tb=document.getElementById('themeBtn');
  function cur(){
    return root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  }

  tb.addEventListener('click',function(){
    root.setAttribute('data-theme', cur()==='dark'?'light':'dark');
  });


  // ---------- mobile menu ----------
  var sb=document.getElementById('sidebar'),
      scrim=document.getElementById('scrim'),
      mb=document.getElementById('menuBtn');

  function openNav(o){
    sb.classList.toggle('open',o);
    scrim.classList.toggle('show',o);
    mb.setAttribute('aria-expanded',o);
  }

  mb.addEventListener('click',function(){
    openNav(!sb.classList.contains('open'));
  });

  scrim.addEventListener('click',function(){
    openNav(false);
  });


  // ---------- build nav + load sections ----------
  var navRoot=document.getElementById('navSections');
  var mainRoot=document.getElementById('sections-root');

  fetch('sections.json')
    .then(function(r){
      return r.json();
    })
    .then(function(config){

      // sidebar nav, grouped by "group"
      var lastGroup=null;

      config.forEach(function(entry){

        if(entry.group!==lastGroup){
          var head=document.createElement('div');
          head.className='nav-head';
          head.textContent=entry.group;
          navRoot.appendChild(head);
          lastGroup=entry.group;
        }

        var a=document.createElement('a');
        a.className='nav-link';
        a.href='#'+entry.id;
        a.innerHTML='<span class="num">'+entry.num+'</span> '+entry.label;

        navRoot.appendChild(a);
      });


      // fetch every section partial, keep them in order
      return Promise.all(
        config.map(function(entry){
          return fetch('sections/'+entry.file)
            .then(function(r){
              return r.text();
            });
        })
      );
    })
    .then(function(htmlPieces){

      mainRoot.innerHTML=htmlPieces.join('\n');

      // ---------- initialize collapse ----------
      initCollapse();

      // ---------- initialize scrollspy ----------
      initScrollspy();

      // if the page was opened with a #hash,
      // jump to it now that content exists
      if(location.hash){
        var target=document.querySelector(location.hash);

        if(target){
          target.scrollIntoView();
        }
      }
    });


  // ---------- section collapse ----------
  function initCollapse(){

    var sections=document.querySelectorAll(
      '#sections-root section'
    );

    sections.forEach(function(section){

      // avoid adding the button twice
      if(section.querySelector('.collapse-btn')) return;

      var title=section.querySelector('.sec-title');

      // if this section doesn't have a title,
      // don't add a collapse button
      if(!title) return;


      // create button
      var btn=document.createElement('button');

      btn.className='collapse-btn';
      btn.type='button';

      btn.setAttribute('aria-expanded','true');
      btn.innerHTML='−';


      // create title + button container
      var header=document.createElement('div');

      header.className='section-header';


      // put header before title
      title.parentNode.insertBefore(header,title);


      // move title into header
      header.appendChild(title);

      // add button
      header.appendChild(btn);


      // button click
      btn.addEventListener('click',function(e){

        e.stopPropagation();

        var collapsed=
          section.classList.toggle('collapsed');

        btn.setAttribute(
          'aria-expanded',
          !collapsed
        );

        btn.innerHTML=
          collapsed ? '+' : '−';
      });

    });
  }


  // ---------- scrollspy ----------
  function initScrollspy(){

    var links=[].slice.call(
      document.querySelectorAll('.nav-link')
    );

    var secs=links
      .map(function(l){
        return document.querySelector(
          l.getAttribute('href')
        );
      })
      .filter(Boolean);

    var bar=document.getElementById('progBar');


    function onScroll(){

      var y=window.scrollY+90,
          active=null;

      for(var i=0;i<secs.length;i++){

        if(secs[i].offsetTop<=y){
          active=i;
        }
      }

      links.forEach(function(l,i){

        l.classList.toggle(
          'active',
          i===active
        );

      });


      var h=document.body.scrollHeight-window.innerHeight;

      if(bar){
        bar.style.width=
          Math.max(
            0,
            Math.min(
              100,
              (window.scrollY/h)*100
            )
          )+'%';
      }
    }


    links.forEach(function(l){

      l.addEventListener('click',function(){

        if(window.innerWidth<1024){
          openNav(false);
        }

      });

    });


    window.addEventListener(
      'scroll',
      onScroll,
      {passive:true}
    );

    window.addEventListener(
      'resize',
      onScroll
    );

    onScroll();
  }

})();
