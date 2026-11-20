/* Boot: check the server, then route between views by URL hash (#research, #trace?run=RUN-0001, ...). */
(function () {
  'use strict';
  const { api } = window.SSD;
  const views = window.SSD.views;
  const view = document.getElementById('view');
  const status = document.getElementById('server-status');

  function route() {
    const name = (location.hash.slice(1).split('?')[0]) || 'overview';
    const v = views[name] || views.overview;
    document.querySelectorAll('.sidenav a').forEach((a) => a.classList.toggle('active', a.dataset.view === (views[name] ? name : 'overview')));
    document.title = `${v.title} · Social Signal Discovery · Local Demo`;
    v.render(view);
    view.focus({ preventScroll: true });
  }

  async function checkServer() {
    try {
      const o = await api('GET', '/api/overview');
      window.SSD.state.overview = o;
      status.textContent = `Local server connected · provider: ${o.provider.name} · prompt v${o.systemPrompt.version}`;
      status.className = 'topbar-status ok';
      document.getElementById('provider-banner').textContent = `Classifier: ${o.provider.name}, deterministic word rules, not a language model. It does not interpret the system prompt like a real LLM.`;
    } catch (err) {
      status.textContent = `Local server not reachable: ${err.message}`;
      status.className = 'topbar-status bad';
    }
  }

  window.addEventListener('hashchange', route);
  checkServer();
  route();
})();
