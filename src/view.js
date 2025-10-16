const renderFeedback = (elements, error) => {
  const { feedback, input } = elements;
  
  if (error) {
    feedback.textContent = error;
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
  } else {
    feedback.textContent = '';
    feedback.classList.remove('text-danger');
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    
    
    setTimeout(() => {
      input.classList.remove('is-valid');
    }, 2000);
  }
};

const renderFormState = (elements, state) => {
  const { submitButton, input } = elements;
  
  switch (state) {
    case 'validating':
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Проверка...';
      break;
      
    case 'error':
      submitButton.disabled = false;
      submitButton.textContent = 'Добавить';
      input.focus();
      break;
      
    case 'success':
      submitButton.disabled = false;
      submitButton.textContent = 'Добавить';
      input.value = '';
      input.classList.remove('is-invalid', 'is-valid');
      input.focus();
      break;
      
    case 'filling':
    default:
      submitButton.disabled = false;
      submitButton.textContent = 'Добавить';
      break;
  }
};

const renderFeeds = (elements, feeds) => {
  const { feedsContainer } = elements;
  
  if (feeds.length === 0) {
    feedsContainer.innerHTML = '';
    return;
  }
  
  const feedsHTML = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Фиды</h5>
        <ul class="list-group list-group-flush">
          ${feeds.map(feed => `
            <li class="list-group-item d-flex justify-content-between align-items-start">
              <div class="ms-2 me-auto">
                <div class="fw-bold">${feed.title || feed.url}</div>
                ${feed.description || ''}
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
  
  feedsContainer.innerHTML = feedsHTML;
};

export default (state, elements) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.error':
      renderFeedback(elements, value);
      break;
      
    case 'form.state':
      renderFormState(elements, value);
      break;
      
    case 'feeds':
      renderFeeds(elements, value);
      break;
      
    default:
      break;
  }
});