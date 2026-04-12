(function () {
  var mockPoints = [
    {
      id: 'p1',
      address: 'Av. Ana de Viya, 12',
      distance: 250,
      typeClass: 'bg-primary-container',
      typeLabel: 'Vidrio',
      detailTypeToneClass: 'bg-primary-container/20 text-on-primary-container'
    },
    {
      id: 'p2',
      address: 'Plaza de las Flores, 3',
      distance: 400,
      typeClass: 'bg-secondary-container',
      typeLabel: 'Papel',
      detailTypeToneClass: 'bg-secondary-container/20 text-on-secondary-container'
    },
    {
      id: 'p3',
      address: 'Calle Columela, 18',
      distance: 600,
      typeClass: 'bg-tertiary-container',
      typeLabel: 'Envases',
      detailTypeToneClass: 'bg-tertiary-container/20 text-on-tertiary-container'
    },
    {
      id: 'p4',
      address: 'Paseo Marítimo, 45',
      distance: 850,
      typeClass: 'bg-primary-container',
      typeLabel: 'Vidrio',
      detailTypeToneClass: 'bg-primary-container/20 text-on-primary-container'
    },
    {
      id: 'p5',
      address: 'Calle Sagasta, 9',
      distance: 900,
      typeClass: 'bg-secondary-container',
      typeLabel: 'Papel',
      detailTypeToneClass: 'bg-secondary-container/20 text-on-secondary-container'
    },
    {
      id: 'p6',
      address: 'Av. Portugal, 33',
      distance: 1100,
      typeClass: 'bg-tertiary-container',
      typeLabel: 'Envases',
      detailTypeToneClass: 'bg-tertiary-container/20 text-on-tertiary-container'
    }
  ];

  var states = ['typing', 'results', 'empty', 'error'];
  var roots = [];
  var inputs = [];
  var uiByInput = new WeakMap();
  var selectedPointId = null;

  var detailAddressNode = null;
  var detailDistanceNode = null;
  var detailTypeNode = null;
  var listButtons = [];
  var markerButtons = [];

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function getPointById(pointId) {
    return mockPoints.find(function (point) {
      return point.id === pointId;
    }) || null;
  }

  function syncPointCollections() {
    listButtons = Array.prototype.slice.call(document.querySelectorAll('[data-point-item][data-point-id]'));
    markerButtons = Array.prototype.slice.call(document.querySelectorAll('[data-point-marker][data-point-id]'));
  }

  function updateDetailCard(point) {
    if (!point) {
      return;
    }

    if (detailAddressNode) {
      detailAddressNode.textContent = point.address;
    }

    if (detailDistanceNode) {
      detailDistanceNode.textContent = 'A ' + point.distance + ' metros de ti';
    }

    if (detailTypeNode) {
      detailTypeNode.textContent = point.typeLabel;
      // keep base classes — color/tone handled by CSS via data-type attribute
      detailTypeNode.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider';
      // normalize type label to a simple key (e.g., 'Vidrio' -> 'vidrio')
      var typeKey = String(point.typeLabel || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '');
      detailTypeNode.setAttribute('data-type', typeKey);
    }
  }

  function applyPointSelection(pointId, options) {
    var opts = options || {};
    var source = opts.source || 'unknown';
    var point = getPointById(pointId);

    if (!point) {
      return;
    }

    selectedPointId = pointId;

    listButtons.forEach(function (button) {
      var isSelected = button.dataset.pointId === pointId;
      button.dataset.selected = isSelected ? 'true' : 'false';
      button.setAttribute('aria-selected', isSelected ? 'true' : 'false');

      if (isSelected && source === 'map') {
        button.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      }
    });

    markerButtons.forEach(function (button) {
      var isSelected = button.dataset.pointId === pointId;
      var markerPoint = getPointById(button.dataset.pointId);
      button.dataset.selected = isSelected ? 'true' : 'false';
      button.setAttribute('aria-pressed', isSelected ? 'true' : 'false');

      if (markerPoint) {
        // Keep aria-label for screen reader clarity; don't render visible text above marker.
        button.setAttribute(
          'aria-label',
          'Punto de reciclaje en ' + markerPoint.address + (isSelected ? ' (seleccionado)' : '')
        );
      }
    });

    updateDetailCard(point);
  }

  function selectPoint(pointId, options) {
    if (!pointId) {
      return;
    }

    applyPointSelection(pointId, options);
  }

  function getSelectedPointId() {
    return selectedPointId;
  }

  function initPointSelection() {
    syncPointCollections();

    if (!listButtons.length && !markerButtons.length) {
      return;
    }

    detailAddressNode = document.querySelector('[data-point-detail-address]');
    detailDistanceNode = document.querySelector('[data-point-detail-distance]');
    detailTypeNode = document.querySelector('[data-point-detail-type]');

    document.addEventListener('click', function (event) {
      var listButton = event.target.closest('[data-point-item][data-point-id]');
      if (listButton) {
        selectPoint(listButton.dataset.pointId, { source: 'list' });
        return;
      }

      var markerButton = event.target.closest('[data-point-marker][data-point-id]');
      if (markerButton) {
        selectPoint(markerButton.dataset.pointId, { source: 'map' });
      }
    });

    var initialNode =
      document.querySelector('[data-point-item][data-selected="true"]') ||
      document.querySelector('[data-point-marker][data-selected="true"]') ||
      listButtons[0] ||
      markerButtons[0];

    if (initialNode && initialNode.dataset.pointId) {
      applyPointSelection(initialNode.dataset.pointId, { source: 'init' });
    }

    window.reciclacadPoints = {
      select: selectPoint,
      getSelectedPointId: getSelectedPointId
    };
  }

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

  function isResultsStateActive(ui) {
    var resultsState = ui.panel.querySelector('[data-state="results"]');
    return resultsState && resultsState.dataset.active === 'true';
  }

  function getResultButtons(ui) {
    var list = ui.panel.querySelector('[data-list]');
    if (!list) {
      return [];
    }

    return Array.prototype.slice.call(list.querySelectorAll('.search-result-item'));
  }

  function focusResult(ui, index) {
    var buttons = getResultButtons(ui);
    if (!buttons.length) {
      return;
    }

    var boundedIndex = index;
    if (boundedIndex < 0) {
      boundedIndex = buttons.length - 1;
    }
    if (boundedIndex >= buttons.length) {
      boundedIndex = 0;
    }

    buttons[boundedIndex].focus();
  }

  function handleResultKeydown(ui, event, button) {
    var buttons = getResultButtons(ui);
    var currentIndex = buttons.indexOf(button);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusResult(ui, currentIndex + 1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusResult(ui, currentIndex - 1);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setVisible(ui, false);
      ui.input.focus();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      button.click();
    }
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
      button.dataset.pointId = item.id;
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
        selectPoint(item.id, { source: 'search' });
        if (window.reciclacadToast && typeof window.reciclacadToast.show === 'function') {
          window.reciclacadToast.show('success', 'Mostrando punto: ' + item.address + '.');
        }
        setVisible(ui, false);
      });

      button.addEventListener('keydown', function (event) {
        handleResultKeydown(ui, event, button);
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

    var normalizedQuery = normalizeText(query);
    var filtered = mockPoints.filter(function (point) {
      return normalizeText(point.address).indexOf(normalizedQuery) !== -1;
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
        return;
      }

      if (!isResultsStateActive(ui) || ui.panel.dataset.visible !== 'true') {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        focusResult(ui, 0);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        focusResult(ui, -1);
        return;
      }

      if (event.key === 'Enter') {
        var buttons = getResultButtons(ui);
        if (buttons.length) {
          event.preventDefault();
          buttons[0].click();
        }
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
    initPointSelection();

    var searchRoots = document.querySelectorAll('[data-search-root]');
    searchRoots.forEach(function (root, index) {
      initRoot(root, index + 1);
    });
  });
})();
