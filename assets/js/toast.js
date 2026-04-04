(function () {
  function ensureToastStack() {
    const existingStack = document.getElementById('toast-stack');
    if (existingStack) {
      return existingStack;
    }

    const region = document.createElement('div');
    region.id = 'toast-region';
    region.className = 'toast-region';
    region.setAttribute('role', 'region');
    region.setAttribute('aria-label', 'Notificaciones');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');

    const stack = document.createElement('div');
    stack.id = 'toast-stack';
    stack.className = 'toast-stack';

    region.appendChild(stack);
    document.body.appendChild(region);
    return stack;
  }

  const toastStack = ensureToastStack();

  const iconByType = {
    success: 'check_circle',
    warning: 'warning',
    error: 'error'
  };

  function dismissToast(toast, immediate) {
    if (!toast || !toast.parentElement) {
      return;
    }

    if (immediate) {
      toast.remove();
      return;
    }

    toast.classList.add('toast--leaving');
    toast.addEventListener(
      'animationend',
      function () {
        toast.remove();
      },
      { once: true }
    );
  }

  function showToast(type, message, duration) {
    const tone = iconByType[type] ? type : 'success';
    const toast = document.createElement('div');
    toast.className = 'toast toast--' + tone;
    toast.setAttribute('role', tone === 'error' ? 'alert' : 'status');

    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined text-[18px]';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = iconByType[tone];

    const text = document.createElement('p');
    text.className = 'toast__message';
    text.textContent = message;

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'toast__close';
    close.setAttribute('aria-label', 'Cerrar notificación');
    close.innerHTML = '<span aria-hidden="true" class="material-symbols-outlined text-[18px]">close</span>';
    close.addEventListener('click', function () {
      dismissToast(toast, false);
    });

    toast.appendChild(icon);
    toast.appendChild(text);
    toast.appendChild(close);

    const activeToasts = toastStack.querySelectorAll('.toast');
    if (activeToasts.length >= 3) {
      dismissToast(activeToasts[0], true);
    }

    toastStack.appendChild(toast);
    window.setTimeout(function () {
      dismissToast(toast, false);
    }, typeof duration === 'number' ? duration : 4000);
  }

  function getFavoriteState(button) {
    const icon = button.querySelector('.material-symbols-outlined');
    return icon && icon.textContent.trim() === 'favorite';
  }

  function toggleFavorite(button) {
    const icon = button.querySelector('.material-symbols-outlined');
    const isFavorite = getFavoriteState(button);

    if (icon) {
      icon.textContent = isFavorite ? 'favorite_border' : 'favorite';
    }

    showToast(
      'success',
      isFavorite
        ? 'Has quitado este punto de tus favoritos.'
        : 'Punto guardado en tus favoritos.'
    );
  }

  document.querySelectorAll('.btn-favorite').forEach(function (button) {
    button.addEventListener('click', function () {
      toggleFavorite(button);
    });
  });

  document.querySelectorAll('input[aria-label*="Buscar"]').forEach(function (input) {
    input.addEventListener('keydown', function (event) {
      if (input.hasAttribute('data-search-input')) {
        return;
      }

      if (event.key !== 'Enter') {
        return;
      }

      const query = input.value.trim();
      if (query.length < 2) {
        showToast('warning', 'Escribe al menos 2 caracteres para buscar.');
        return;
      }

      showToast('warning', 'No hemos encontrado puntos para "' + query + '".');
    });
  });

  document.querySelectorAll('[data-toast-error]').forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const message =
        button.getAttribute('data-toast-error') ||
        'Ha ocurrido un error al completar la acción.';
      showToast('error', message, 4000);
    });
  });

  window.reciclacadToast = {
    show: showToast
  };
})();
