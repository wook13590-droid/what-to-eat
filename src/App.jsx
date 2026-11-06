
import { useEffect, useState } from 'react'
import './App.css'

const menus = {
  전체: [
    '김치찌개', '불고기', '비빔밥', '된장찌개', '제육볶음',
    '짜장면', '짬뽕', '마라탕', '탕수육', '마파두부',
    '초밥', '라멘', '돈카츠', '우동', '규동',
    '파스타', '피자', '스테이크', '리조또', '햄버거',
    '떡볶이', '김밥', '순대', '튀김', '라면',
  ],
  한식: ['김치찌개', '불고기', '비빔밥', '된장찌개', '제육볶음'],
  중식: ['짜장면', '짬뽕', '마라탕', '탕수육', '마파두부'],
  일식: ['초밥', '라멘', '돈카츠', '우동', '규동'],
  양식: ['파스타', '피자', '스테이크', '리조또', '햄버거'],
  분식: ['떡볶이', '김밥', '순대', '튀김', '라면'],
}

const defaultRouletteMenus = [
  '김치찌개', '마라탕', '초밥', '피자',
  '떡볶이', '파스타', '짜장면', '돈카츠',
  '햄버거', '불고기', '라멘', '김밥',
]

const wheelColors = ['#FFE34D', '#176BFF', '#B8D9FF', '#FFCA36']

function App() {
  const [mode, setMode] = useState('menu')
  const [category, setCategory] = useState('전체')
  const [result, setResult] = useState(null)
  const [animationKey, setAnimationKey] = useState(0)

  const [rouletteMode, setRouletteMode] = useState('random')
  const [customMenus, setCustomMenus] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('myFoodMenus')) || []
    } catch {
      return []
    }
  })
  const [inputMenu, setInputMenu] = useState('')

  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)

  useEffect(() => {
    localStorage.setItem('myFoodMenus', JSON.stringify(customMenus))
  }, [customMenus])

  const rouletteMenus =
    rouletteMode === 'random' ? defaultRouletteMenus : customMenus

  const sectorAngle = 360 / Math.max(rouletteMenus.length, 1)

  const wheelBackground = `conic-gradient(${rouletteMenus
    .map((_, index) => {
      const start = index * sectorAngle
      const end = (index + 1) * sectorAngle
      return `${wheelColors[index % wheelColors.length]} ${start}deg ${end}deg`
    })
    .join(', ')})`

  const recommendMenu = () => {
    const list = menus[category]
    const random = list[Math.floor(Math.random() * list.length)]
    setResult(random)
    setAnimationKey((prev) => prev + 1)
  }

  const addCustomMenu = (event) => {
    event.preventDefault()
    const newMenu = inputMenu.trim()

    if (!newMenu) return

    if (customMenus.includes(newMenu)) {
      alert('이미 추가된 메뉴예요!')
      return
    }

    setCustomMenus((prev) => [...prev, newMenu])
    setInputMenu('')
    setResult(null)
  }

  const removeCustomMenu = (menu) => {
    setCustomMenus((prev) => prev.filter((item) => item !== menu))
    setResult(null)
  }

  const spinRoulette = () => {
    if (spinning || rouletteMenus.length < 2) return

    const randomIndex = Math.floor(Math.random() * rouletteMenus.length)
    const selectedMenu = rouletteMenus[randomIndex]
    const selectedCenter = (randomIndex + 0.5) * sectorAngle

    const currentAngle = ((rotation % 360) + 360) % 360
    const extraAngle = (360 - selectedCenter - currentAngle + 360) % 360
    const nextRotation = rotation + 360 * 6 + extraAngle

    setResult(null)
    setSpinning(true)
    setRotation(nextRotation)

    window.setTimeout(() => {
      setResult(selectedMenu)
      setAnimationKey((prev) => prev + 1)
      setSpinning(false)
    }, 5300)
  }

  const changeMode = (nextMode) => {
    if (spinning) return
    setMode(nextMode)
    setResult(null)
  }

  const changeRouletteMode = (nextMode) => {
    if (spinning) return
    setRouletteMode(nextMode)
    setRotation(0)
    setResult(null)
  }

  return (
    <main className="container">
      <header className="header">
        <div className="header-deco">✦ FOOD RANDOM PICK ✦</div>
        <h1 className="main-logo">
          WHAT TO EAT<span>?</span>
        </h1>
        <p>오늘 뭐 먹지? 고민은 이제 그만!</p>
      </header>

      <nav className="mode-select">
        <button
          className={mode === 'menu' ? 'mode-btn selected' : 'mode-btn'}
          onClick={() => changeMode('menu')}
        >
          🍜 메뉴 추천
        </button>

        <button
          className={mode === 'roulette' ? 'mode-btn selected' : 'mode-btn'}
          onClick={() => changeMode('roulette')}
        >
          🎯 행운의 룰렛
        </button>
      </nav>

      {mode === 'menu' ? (
        <section className="recommend">
          <div className="sticker">✦ MENU PICK ✦</div>

          <h2>오늘은 무엇을 먹을까요?</h2>
          <p>먹고 싶은 음식 종류를 선택해 보세요!</p>

          <div className="categories">
            {Object.keys(menus).map((item) => (
              <button
                key={item}
                className={category === item ? 'active' : ''}
                onClick={() => {
                  setCategory(item)
                  setResult(null)
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div
            className={result ? 'result result-pop' : 'result'}
            key={animationKey}
          >
            {result ? (
              <>
                <span>✦ TODAY'S MENU ✦</span>
                <h3>{result}</h3>
                <p>오늘은 이 메뉴 어떠세요? 😋</p>
              </>
            ) : (
              <>
                <span>WHAT TO EAT?</span>
                <h3>오늘의 메뉴를 뽑아보세요!</h3>
                <p>버튼을 누르면 맛있는 메뉴가 나타나요.</p>
              </>
            )}
          </div>

          <button className="recommend-btn" onClick={recommendMenu}>
            {result ? '다시 추천받기 ↻' : '랜덤 메뉴 추천하기 !'}
          </button>
        </section>
      ) : (
        <section className="recommend roulette-section">
          <div className="sticker">✦ LUCKY ROULETTE ✦</div>

          <h2>오늘의 운명은?</h2>
          <p>룰렛에 오늘의 메뉴를 맡겨보세요!</p>

          <div className="roulette-modes">
            <button
              className={
                rouletteMode === 'random'
                  ? 'roulette-mode active'
                  : 'roulette-mode'
              }
              onClick={() => changeRouletteMode('random')}
              disabled={spinning}
            >
              🎲 랜덤 메뉴
            </button>

            <button
              className={
                rouletteMode === 'custom'
                  ? 'roulette-mode active'
                  : 'roulette-mode'
              }
              onClick={() => changeRouletteMode('custom')}
              disabled={spinning}
            >
              ✏️ 직접 메뉴 입력
            </button>
          </div>

          {rouletteMode === 'custom' && (
            <div className="custom-menu-box">
              <h3>MY MENU LIST</h3>
              <p>먹고 싶은 음식을 직접 추가해 보세요!</p>

              <form className="menu-input-form" onSubmit={addCustomMenu}>
                <input
                  value={inputMenu}
                  onChange={(event) => setInputMenu(event.target.value)}
                  placeholder="예: 치즈돈까스"
                  maxLength={15}
                  disabled={spinning}
                />

                <button type="submit" disabled={spinning}>
                  추가 +
                </button>
              </form>

              <div className="custom-menu-list">
                {customMenus.length > 0 ? (
                  customMenus.map((menu) => (
                    <div className="custom-menu-chip" key={menu}>
                      <span>{menu}</span>
                      <button
                        type="button"
                        onClick={() => removeCustomMenu(menu)}
                        disabled={spinning}
                        aria-label={`${menu} 삭제`}
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="empty-menu">
                    아직 메뉴가 없어요! 음식을 추가해 주세요 🍽️
                  </p>
                )}
              </div>

              <p className="menu-count">
                MY MENU <strong>{customMenus.length}</strong>개
              </p>
            </div>
          )}

          {rouletteMenus.length >= 2 ? (
            <div className="roulette-wrap">
              <div className="roulette-pointer">▼</div>

              <div
                className="roulette-wheel"
                style={{
                  background: wheelBackground,
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                {rouletteMenus.map((menu, index) => {
                  const angle = (index + 0.5) * sectorAngle
                  const x = 50 + 34 * Math.sin((angle * Math.PI) / 180)
                  const y = 50 - 34 * Math.cos((angle * Math.PI) / 180)

                  return (
                    <span
                      key={`${menu}-${index}`}
                      className={`wheel-label ${
                        index % 2 === 1 ? 'light-label' : ''
                      }`}
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                      }}
                    >
                      {menu}
                    </span>
                  )
                })}

                <div className="wheel-center">GO!</div>
              </div>
            </div>
          ) : (
            <div className="empty-wheel">
              <span>🎯</span>
              <strong>룰렛을 만들려면 메뉴가 2개 이상 필요해요!</strong>
              <p>먹고 싶은 메뉴를 두 가지 이상 추가해 주세요.</p>
            </div>
          )}

          <p className="roulette-hint">
            ✦ {rouletteMode === 'random'
              ? '준비된 12가지 메뉴 중 하나가 선택돼요!'
              : `내가 고른 ${rouletteMenus.length}가지 메뉴 중 하나가 선택돼요!`}
          </p>

          <button
            className="recommend-btn roulette-btn"
            onClick={spinRoulette}
            disabled={spinning || rouletteMenus.length < 2}
          >
            {spinning ? '룰렛 돌아가는 중... ✨' : '룰렛 돌리기 ! 🎯'}
          </button>
        </section>
      )}

      {/* 룰렛 당첨 팝업 */}
      {mode === 'roulette' && result && (
        <div className="popup-overlay">
          <div
            className="popup-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
          >
            <button
              className="popup-close"
              onClick={() => setResult(null)}
              aria-label="팝업 닫기"
            >
              ×
            </button>

            <div className="popup-confetti">🎉 ✨ 🎊</div>

            <span className="popup-subtitle">
              TODAY'S LUCKY MENU
            </span>

            <h2 id="popup-title">오늘의 당첨 메뉴!</h2>

            <div className="popup-menu">
              {result}
            </div>

            <p>오늘은 이 메뉴로 결정! 맛있게 드세요 😋</p>

            <button
              className="popup-again"
              onClick={spinRoulette}
            >
              한 번 더 돌리기 ↻
            </button>

            <button
              className="popup-close-text"
              onClick={() => setResult(null)}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      <footer>
        <p>✦ WHAT TO EAT? © 2026 ✦</p>
      </footer>
    </main>
  )
}

export default App
