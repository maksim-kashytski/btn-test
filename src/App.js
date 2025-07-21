import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import ConfirmDialog from './ConfirmDialog';

function App() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  // Минимальное расстояние для свайпа
  const minSwipeDistance = 50;

  useEffect(() => {
    // Определяем, является ли устройство мобильным
    const checkMobile = () => {
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(navigator.userAgent));
    };
    
    checkMobile();

    // Функция для обработки события beforeunload (закрытие вкладки/переход на другую страницу)
    // const handleBeforeUnload = (e) => {
    //   e.preventDefault();
    //   e.returnValue = 'Вы уверены, что хотите покинуть страницу?';
    //   return 'Вы уверены, что хотите покинуть страницу?';
    // };

    // Функция для обработки события popstate (кнопка назад/вперед)
    const handlePopState = (e) => {
      // Проверяем, есть ли история навигации
      if (window.history.length > 1) {
        e.preventDefault();
        setShowConfirmDialog(true);
        setPendingNavigation(() => () => {
          // Разрешаем навигацию назад
          window.history.back();
        });
      }
    };

    // Функция для обработки изменения URL
    const handleUrlChange = () => {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        setCurrentPath(newPath);
      }
    };

    // Функция для обработки видимости страницы (когда пользователь переключается между вкладками)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Страница стала невидимой - возможно пользователь переключился на другую вкладку
        console.log('Страница стала невидимой');
      }
    };

    // Функция для обработки фокуса/потери фокуса окна
    const handleWindowFocus = () => {
      console.log('Окно получило фокус');
    };

    const handleWindowBlur = () => {
      console.log('Окно потеряло фокус');
    };

    // Обработчики для мобильных жестов
    const onTouchStart = (e) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe) {
        // Свайп влево - попытка навигации назад
        console.log('Обнаружен свайп влево (назад)');
        if (window.history.length > 1) {
          setShowConfirmDialog(true);
          setPendingNavigation(() => () => {
            window.history.back();
          });
        }
      } else if (isRightSwipe) {
        // Свайп вправо - попытка навигации вперед
        console.log('Обнаружен свайп вправо (вперед)');
      }
    };

    // Добавляем обработчики событий
    // window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Добавляем обработчики для мобильных жестов
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('touchstart', onTouchStart);
      currentContainer.addEventListener('touchmove', onTouchMove);
      currentContainer.addEventListener('touchend', onTouchEnd);
    }

    // Слушаем изменения URL
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleUrlChange();
    };

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      handleUrlChange();
    };

    // Очистка обработчиков при размонтировании компонента
    return () => {
      // window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (currentContainer) {
        currentContainer.removeEventListener('touchstart', onTouchStart);
        currentContainer.removeEventListener('touchmove', onTouchMove);
        currentContainer.removeEventListener('touchend', onTouchEnd);
      }
      
      // Восстанавливаем оригинальные методы
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [currentPath, touchStart, touchEnd]);

  // Функция для подтверждения навигации
  const confirmNavigation = () => {
    setShowConfirmDialog(false);
    if (pendingNavigation) {
      pendingNavigation();
    }
  };

  // Функция для отмены навигации
  const cancelNavigation = () => {
    setShowConfirmDialog(false);
    setPendingNavigation(null);
    // Возвращаемся на текущую страницу
    window.history.pushState(null, '', window.location.href);
  };

  // Функция для тестирования навигации
  const testNavigation = () => {
    window.history.pushState({ test: true }, '', '/test-page');
  };

  // Функция для тестирования навигации назад
  const testBackNavigation = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      alert('Нет истории для навигации назад');
    }
  };

  // Функция для проверки возможности навигации назад
  const canGoBack = () => {
    return window.history.length > 1;
  };

  // Функция для открытия текущей страницы в новой вкладке
  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  // Функция для открытия PDF файла
  const openPdf = () => {
    window.open('https://www.orimi.com/pdf-test.pdf', '_blank');
  };

  return (
    <div className="App" ref={containerRef}>
      <header className="App-header">
        <h1>Тест подтверждения навигации</h1>
        <p>Текущий путь: {currentPath}</p>
        <p>История навигации: {window.history.length} записей</p>
        <p>Мобильное устройство: {isMobile ? 'Да' : 'Нет'}</p>
        
        <div className="button-container">
          <button 
            onClick={testNavigation}
            className="test-button"
          >
            Перейти на тестовую страницу
          </button>
          
          <button 
            onClick={testBackNavigation}
            className="test-button secondary"
            disabled={!canGoBack()}
          >
            Тест кнопки "Назад"
          </button>

          <button 
            onClick={openInNewTab}
            className="test-button"
            style={{ backgroundColor: '#28a745' }}
          >
            Открыть в новой вкладке
          </button>

          <button 
            onClick={openPdf}
            className="test-button"
            style={{ backgroundColor: '#dc3545' }}
          >
            Открыть PDF
          </button>
        </div>

        <div className="info">
          <p><strong>Инструкции для тестирования:</strong></p>
          <p>1. Нажмите "Перейти на тестовую страницу"</p>
          <p>2. Попробуйте нажать кнопку "Назад" в браузере</p>
          <p>3. Или используйте кнопку "Тест кнопки 'Назад'" выше</p>
          <p>4. Нажмите "Открыть в новой вкладке" для тестирования переключения между вкладками</p>
          <p>5. Нажмите "Открыть PDF" для тестирования перехода на внешний ресурс</p>
          <p>6. Попробуйте закрыть вкладку</p>
          {isMobile && (
            <>
              <p><strong>На мобильных устройствах:</strong></p>
              <p>• Попробуйте свайп влево (жест "назад")</p>
              <p>• Используйте кнопку "Назад" в браузере</p>
              <p><em>⚠️ Крестик (закрытие вкладки) не может быть обработан JavaScript</em></p>
            </>
          )}
        </div>

        <div className="debug-info">
          <p><strong>Отладочная информация:</strong></p>
          <p>User Agent: {navigator.userAgent}</p>
          <p>Платформа: {navigator.platform}</p>
          <p>Мобильное устройство: {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Да' : 'Нет'}</p>
          <p>Touch Events: {'ontouchstart' in window ? 'Поддерживаются' : 'Не поддерживаются'}</p>
          <p><strong>Ограничения:</strong></p>
          <p>• Крестик (закрытие вкладки) - не обрабатывается</p>
          <p>• Системные кнопки браузера - ограниченная поддержка</p>
          <p>• beforeunload работает только при переходе на другую страницу</p>
        </div>
      </header>

      {/* Модальное окно подтверждения */}
      <ConfirmDialog 
        open={showConfirmDialog}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </div>
  );
}

export default App;
