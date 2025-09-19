// JS para popular cards e modais dinamicamente a partir do conteudo.json


async function carregarConteudo() {
  const response = await fetch('conteudo.json');
  const data = await response.json();

  // Header
  document.querySelector('#header-titulo').textContent = data.header.titulo;
  document.querySelector('#header-descricao').textContent = data.header.descricao;
  // Renderiza CTA secundário se existir e posiciona features entre descrição e CTA
  let ctaEl = document.querySelector('#header-cta');
  if (!ctaEl) {
    ctaEl = document.createElement('div');
    ctaEl.id = 'header-cta';
    ctaEl.className = 'small text-secondary mb-3';
    document.querySelector('#header-descricao').after(ctaEl);
  }
  // Inserir linha de features com ícones de check logo antes do CTA
  let featuresEl = document.querySelector('#header-features');
  if (!featuresEl) {
    featuresEl = document.createElement('div');
    featuresEl.id = 'header-features';
    featuresEl.className = 'small text-secondary mb-2';
  }
  const checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#198754" viewBox="0 0 16 16" style="margin-right:4px;">\n  <path d="M13.485 1.929a.75.75 0 0 1 1.06 1.06l-8 8a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06L6 9.439l7.485-7.51z"/>\n</svg>';
  const features = Array.isArray(data.header.features) ? data.header.features : [];
  featuresEl.innerHTML = features.map(f => `${checkIcon}<span class="me-3">${f}</span>`).join('');
  // Garante a ordem: título -> descrição -> features -> CTA
  ctaEl.before(featuresEl);
  ctaEl.textContent = data.header.cta || '';
  const botoes = document.querySelector('#header-botoes');
  botoes.innerHTML = '';
  data.header.botoes.forEach(btn => {
    const a = document.createElement('a');
    // Detecta botão WhatsApp pelo texto ou link
    if (btn.texto.toLowerCase().includes('whatsapp') || btn.link.includes('wa.me')) {
      a.className = 'btn my-2 btn-success d-flex align-items-center gap-2';
      a.href = btn.link;
      a.target = '_blank';
      a.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.956 7.956 0 0 0 8.002.001C3.582.001.001 3.582.001 8c0 1.409.368 2.781 1.064 3.991L.06 15.925l4.06-1.064A7.96 7.96 0 0 0 8.002 16c4.418 0 7.999-3.581 7.999-7.999a7.96 7.96 0 0 0-2.4-5.675zM8.002 14.545a6.52 6.52 0 0 1-3.356-.92l-.24-.143-2.406.632.646-2.345-.156-.241A6.52 6.52 0 0 1 1.457 8c0-3.604 2.94-6.544 6.545-6.544 1.747 0 3.389.682 4.625 1.92a6.52 6.52 0 0 1 1.92 4.624c0 3.605-2.94 6.545-6.545 6.545zm3.688-4.927c-.202-.101-1.195-.59-1.38-.658-.185-.067-.32-.101-.454.101-.134.202-.52.658-.638.793-.117.134-.235.151-.437.05-.202-.101-.853-.314-1.626-.998-.601-.535-1.008-1.197-1.127-1.399-.118-.202-.013-.311.088-.412.09-.089.202-.235.303-.352.101-.117.134-.202.202-.336.067-.134.034-.252-.017-.353-.05-.101-.454-1.096-.622-1.501-.164-.395-.331-.341-.454-.347-.117-.005-.252-.006-.387-.006a.747.747 0 0 0-.542.252c-.185.202-.707.692-.707 1.688 0 .995.723 1.957.823 2.093.101.134 1.425 2.176 3.457 2.963.484.166.861.265 1.156.34.485.123.927.106 1.276.064.389-.047 1.195-.489 1.364-.96.168-.471.168-.874.118-.96-.05-.085-.185-.134-.387-.235z"/>
        </svg>
        <span>WhatsApp</span>
      `;
    } else {
      a.className = 'btn btn-primary my-2';
      a.href = btn.link;
      a.textContent = btn.texto;
    }
    botoes.appendChild(a);
  });

  // Navbar de tags dinâmicas
  const tagsSet = new Set();
  data.produtos.forEach(produto => {
    produto.badges.forEach(tag => tagsSet.add(tag));
  });
  const tags = Array.from(tagsSet);
  const tagsNavbarList = document.getElementById('tags-navbar-list');
  tagsNavbarList.innerHTML = '';
  // Botão "Todos"
  const liTodos = document.createElement('li');
  liTodos.className = 'nav-item';
  liTodos.innerHTML = '<button class="btn btn-outline-primary rounded-pill mx-1 active">Todos</button>';
  tagsNavbarList.appendChild(liTodos);
  // Botões de tags
  tags.forEach(tag => {
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.innerHTML = `<button class="btn btn-outline-primary rounded-pill mx-1">${tag}</button>`;
    tagsNavbarList.appendChild(li);
  });


  // Função para embaralhar array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Função para renderizar cards filtrados
  function renderizarCards(produtos) {
    const grid = document.querySelector('#produtos-grid');
    grid.innerHTML = '';
    // Embaralha os produtos antes de renderizar
    const produtosAleatorios = shuffleArray([...produtos]);
    produtosAleatorios.forEach(produto => {
      const col = document.createElement('div');
      col.className = 'col';
      col.innerHTML = `
        <div class="card shadow-sm">
          <img src="${produto.imagem}" class="card-img-top img-modal-trigger" alt="${produto.titulo}" style="height:225px;object-fit:cover;cursor:pointer;" data-bs-toggle="modal" data-bs-target="#modalCard${produto.id}">
          <div class="card-body">
            <h5 class="card-title">${produto.titulo}</h5>
            <p class="card-text">${produto.descricao}</p>
            <table class="table table-hover table-sm mb-3 card-pricing" aria-label="Tabela de preços ${produto.titulo}">
              <thead>
                <tr class="bg-light text-secondary small">
                  <th scope="col">Qtd</th>
                  <th scope="col">Preço (un.)</th>
                </tr>
              </thead>
              <tbody>
                ${produto.precos.map(p => `<tr><td class='fw-light text-secondary small'>${p.qtd}</td><td class='fw-light text-secondary small'>${p.valor}</td></tr>`).join('')}
              </tbody>
            </table>
            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
                <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#modalCard${produto.id}">VER MAIS</button>
              </div>
              <div class="ms-auto">
                ${produto.badges.map(b => `<span class="badge bg-light text-dark ms-1">${b}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(col);
    });
  }

  // Renderizar todos os cards inicialmente
  renderizarCards(data.produtos);

  // Adicionar evento de filtro aos botões
  tagsNavbarList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      tagsNavbarList.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.textContent.trim();
      if (tag === 'Todos') {
        renderizarCards(data.produtos);
      } else {
        renderizarCards(data.produtos.filter(p => p.badges.includes(tag)));
      }
    });
  });

  // Modais
  const modaisContainer = document.querySelector('#modais-container');
  modaisContainer.innerHTML = '';
  data.produtos.forEach(produto => {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = `modalCard${produto.id}`;
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', `modalCard${produto.id}Label`);
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content modal-transparent">
          <button type="button" class="btn-close modal-close-btn" data-bs-dismiss="modal" aria-label="Fechar"></button>
          <div class="modal-body p-0">
            <div id="carouselCard${produto.id}" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">
                ${produto.modal.imagens.map((img, idx) => `
                  <div class="carousel-item${idx === 0 ? ' active' : ''}">
                    <img src="${img}" class="d-block w-100" alt="${produto.titulo} ${idx+1}">
                    <div class="carousel-caption d-block pb-2">
                      <h5 class="bg-dark bg-opacity-50 rounded-2 px-3 py-1 d-inline-block text-light small">${produto.modal.titulo}</h5>
                    </div>
                  </div>
                `).join('')}
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carouselCard${produto.id}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Anterior</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carouselCard${produto.id}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Próximo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    modaisContainer.appendChild(modal);
  });

  // Footer
  const footerTexto = document.querySelector('#footer-texto');
  if (footerTexto) {
    footerTexto.textContent = data.footer.texto;
  }
  const anoCorrente = document.querySelector('#ano-corrente');
  if (anoCorrente) {
    anoCorrente.textContent = new Date().getFullYear();
  }
}

document.addEventListener('DOMContentLoaded', carregarConteudo);
