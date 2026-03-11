# Nations Craft System

Система ограничений крафта по нациям для Minecraft Forge 1.20.1.

Игрок при первом входе выбирает нацию через GUI. Выбор определяет, какие предметы (броня, оружие, украшения) он может крафтить на верстаке.

## Стэк технологий

| Компонент | Роль |
|-----------|------|
| **Origins** | GUI выбора нации (экран первого входа) |
| **Apoli** | Powers для назначения GameStage и scoreboard team при выборе нации |
| **GameStages** | Хранение принадлежности игрока к нации (`nation_<id>`) |
| **RecipeStages** | Ограничение рецептов по стадиям (перспектива) |
| **KubeJS** | Создание команд/префиксов, регистрация предметов-флагов, фреймворк ограничений крафта |

## Нации (14 шт.)

| Нация | Craft-группа | Префикс |
|-------|-------------|---------|
| Скандинавия | `scandinavia` | SCAN |
| Византия | `byzantium` | BYZ |
| Сарацины | `saracens` | SAR |
| Германия | `western_europe` | GER |
| Англия | `western_europe` | ENG |
| Франция | `western_europe` | FRA |
| Русь | `rus` | RUS |
| Монголия | `eastern_asia` | MON |
| Китай | `eastern_asia` | CHN |
| Корея | `eastern_asia` | KOR |
| Япония | `japan` | JPN |
| Греция | `greece` | GRC |
| Рим | `rome` | ROM |
| Египет | `egypt` | EGY |

## Структура проекта

```
nations-craft-system/
├── README.md
├── INSTALL.md
├── .gitignore
│
├── docs/                                    # Документация и ТЗ
│   ├── preliminary_nations_tz.md            # Предварительное ТЗ
│   ├── relevant_items_filter.md             # Фильтр предметов по нациям
│   └── audit_tz_for_customer.md             # Аудит ТЗ
│
└── kubejs/                                  # Всё содержимое → .minecraft/kubejs/
    ├── server_scripts/
    │   └── nations_core.js                  # Основной серверный скрипт
    │
    ├── startup_scripts/
    │   └── nations_items.js                 # Регистрация предметов-флагов
    │
    ├── data/
    │   ├── origins/
    │   │   └── origin_layers/
    │   │       └── origin.json              # Отключение дефолтного origin layer
    │   │
    │   └── nations/                         # Namespace: nations
    │       ├── origins/                     # 14 файлов: определения наций-origins
    │       │   ├── scandinavia.json
    │       │   ├── byzantium.json
    │       │   └── ...
    │       ├── origin_layers/
    │       │   └── nation.json              # Слой выбора нации (order: 0)
    │       └── powers/                      # 14 файлов: Apoli powers
    │           ├── nation_scandinavia.json   # → gamestage add + team join
    │           ├── nation_byzantium.json
    │           └── ...
    │
    └── assets/
        └── nations/
            ├── lang/
            │   ├── en_us.json               # Английская локализация
            │   └── ru_ru.json               # Русская локализация
            └── textures/
                └── item/                    # 14 PNG: иконки флагов
                    ├── flag_scandinavia.png
                    ├── flag_byzantium.png
                    └── ...
```

## Как это работает

### 1. Выбор нации (Origins)
Игрок при первом входе видит экран выбора нации. Каждая нация отображается с иконкой флага, названием и описанием (локализованным).

### 2. Назначение стадии и команды (Apoli)
При выборе нации срабатывает power (`apoli:action_on_callback`), который:
- добавляет GameStage `nation_<id>` через команду `gamestage add @s nation_<id>`
- присоединяет игрока к scoreboard team `nation_<id>` для отображения цветного префикса

### 3. Синхронизация при входе (KubeJS)
При каждом входе `ServerEvents.loaded` создаёт/обновляет scoreboard teams с префиксами.  
`PlayerEvents.loggedIn` синхронизирует команду игрока по его GameStage (safety net).

### 4. Ограничение крафта (KubeJS — в разработке)
`PlayerEvents.crafted` проверяет скрафченный предмет по whitelist нации игрока. Нации, входящие в одну craft-группу (напр. `western_europe`), делят общий whitelist.

## Статус разработки

- [x] Origins: GUI выбора нации (14 наций)
- [x] Apoli: Powers назначения GameStage + team
- [x] KubeJS: Регистрация флагов и создание команд
- [x] Локализация: EN + RU
- [x] ТЗ: Предварительное ТЗ составлено и проаудитировано
- [ ] Заполнение ALLOWED_CRAFTS по утверждённому ТЗ
- [ ] Активация обработчика PlayerEvents.crafted
- [ ] Тестирование крафт-ограничений
