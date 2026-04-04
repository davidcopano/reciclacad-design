(function () {
  var mockPoints = [
    { id: 'p1', address: 'Av. Ana de Viya, 12', distance: 250, typeClass: 'bg-primary-container' },
    { id: 'p2', address: 'Plaza de las Flores, 3', distance: 400, typeClass: 'bg-secondary-container' },
    { id: 'p3', address: 'Calle Columela, 18', distance: 600, typeClass: 'bg-tertiary-container' },
    { id: 'p4', address: 'Paseo Maritimo, 45', distance: 850, typeClass: 'bg-primary-container' },
    { id: 'p5', address: 'Calle Sagasta, 9', distance: 900, typeClass: 'bg-secondary-container' },
    { id: 'p6', address: 'Av. Portugal, 33', distance: 1100, typeClass: 'bg-tertiary-container' }
  ];

  var states = ['typing', 'results', 'empty', 'error'];
  var roots = [];
  var inputs = [];
  var uiByInput = new WeakMap();

  function buildPanel() {
    var panel = document.createElement('section');
    panel.className = 'search-results-panel';
    panel.setAttribute('data-visible', 'false');
    panel.setAttribute('aria-live', 'polite');
    panel.setAttribute('aria-label', 'Resultados de busqueda');

    var typing = document.createElement('div');
    typing.className = 'search-results-state';
    typing.dataset.state = 'typing';
    typing.innerHTML = '<div class="search-skeleton-wrap"><div class="search-skeleton"></div><div class="search-skeleton"></div></div>';

    var results = document.createElement('div');
    results.className = 'search-results-state';
    results.dataset.state = 'results';
    results.innerHTML =
      '<div class="search-results-header"><span data-count>0</span> resultados</div>' +
      '<div class="search-results-list" data-list></div>';

    var empty = document.createElement('div');
    empty.className = 'search-results-state';
    empty.dataset.state = 'empty';
    empty.innerHTML =
      '<div class="search-empty">No encontramos puntos para <strong data-query></strong>.</div>';

    var error = document.createElement('div');
    error.className = 'search-results-state';
    error.dataset.state = 'error';
    error.innerHTML =
      '<div class="search-error">No se pudo completar la busqueda ahora. Intentalo en unos minutos.</div>';

    panel.appendChild(typing);
    panel.appendChild(results);
    panel.appendChild(empty);
    panel.appendChild(error);

    return panel;
  }

  function activateState(ui, stateName) {
    states.forEach(function (state) {
      var node = ui.panel.querySelector('[data-state="' + state + '"]');
      if (!node) {
        return;
      }
      node.dataset.active = state === stateName ? 'true' : 'false';
    });
  }

  function setVisible(ui, visible) {
    ui.panel.dataset.visible = visible ? 'true' : 'false';
    ui.input.setAttribute('aria-expanded', visible ? 'true' : 'false');
  }

  function renderResults(ui, items) {
    var list = ui.panel.querySelector('[data-list]');
    var count = ui.panel.querySelector('[data-count]');

    if (!list || !count) {
      return;
    }

    count.textContent = String(items.length);
    list.innerHTML = '';

    items.forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'search-result-item';
      button.setAttribute('aria-label', item.address + ' a ' + item.distance + ' metros');
      button.innerHTML =
        '<div class="flex items-center justify-between gap-3">' +
        '  <div class="flex items-center gap-3 min-w-0">' +
        '    <div class="w-2.5 h-2.5 rounded-full flex-shrink-0 ' + item.typeClass + '"></div>' +
        '    <div class="min-w-0">' +
        '      <div class="text-[13px] font-medium text-on-surface truncate">' + item.address + '</div>' +
        '      <div class="text-[11px] text-outline">A ' + item.distance + 'm de ti</div>' +
        '    </div>' +
        '  </div>' +
        '  <span class="material-symbols-outlined text-outline-variant text-[18px]" aria-hidden="true">favorite</span>' +
        '</div>';

      button.addEventListener('click', function () {
        if (window.reciclacadToast && typeof window.reciclacadToast.show === 'function') {
          window.reciclacadToast.show('success', 'Vista previa: seleccionaste ' + item.address + '.');
        }
        setVisible(ui, false);
      });

      list.appendChild(button);
    });
  }

  function applyQuery(ui, query) {
    if (!query) {
      setVisible(ui, false);
      return;
    }

    if (query.toLowerCase() === 'error') {
      setVisible(ui, true);
      activateState(ui, 'error');
      return;
    }

    if (query.length < 2) {
      setVisible(ui, true);
      activateState(ui, 'typing');
      return;
    }

    var filtered = mockPoints.filter(function (point) {
      return point.address.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });

    setVisible(ui, true);

    if (!filtered.length) {
      var querySlot = ui.panel.querySelector('[data-query]');
      if (querySlot) {
        querySlot.textContent = '"' + query + '"';
      }
      activateState(ui, 'empty');
      return;
    }

    renderResults(ui, filtered.slice(0, 5));
    activateState(ui, 'results');
  }

  function syncAllInputs(current, value) {
    inputs.forEach(function (input) {
      if (input !== current && input.value !== value) {
        input.value = value;
      }
      var ui = uiByInput.get(input);
      if (ui) {
        applyQuery(ui, value.trim());
      }
    });
  }

  function initRoot(root, index) {
    var input = root.querySelector('[data-search-input]');
    if (!input) {
      return;
    }

    var panel = buildPanel();
    var panelId = 'search-results-' + index;
    panel.id = panelId;
    input.setAttribute('aria-controls', panelId);
    root.appendChild(panel);

    var ui = { root: root, input: input, panel: panel };
    uiByInput.set(input, ui);

    input.addEventListener('input', function () {
      var query = input.value.trim();
      applyQuery(ui, query);
      syncAllInputs(input, query);
    });

    input.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        setVisible(ui, false);
      }
    });

    input.addEventListener('focus', function () {
      if (input.value.trim()) {
        applyQuery(ui, input.value.trim());
      }
    });

    roots.push(root);
    inputs.push(input);
  }

  document.addEventListener('click', function (event) {
    roots.forEach(function (root) {
      if (root.contains(event.target)) {
        return;
      }
      var input = root.querySelector('[data-search-input]');
      if (!input) {
        return;
      }
      var ui = uiByInput.get(input);
      if (ui) {
        setVisible(ui, false);
      }
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    var searchRoots = document.querySelectorAll('[data-search-root]');
    searchRoots.forEach(function (root, index) {
      initRoot(root, index + 1);
    });
  });
})();
