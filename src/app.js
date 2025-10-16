import * as yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import state from './state.js';
import initView from './view.js';


const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  submitButton: document.querySelector('button[type="submit"]'),
  feedsContainer: document.querySelector('.feeds'),
  postsContainer: document.querySelector('.posts'),
};


const createSchema = (existingFeeds) => yup.object().shape({
  url: yup
    .string()
    .trim()
    .required('Не должно быть пустым')
    .url('Ссылка должна быть валидным URL')
    .test(
      'unique',
      'RSS уже существует',
      (value) => !existingFeeds.some(feed => feed.url === value)
    ),
});


const watchedState = initView(state, elements);


const addFeed = (url) => {
  const newFeed = {
    url,
    id: Date.now(),
    title: `Фид ${watchedState.feeds.length + 1}`,
    description: `Описание фида ${url}`,
  };
  
  watchedState.feeds.push(newFeed);
};


elements.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const url = formData.get('url').trim();
  
  watchedState.form.state = 'validating';
  watchedState.form.error = null;

  try {
    
    const schema = createSchema(watchedState.feeds);
    
    
    await schema.validate({ url }, { abortEarly: false });
    
    
    watchedState.form.state = 'success';
    watchedState.form.error = null;
    
    
    addFeed(url);
    
    console.log('✅ RSS успешно добавлен:', url);
    
  } catch (err) {
    watchedState.form.state = 'error';
    
    if (err.name === 'ValidationError') {
      watchedState.form.error = err.errors[0];
    } else {
      watchedState.form.error = 'Произошла ошибка при валидации';
    }
    
    console.error('❌ Ошибка валидации:', err.message);
  }
});


elements.input.addEventListener('input', () => {
  if (watchedState.form.state === 'error') {
    watchedState.form.state = 'filling';
    watchedState.form.error = null;
  }
});