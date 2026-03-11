# 🛠️ SKILL: Система ограничений крафта по нациям (Nations Crafting System)

**Версия:** 1.0  
**Дата создания:** 11 марта 2026  
**Минимальная версия MC:** 1.20.1  
**Build система:** Forge 1.20.1

---

## 📋 Оглавление

1. [Архитектура системы](#архитектура-системы)
2. [Компоненты и их роль](#компоненты-и-их-роль)
3. [Особенности KubeJS](#особенности-kubejs)
4. [Workflow разработки](#workflow-разработки)
5. [Синхронизация с репозиторием](#синхронизация-с-репозиторием)
6. [Типичные ошибки](#типичные-ошибки)
7. [Примеры кода](#примеры-кода)
8. [Проверочный лист](#проверочный-лист)

---

## Архитектура системы

### Диаграмма взаимодействия

```
┌─────────────────────────────────────────────────────────────────┐
│                    ПЕРВЫЙ ВХОД ИГРОКА                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  Origins GUI - Выбор нации     │
        │  (custom:nation_selection)     │
        └────────┬───────────────────────┘
                 │  Игрок выбирает нацию (france, rome, etc.)
                 ▼
    ┌────────────────────────────────────────┐
    │  Apoli Powers via OriginJS             │
    │  - Assign GameStage (team определение) │
    │  - Assign Scoreboard Team              │
    │  - Run /team join команда              │
    └────────┬───────────────────────────────┘
             │  Игрок получает team (team.france, team.rome)
             ▼
  ┌────────────────────────────────────────────┐
  │  KubeJS Event: onRecipeViewed()            │
  │  Или проверка в командной консоли          │
  │  - Получаем текущую team игрока            │
  │  - Определяем нацию по team                │
  └────────┬──────────────────────────────────┘
           │  Получаем список ALLOWED_CRAFTS для нации
           ▼
  ┌────────────────────────────────────────────┐
  │  GameStages Проверка (через RecipeStages)  │
  │  - Фильтрация рецептов                     │
  │  - Видимость в книге рецептов              │
  └────────┬──────────────────────────────────┘
           │
           ▼
  ┌────────────────────────────────────────────┐
  │  KubeJS Финальная логика                   │
  │  - Проверка ALLOWED_CRAFTS                 │
  │  - Отмена крафта если не разрешен          │
  │  - Логирование попыток                     │
  └────────────────────────────────────────────┘
```

### Поток данных

```
[Origins Config]
    ↓
[Apoli Powers (OriginJS)]
    ↓ 
[Scoreboard Teams] ←→ [GameStages]
    ↓
[KubeJS ALLOWED_CRAFTS]
    ↓
[Recipe Filtering]
    ↓
[Crafting Result]
```

---

## Компоненты и их роль

### 1. **Origins** - Интерфейс выбора
| Аспект | Описание |
|--------|---------|
| **Файл конфига** | `config/origins-common.toml` |
| **Задача** | Предоставляет GUI для выбора нации на первый вход |
| **Ключевые origins** | `nations:france`, `nations:rome`, `nations:egypt`, и т.д. (`nations:*`) |
| **Ограничения** | Один origin на игрока (выбирается один раз на первый вход) |
| **Зависимости** | Origins (мод) |
| **Жеалт** | Все origins должны иметь `enabled = true` |

### 2. **Apoli + OriginJS** - Логика присвоения статуса
| Аспект | Описание |
|--------|---------|
| **Файлы конфига** | `config/apoli-common.toml`, `config/apoli-client.toml` |
| **Задача** | Через OriginJS powers назначать GameStages и scoreboard teams |
| **KubeJS крючки** | `startup_scripts/` - инициализация powers при первом входе |
| **Команда назначения** | `/team join team.{nation} @s` (через KubeJS) |
| **Ограничения** | Apoli powers должны быть зарегистрированы в Origins JSON'ах |
| **Зависимости** | Apoli, OriginJS |

### 3. **GameStages + RecipeStages** - Фильтрация рецептов
| Аспект | Описание |
|--------|---------|
| **Файлы конфига** | `config/gamestages/` (при необходимости) |
| **Задача** | Отслеживание и ограничение рецептов по стадиям |
| **KubeJS интеграция** | Через `RecipeStages.addStage()` в `server_scripts/` |
| **Основной механизм** | Scoreboard teams ↔ GameStages (team.france → stage france) |
| **Ограничения** | Stage имя должно совпадать с nations namespace (`france`, `rome` и т.д.) |
| **Команда проверки** | `player.stages.has('france')` в KubeJS |

### 4. **KubeJS** - Ядро системы
| Аспект | Описание |
|--------|---------|
| **Файлы конфига** | `kubejs/config/common.properties`, `kubejs/config/client.properties` |
| **Директории скриптов** | `kubejs/server_scripts/` (логика) + `kubejs/startup_scripts/` (инициализация) |
| **Задача** | Реализация логики ALLOWED_CRAFTS и обработка рецептов |
| **Ключевые события** | `onRecipeViewed`, `onOrePicked`, `onEvent()` |
| **Главный файл логики** | `kubejs/server_scripts/nations_crafting_restrictions.js` |
| **Хранилище ALLOWED_CRAFTS** | Явный JS массив или JSON файл с item ID'ами |

---

## Особенности KubeJS

### 🎯 KubeJS - это НОЕ

**KubeJS** = Event-driven JavaScript runtime внутри Minecraft сервера

```javascript
// КуbeJS скрипты исполняются в виде JavaScript (не Python, не Java)
// И запускаются всякий раз при загрузке сервера и при /kubejs reload

ServerEvents.recipes(event => {
    // Ваш код здесь
})
```

### 📝 Структура KubeJS директорий

```
kubejs/
├── config/
│   ├── common.properties         ← ОБЯЗАТЕЛЬНО - основные настройки
│   └── client.properties         ← ОБЯЗАТЕЛЬНО - UI настройки
├── startup_scripts/
│   ├── init_nations.js          ← Инициализация наций и teams
│   └── ...
├── server_scripts/
│   ├── nations_crafting_restrictions.js  ← Основная логика
│   ├── allowed_crafts.js                 ← Спецификация свободных крафтов
│   └── ...
├── client_scripts/
│   └── ... (если нужна клиентская логика)
└── assets/
    └── ... (текстуры, звуки, модели - если требуются)
```

### ⚙️ Ключевые события KubeJS для нашей системы

#### 1. **`startup_scripts` - Инициализация**
Запускается **ОДин РАЗ** при старте сервера

```javascript
// startup_scripts/init_nations.js
const NATIONS = ['france', 'rome', 'egypt', 'greece', 'china', 'japan', /* ... */]

StartupEvents.registry('block', event => {
    // Инициализация
})
```

#### 2. **`ServerEvents.recipes()` - Обработка рецептов**
Запускается при загрузке всех рецептов в мире

```javascript
// server_scripts/nations_crafting_restrictions.js
ServerEvents.recipes(event => {
    event.recipes.minecraft.crafting.remove({output: 'item_id'})
    
    // Или добавить с условиями
    event.shapeless('result', ['ingredient1', 'ingredient2'])
})
```

#### 3. **`recipe.notifyCreate()` - Срабатывание крафта**
Запускается когда игрок крафтит предмет

```javascript
ServerEvents.recipes(event => {
    let recipe = event.recipes.minecraft.crafting.shapeless('result', ['ingredient'])
    
    recipe.notifyCreate((player, recipe) => {
        // Проверяем нацию игрока
        if (!isAllowedCraft(player, recipe)) {
            // Отмена крафта
            recipe.cancel()
        }
    })
})
```

#### 4. **`PlayerEvents.tick()` - Проверка на каждый тик**
Запускается на каждый тик (20 раз в секунду) для каждого игрока

```javascript
PlayerEvents.tick(event => {
    let player = event.player
    if (player.stages.has('france')) {
        // Логика для французов
    }
})
```

### 🚫 Как работают ограничения крафта

#### Вариант 1: Удаление рецепта полностью
```javascript
ServerEvents.recipes(event => {
    // Запретить всем крафтить diamond_sword
    event.recipes.minecraft.crafting.remove({output: 'minecraft:diamond_sword'})
})
```

#### Вариант 2: Условное удаление (правильный подход)
```javascript
ServerEvents.recipes(event => {
    let recipe = event.shapeless('forbidden_item', ['ingredient1', 'ingredient2'])
    
    recipe.notifyCreate((player, recipe) => {
        // Получаем текущую team игрока
        let teams = player.getScoreboardTeams()
        let playerNation = teams.find(team => team.startsWith('team.'))
        
        // Проверяем ALLOWED_CRAFTS
        if (!ALLOWED_CRAFTS[playerNation].includes('forbidden_item')) {
            // Отмена крафта
            recipe.cancel()
            player.tell(`§cЭта броня запрещена для вашей нации!`)
        }
    })
})
```

#### Вариант 3: Через GameStages (рекомендуется)
```javascript
ServerEvents.recipes(event => {
    // Добавляем этап для рецепта
    event.recipes.minecraft.crafting.shapeless('allowed_item', ['ing1', 'ing2'])
        .stage('france')  // Рецепт доступен только с stage 'france'
})
```

### 💾 Сохранение состояния

**ВАЖНО:** KubeJS **НЕ** сохраняет переменные между перезагрузками!

```javascript
// ❌ НЕПРАВИЛЬНО
let playerNation = 'france'  // Теряется при /kubejs reload

// ✅ ПРАВИЛЬНО - использовать Persistent Data
PlayerEvents.tick(event => {
    let player = event.player
    let data = player.getPersistentData()
    data.playerNation = 'france'  // Сохраняется в NBT тега игрока
})

// Или использовать scoreboard
ServerEvents.tick(event => {
    // Работать со scoreboard вместо переменных
})
```

### 🔄 Симметрия: Dev ↔ Repo

**КЛЮЧЕВОЙ НЮАНС:** KubeJS скрипты в игровом окружении и в репозитории должны быть ИДЕНТИЧНЫ

```
Local Dev:                          Repository:
d:\Games\...\minecraft\
├── kubejs/
│   ├── server_scripts/
│   │   └── nations_crafting.js    ≡    nations-craft-system/kubejs/server_scripts/nations_crafting.js
│   └── startup_scripts/
│       └── init_nations.js        ≡    nations-craft-system/kubejs/startup_scripts/init_nations.js
```

**Процесс синхронизации:**
1. Разработка в локальной инстанции Minecraft
2. Тестирование через `/kubejs reload`
3. **КОПИРОВАНИЕ** в папку репозитория
4. Коммит в git

---

## Workflow разработки

### Фаза 1: Инициализация (Startup)

**Файл:** `kubejs/startup_scripts/init_nations.js`

```javascript
// Этот скрипт запускается ОДин раз при старте сервера

const NATIONS = {
    'france': {
        team: 'team.france',
        stage: 'france',
        allowed_items: ['magistuarmory:*', 'too_many_swords:*']
    },
    'rome': {
        team: 'team.rome',
        stage: 'rome',
        allowed_items: ['antiquelegacy:*', 'lets_forge_bronze_and_iron:*']
    },
    // ... остальные нации
}

// Инициализация при старте сервера
StartupEvents.init(event => {
    console.log('Nations Crafting System initialized!')
    console.log('Available nations:', Object.keys(NATIONS).join(', '))
})

// Экспорт для использования в других скриптах
global.NATIONS = NATIONS
```

### Фаза 2: Обработка рецептов (Server)

**Файл:** `kubejs/server_scripts/nations_crafting_restrictions.js`

```javascript
// Главная логика ограничения крафта

// 1. Определяем ALLOWED_CRAFTS для каждой нации
const ALLOWED_CRAFTS = {
    'team.france': [
        'magistuarmory:french_helmet',
        'magistuarmory:french_chestplate',
        // ... полный список
    ],
    'team.rome': [
        'antiquelegacy:centurion_helmet',
        'antiquelegacy:roman_sword',
        // ... полный список
    ],
    // ... остальные нации
}

// 2. Обработка всех рецептов
ServerEvents.recipes(event => {
    
    // Получаем все рецепты
    let recipesList = event.getRecipes()
    
    recipesList.forEach(recipe => {
        // Для каждого рецепта добавляем проверку
        recipe.notifyCreate((player, recipe) => {
            checkCraftingAllowed(player, recipe)
        })
    })
})

// 3. Функция проверки
function checkCraftingAllowed(player, recipe) {
    // Получаем нацию игрока из scoreboard team
    let teams = player.getTeams()
    let playerTeam = teams.find(t => t.startsWith('team.'))
    
    if (!playerTeam) {
        // Игрок еще не выбрал нацию
        player.tell('§cВы должны выбрать нацию!')
        recipe.cancel()
        return
    }
    
    // Получаем вывод рецепта
    let output = recipe.getResultItem().getId() + ':' + recipe.getResultItem().getCount()
    
    // Проверяем, разрешен ли этот предмет
    if (!ALLOWED_CRAFTS[playerTeam].includes(output)) {
        player.tell(`§cЭта броня запрещена для вашей нации!`)
        recipe.cancel()
    }
}
```

### Фаза 3: Тестирование

```bash
# 1. Перезагрузить скрипты
/kubejs reload

# 2. Проверить логи
# Должны быть видны сообщения "Nations Crafting System initialized!"

# 3. Проверить команды Origins
/origins choose france

# 4. Попытаться скрафтить запрещенный предмет
# Должно быть сообщение об ошибке

# 5. Проверить scoreboard
/scoreboard players list @s
```

---

## Синхронизация с репозиторием

### 📂 Структура репозитория

```
nations-craft-system/
├── docs/
│   └── audit_tz_for_customer.md
├── config/
│   ├── origins-common.toml         ← Копируем из ~/.minecraft/config/
│   ├── apoli-common.toml           ← Копируем из ~/.minecraft/config/
│   ├── apoli-client.toml           ← Копируем из ~/.minecraft/config/
│   └── gamestages/                 ← При необходимости
├── kubejs/
│   ├── config/
│   │   ├── common.properties       ← Копируем из ~/.minecraft/kubejs/config/
│   │   └── client.properties       ← Копируем из ~/.minecraft/kubejs/config/
│   ├── server_scripts/
│   │   ├── nations_crafting_restrictions.js
│   │   ├── allowed_crafts.js
│   │   └── ...
│   ├── startup_scripts/
│   │   ├── init_nations.js
│   │   └── ...
│   └── data/                       ← Данные Origin'ов (JSON конфиги)
├── README.md
├── CONFIG_STRUCTURE.md
├── INSTALL.md
└── NATIONS_CRAFTING_SYSTEM.skill.md  ← Этот файл
```

### 🔄 Процесс синхронизации

#### Шаг 1: Разработка в локальном Minecraft

```
d:\Games\PrismLauncher\instances\1.20.1\minecraft\
├── kubejs\server_scripts\nations_crafting_restrictions.js  ← Редактируем
```

#### Шаг 2: Тестирование

```bash
/kubejs reload          # Перезагружаем скрипты
/origins choose france  # Тестируем выбор нации
# Проверяем крафтинг и логи
```

#### Шаг 3: Копирование в репо

**Файлы для синхронизации:**

```bash
# После успешного тестирования копируем:
d:\Games\PrismLauncher\instances\1.20.1\minecraft\kubejs\server_scripts\*
    ↓
nations-craft-system\kubejs\server_scripts\

d:\Games\PrismLauncher\instances\1.20.1\minecraft\kubejs\startup_scripts\*
    ↓
nations-craft-system\kubejs\startup_scripts\

# И конфиги:
d:\Games\PrismLauncher\instances\1.20.1\minecraft\config\origins-common.toml
    ↓
nations-craft-system\config\origins-common.toml

d:\Games\PrismLauncher\instances\1.20.1\minecraft\config\apoli-*.toml
    ↓
nations-craft-system\config\apoli-*.toml
```

#### Шаг 4: Коммит в Git

```bash
cd d:\Games\PrismLauncher\instances\1.20.1\minecraft\nations-craft-system

git add kubejs/ config/
git commit -m "Добавлена логика ограничения крафта для нации france"
git push
```

### ⚠️ Критичные моменты синхронизации

| Проблема | Решение |
|----------|---------|
| **Забыли скопировать файл** | Скрипты работают локально, но не в продакшене - отладка сложна |
| **Скопировали старую версию** | Конфликты при следующей разработке - теряется код |
| **Не обновили конфиги** | Новые origins/powers не загружаются - нации недоступны |
| **Забыли про BOM в файлах** | Некорректное чтение конфигов - странные ошибки |

---

## Типичные ошибки

### ❌ Ошибка 1: Рецепт всё ещё доступен после запрета

**Причина:** Не добавлена проверка в `.notifyCreate()`

**До:** 
```javascript
event.recipes.minecraft.crafting.remove({output: 'item_id'})
```

**После:**
```javascript
let recipe = event.shapeless('item_id', ['ing1', 'ing2'])
recipe.notifyCreate((player, recipe) => {
    if (!isAllowedForNation(player, 'item_id')) {
        recipe.cancel()
    }
})
```

---

### ❌ Ошибка 2: Игрок не видит свою нацию

**Причина:** Origins не зарегистрирован в `origins-common.toml`

**Решение:**
```toml
[origins."nations:france"]
    enabled = true
    "nations:nation_france" = true
```

Убедитесь:
- ✅ `enabled = true`
- ✅ Наличие `"nations:nation_france"` power
- ✅ Синхронизирован в репо

---

### ❌ Ошибка 3: `/kubejs reload` не помогает

**Причина:** Изменился `startup_scripts/` - нужен перезагрузка сервера

**Решение:**
```bash
# Если меняли startup_scripts - перезагружаем весь сервер:
/stop
# Стартуем заново
```

**Если меняли `server_scripts/` - достаточно:**
```bash
/kubejs reload
```

---

### ❌ Ошибка 4: Stagenames не совпадают

**Причина:** GameStage имя не совпадает с nation name

**Неправильно:**
```javascript
event.shapeless('item', ['ing']).stage('france') // stage
// но scoreboard team = 'team.france' ❌
```

**Правильно:**
```javascript
event.shapeless('item', ['ing']).stage('france')
// и правильный player.stages.has('france') ✅
```

---

### ❌ Ошибка 5: Конфиги не скопированы

**Признак:** "Unknown origin: nations:france"

**Причина:** Конфиг `origins-common.toml` не в репо или устарел

**Решение:**
1. Проверьте весь путь в рабочем Minecraft
2. Скопируйте весь файл в репо
3. Коммитьте в git

---

## Примеры кода

### Пример 1: Минимальная система

**`kubejs/startup_scripts/init_nations.js`**
```javascript
const NATIONS = ['france', 'rome', 'egypt']

StartupEvents.init(event => {
    console.log(`Loaded ${NATIONS.length} nations`)
})
```

**`kubejs/server_scripts/allowed_crafts.js`**
```javascript
const ALLOWED_CRAFTS = {
    'team.france': ['magistuarmory:french_helmet'],
    'team.rome': ['antiquelegacy:centurion_helmet'],
    'team.egypt': ['antiquelegacy:pharaoh_helmet']
}

module.exports = ALLOWED_CRAFTS
```

**`kubejs/server_scripts/nations_crafting_restrictions.js`**
```javascript
const ALLOWED = require('./allowed_crafts.js')

ServerEvents.recipes(event => {
    event.recipes.minecraft.crafting.shapeless('result', ['ingredient']).notifyCreate((player, recipe) => {
        let team = player.getTeams()?.[0]
        let output = recipe.getResultItem().getId()
        
        if (!ALLOWED[team]?.includes(output)) {
            recipe.cancel()
            player.tell('§cЗапрещено!')
        }
    })
})
```

---

### Пример 2: Продвинутая система с логированием

**`kubejs/server_scripts/crafting_logger.js`**
```javascript
const ALLOWED = require('./allowed_crafts.js')

// Логирование попыток крафта
const CRAFT_LOG = []

function logCraftAttempt(player, recipe, allowed) {
    CRAFT_LOG.push({
        timestamp: Date.now(),
        player: player.getName(),
        recipe: recipe.getResultItem().getId(),
        nation: player.getTeams()?.[0],
        allowed: allowed
    })
}

ServerEvents.recipes(event => {
    event.recipes.minecraft.crafting.shapeless('item', ['ing']).notifyCreate((player, recipe) => {
        let team = player.getTeams()?.[0]
        let allowed = ALLOWED[team]?.includes(recipe.getResultItem().getId())
        
        logCraftAttempt(player, recipe, allowed)
        
        if (!allowed) {
            recipe.cancel()
        }
    })
})

// Команда для просмотра логов
ServerEvents.commandRegistry(event => {
    event.register(
        Commands.literal('crafting_log')
            .executes(ctx => {
                CRAFT_LOG.slice(-10).forEach(log => {
                    ctx.source.sendSuccess(`${log.player}: ${log.recipe} (${log.allowed ? '✅' : '❌'})`, false)
                })
                return 1
            })
    )
})
```

---

## Проверочный лист

### ✅ Перед началом разработки

- [ ] Скопирована структура репозитория
- [ ] Создана папка `kubejs/server_scripts/`
- [ ] Создана папка `kubejs/startup_scripts/`
- [ ] Скопирены конфиги Origins, Apoli, GameStages
- [ ] Скопирены конфиги KubeJS (`common.properties`, `client.properties`)
- [ ] Прочитано описание этого SKILL файла

### ✅ Во время разработки

- [ ] Каждая нация определена в `origins-common.toml`
- [ ] Каждая нация имеет соответствующий stage в KubeJS
- [ ] ALLOWED_CRAFTS содержит ВСЕ allowed item ID'ы
- [ ] Рецепты проверяются через `.notifyCreate()`
- [ ] Команда `/kubejs reload` работает без ошибок
- [ ] Логи показывают нужную информацию

### ✅ Перед коммитом

- [ ] Тестированы все нации (origins choose X)
- [ ] Тестирован каждый оружие/броня из ALLOWED_CRAFTS
- [ ] Тестирована попытка крафта запрещенного предмета
- [ ] Все файлы скопированы в репо
- [ ] Git diff показывает только необходимые изменения
- [ ] Коммит сообщение описывает что изменилось

### ✅ После коммита

- [ ] Код работает в продакшене (если заедете на тестовый сервер)
- [ ] Все логи чистые (нет ERROR)
- [ ] Функциональность работает как ожидается

---

## Ресурсы

- 📖 [KubeJS Documentation](https://wiki.latvian.dev/books/kubejs/page/1)
- 📖 [Origins Documentation](https://apace100.github.io/origins/docs/)
- 📖 [GameStages Wiki](https://blamejared.com/GameStages/)
- 🔧 [RecipeStages](https://github.com/Darkhax/RecipeStages)

---

**Версия документа:** 1.0  
**Обновлено:** 11 марта 2026  
**Статус:** Готово к использованию
