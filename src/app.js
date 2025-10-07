import onChange from 'on-change';
import state from './state.js';

const watchedState = onChange(state, (path, value) => {
  console.log(`Изменилось свойство: ${path}`, value);
});

watchedState.form.state = 'validating'; 
watchedState.form.error = 'Некорректный URL';