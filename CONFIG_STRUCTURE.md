# Конфигурационные файлы модов для системы ограничений крафта по нациям

Этот каталог содержит конфигурационные файлы модов, используемых в системе ограничений крафта по нациям.

## Структура

### `config/` - Конфиги серверных модов

#### `origins-common.toml`
Конфигурация мода **Origins** с определением всех доступных наций:
- `nations:france`, `nations:china`, `nations:egypt`, `nations:greece`
- `nations:saracens`, `nations:germany`, `nations:rome`, `nations:england`
- `nations:rus`, `nations:japan`, `nations:scandinavia`, `nations:korea`, `nations:byzantium`, `nations:mongolia`
- Также содержит стандартные Origins (human, feline, elytrian, shulk, merling, phantom, arachnid, blazeborn, avian, enderian)

**Назначение:** Определяет список доступных происхождений (origins) и их powers в GUI выбора на первый вход.

#### `apoli-common.toml`
Конфигурация мода **Apoli** (серверная часть):
- Управление экспериментальными возможностями (HUD, etc)

**Назначение:** Глубокая настройка поведения Apoli powers при назначении нации.

#### `apoli-client.toml`
Конфигурация мода **Apoli** (клиентская часть):
- Смещение HUD элементов (hud_offset_x, hud_offset_y)
- Настройки tooltip'ов и подсказок

**Назначение:** Управление UI элементами на клиенте при выборе нации.

#### `gamestages/` (папка)
Папка для локальных конфигов мода **GameStages** (при необходимости сохранения специфичных настроек для нашей системы).

**Назначение:** GameStages отслеживает членство игрока в нации используя scoreboard teams. Конфиги здесь могут содержать специальные правила для стадий.

### `kubejs/config/` - Конфиги KubeJS

#### `common.properties`
Общие свойства **KubeJS**:
- `announceReload=true` - уведомления о перезагрузке скриптов
- `matchJsonRecipes=true` - совпадение JSON рецептов
- `allowAsyncStreams=true` - асинхронные потоки
- `creativeModeTabIcon=minecraft\:purple_dye` - иконка хранилища в любви

**Назначение:** Управление ГЛОБАЛЬНЫМ поведением KubeJS скриптов (перезагрузка, рецепты, логирование errors).

#### `client.properties`
Клиентские свойства **KubeJS**:
- `disableRecipeBook=false` - книга рецептов включена
- `backgroundColor=2E3440` - фоновый цвет (Nordic Frost)
- `barColor=ECEFF4` - цвет полос (Light)

**Назначение:** Управление UI KubeJS на клиенте (логирование, цвета, кастомные элементы).

## Использование

Эти файлы должны копироваться в соответствующие директории в игровой инстанции:
- `config/*.toml` → `~/.minecraft/config/`
- `kubejs/config/*.properties` → `~/.minecraft/kubejs/config/`

## Архитектура взаимодействия

1. **Origins** - Выбор нации → Сохранение выбранного origin в игроке
2. **Apoli** - Присвоение powers (через OriginJS) → Установка GameStages и scoreboard team
3. **GameStages** - Отслеживание, какие рецепты доступны
4. **RecipeStages** - Ограничение видимости рецептов в крафт-меню
5. **KubeJS** - Финальная обработка логики крафта (проверка ALLOWED_CRAFTS)

---

*Дата обновления: 11 марта 2026*
*Статус: Прямая разработка для системы ограничений крафта по нациям*
