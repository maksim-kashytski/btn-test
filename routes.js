import React from 'react';

// Простые компоненты для тестирования
const Home = () => (
  <div style={{ padding: '20px' }}>
    <h1>Главная страница</h1>
    <p>Это главная страница приложения.</p>
    <button onClick={() => window.history.pushState(null, '', '/page1')}>
      Перейти на страницу 1
    </button>
    <button onClick={() => window.history.pushState(null, '', '/page2')}>
      Перейти на страницу 2
    </button>
  </div>
);

const Page1 = () => (
  <div style={{ padding: '20px' }}>
    <h1>Страница 1</h1>
    <p>Это страница 1.</p>
    <button onClick={() => window.history.pushState(null, '', '/page2')}>
      Перейти на страницу 2
    </button>
  </div>
);

const Page2 = () => (
  <div style={{ padding: '20px' }}>
    <h1>Страница 2</h1>
    <p>Это страница 2.</p>
    <button onClick={() => window.history.pushState(null, '', '/page1')}>
      Перейти на страницу 1
    </button>
  </div>
);

const Routes = () => {
  const path = window.location.pathname;
  
  switch (path) {
    case '/page1':
      return <Page1 />;
    case '/page2':
      return <Page2 />;
    default:
      return <Home />;
  }
};

export default Routes; 