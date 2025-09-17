// JS para popular cards e modais dinamicamente a partir do conteudo.json

async function carregarConteudo() {
  const response = await fetch('conteudo.json');
  const data = await response.json();

  // Header
  document.querySelector('#header-titulo').textContent = data.header.titulo;
  document.querySelector('#header-descricao').textContent = data.header.descricao;
  const botoes = document.querySelector('#header-botoes');
  botoes.innerHTML = '';
  data.header.botoes.forEach(btn => {
    const a = document.createElement('a');
    a.className = 'btn btn-primary my-2';
    a.href = btn.link;
    a.textContent = btn.texto;
    botoes.appendChild(a);
  });

  // Cards
  const grid = document.querySelector('#produtos-grid');
  grid.innerHTML = '';
  data.produtos.sort(() => Math.random() - 0.5).forEach(produto => {
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
  document.querySelector('#footer-texto').textContent = data.footer.texto;
  document.querySelector('#ano-corrente').textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', carregarConteudo);
