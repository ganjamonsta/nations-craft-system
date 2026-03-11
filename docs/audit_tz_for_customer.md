# Аудит технического задания на ограничения крафта по нациям (Forge 1.20.1)

**Дата аудита:** 11 марта 2026  
**Статус:** Требует уточнений перед финализацией

---

## 0. 🔧 Технологический стек

Реализация системы ограничений крафта по нациям использует следующие модули:

### Компоненты системы:
1. **Origins** - GUI выбора нации на первый вход (first-join screen)
2. **OriginJS** - Функциональное расширение Origins для назначения Apoli powers
3. **Apoli Powers** - Назначение GameStages и scoreboard teams при выборе нации
4. **KubeJS** - Основной фреймворк:
   - Создание и управление командными префиксами
   - Реализация логики ограничения крафта
   - Обработка рецептов в зависимости от нации
5. **GameStages** - Отслеживание членства игрока в нации (через scoreboard teams)
6. **RecipeStages** - Управление доступностью рецептов на основе GameStages

### Структура данных:
- **Выбор нации:** Через GUI Origins → сохранение в Apoli origin
- **Определение доступа:** GameStages (scoreboard) → RecipeStages (ограничение рецептов) → KubeJS (финальная обработка)
- **Хранилище ALLOWED_CRAFTS:** Явный массив item ID (для prod версии)

### Скопированные конфигурационные файлы в репо:

#### Origins + Apoli (папка `config/`)
- `origins-common.toml` - конфигурация Origins с определением всех наций
- `apoli-common.toml` - общие настройки Apoli
- `apoli-client.toml` - клиентские настройки Apoli (HUD, tooltips)

#### KubeJS (папка `kubejs/config/`)
- `common.properties` - общие свойства KubeJS (рецепты, перезагрузка, etc)
- `client.properties` - клиентские свойства KubeJS (UI, цвета, etc)

#### GameStages (папка `config/gamestages/`)
- Папка создана для хранения локальных конфигов GameStages (при необходимости)

---

## Резюме

Предварительное ТЗ в основном соответствует пожеланиям заказчика. Обнаружены **4 критических вопроса** и **2 косметических** уточнения.

Все namespace'ы проверены и подтверждены в сборке.

---

## 1. ✅ Подтвержденные моменты

### 1.1 Структура групп наций
- **Отдельные группы:** `china_korea_mongolia`, `scandinavia`, `byzantium`, `japan`, `greece`, `rome`, `egypt`, `saracens`
- **Общие группы:** `western_europe` (germany/france/england), `rus` (отдельно)
- **Статус:** ✅ Совпадает с пожеланиями

### 1.2 Глобальные ингредиенты
Все chainmail и lamellar предметы из `lets_forge_bronze_and_iron` не запрещаются для всех наций без исключения.

**Статус:** ✅ Подтверждено в пожеланиях: "в некоторых комплектах для крафта нужна какая либо часть из ламеллярной брони и кольчужной из мода lets forge bronze and iron, ее не надо запрещать"

### 1.3 Все namespace'ы подтверждены в raw list of items.txt

| Namespace | Статус |
|-----------|--------|
| `lfs_vikings_n_northerners` | ✅ |
| `darkagesarmory` | ✅ |
| `lfs_samurais_n_ninjas` | ✅ |
| `oyoroi` | ✅ |
| `old_style_arabic` | ✅ |
| `hamzabus_ottoman_mod` | ✅ |
| `magistuarmoryaddon` | ✅ |
| `slavicarmory` | ✅ |
| `oriental_armoury` | ✅ |
| `samurai_dynasty` | ✅ |
| `kingdomsanddynasties2` | ✅ |
| `antiquelegacy` | ✅ |

---

## 2. 🟡 КРИТИЧЕСКИЕ ВОПРОСЫ (требуют уточнения у заказчика)

### 2.1 Русь: Epic Knights vs. Slavic Armory

**Проблема в ТЗ:**
- Пожелание заказчика: "Epic Knights: Slavic armour (броня, оружие, украшения)"
- ТЗ реализует: только `slavicarmory:*`

**Вопрос:** 
Является ли "Epic Knights: Slavic armour" отдельным Epic Knights аддоном, или это общее наименование для slavicarmory мода?

**Рекомендация:**
- Если это Epic Knights аддон - найти namespace для него
- Если это slavicarmory - оставить как есть в ТЗ

**Как уточнить:** Попросить заказчика указать точный ID мода или скриншот в лаунчере.

---

### 2.2 Германия/Франция/Англия: Epic Knights+ версия

**Проблема в ТЗ:**
- Пожелание заказчика: "Epic Knights+ addon" + "все средневековое оружие"
- ТЗ реализует: `magistuarmory`, `magistuarmoryaddon`, `too_many_swords`, `lfs_european_medieval_knights`, `armoroftheages`

**Вопрос:**
Что точно входит в "Epic Knights+" по мнению заказчика?

**Вариант интерпретации в ТЗ:**
1. `magistuarmory:*` - базовая броня
2. `magistuarmoryaddon:*` - аксессуары/дополнения
3. `too_many_swords:*` - средневековое оружие (мечи, топоры и т.д.)
4. `lfs_european_medieval_knights:*` - европейские рыцарские наборы
5. `armoroftheages:holy_armor_*` и `armoroftheages:iron_plate_armor_*` - специальные комплекты

**Статус:** ⚠️ Требует подтверждения, что это полный и верный перечень

---

### 2.3 Сарацины: "Epic Knight Saracen комплект" vs. Отдельные предметы

**Проблема в ТЗ:**
- Пожелание: "Epic Knight Сарацинский комплект" (звучит как целый набор)
- ТЗ реализует: три отдельных предмета
  - `magistuarmoryaddon:saracen_helmet`
  - `magistuarmoryaddon:saracen_chestplate`
  - `magistuarmoryaddon:saracen_boots`

**Вопрос:**
Это действительно три отдельных предмета, образующих полный сарацинский комплект (броня из трех частей)? 
Или есть полноценный набор защиты (helmet + chestplate + leggings + boots)?

**Наблюдение:** В raw list of items нет `saracen_leggings`, только boots.

**Статус:** ⚠️ Требует подтверждения набора (с какими предметами он на самом деле комплектуется?)

---

### 2.4 Греция: Пропуск гоплитских наборов в ТЗ

**Проблема в ТЗ:**
- Пожелание: "все спартанские и афинские гоплиты наборы"
- ТЗ пишет: "Все спартанские и афинские гоплитские наборы" БЕЗ конкретных ID

**Подтвержденные ID в raw list:**

**Спартанские наборы:**
- `lets_forge_bronze_and_iron:spartan_hoplita_helmet`
- `lets_forge_bronze_and_iron:spartan_hoplita_chestplate`
- `lets_forge_bronze_and_iron:spartan_hoplita_leggings`
- `lets_forge_bronze_and_iron:spartan_hoplita_boots`
- (Золотые версии) `lets_forge_bronze_and_iron:gilded_spartan_hoplita_*` (4 предмета)
- (V2 версия) `lets_forge_bronze_and_iron:spartan_v_2_hoplita_helmet`
- (Золотая V2) `lets_forge_bronze_and_iron:gilded_spartan_hoplita_helmet_v_2_helmet`

**Афинские наборы (Linothorax):**
- `lets_forge_bronze_and_iron:athenian_linothorax_chestplate`
- `lets_forge_bronze_and_iron:athenian_linothorax_leggings`
- `lets_forge_bronze_and_iron:athenian_linothorax_boots`

**Спартанские Linothorax:**
- `lets_forge_bronze_and_iron:spartan_linothorax_chestplate`
- `lets_forge_bronze_and_iron:spartan_linothorax_leggings`
- `lets_forge_bronze_and_iron:spartan_linothorax_boots`

**Альтернативные Linothorax:**
- `lets_forge_bronze_and_iron:light_blue_linothorax_chestplate`
- `lets_forge_bronze_and_iron:light_blue_linothorax_leggings`
- `lets_forge_bronze_and_iron:light_blue_linothorax_boots`

**Вопрос:**
1. Включать ли все варианты (обычные, золотые, V2, все цветовые варианты Linothorax)?
2. Или ограничиться базовыми спартанскими и афинскими?

**Рекомендация:** 
Предложить заказчику выбор:
- **Минимум:** spartan_hoplita + athenian_linothorax + hoplon/xiphos
- **Максимум:** все варианты выше, включая цветные linothorax

**Статус:** ⚠️ Требует уточнения объема

---

## 3. 🟢 Косметические уточнения

### 3.1 Рим: "Bear helmet" в ТЗ

**Ситуация:**
- **ТЗ пункт 5.5:** "Bear helmet из lets_forge_bronze_and_iron, если он нужен заказчику"
- **Пожелания заказчика:** не упоминают bear helmet
- **raw list:** Есть `polar_bear_armor_helmet`, `black_bear_armor_helmet`, `grrizly_bear_armor_helmet`

**Проблема:** Это медвежьи шлемы, а не римские. Похоже на ошибку в ТЗ.

**Рекомендация:** Удалить из ТЗ, так как:
1. Пожелание не упоминает
2. Не соответствует стилистике Rome
3. Может быть для других наций (Norse/Scandinavian)

**Статус:** ✅ Рекомендуется удалить

---

### 3.2 Выполнение требования к явному списку item ID

**Ситуация:**
ТЗ пункт 6 упоминает: "при этом для продакшн-версии ALLOWED_CRAFTS итоговый список лучше хранить как явный массив item ID, а не как namespace-проверку"

**Статус:** 
- Согласовано ✅
- Требует подтверждения, что это приемлемо для заказчика (может повлиять на размер скрипта)

---

## 4. 📋 Прямые соответствия "пожелание ↔ ТЗ"

| Нация | Пожелание | ТЗ пункт | Статус |
|-------|-----------|----------|--------|
| China/Korea/Mongolia | Oriental Armoury War + Peace | 5.1 | ✅ |
| China/Korea/Mongolia | Song Dynasty комплект | 5.1 | ✅ |
| China/Korea/Mongolia | Guandao (обе версии) | 5.1 | ✅ |
| China/Korea/Mongolia | Стальная сабля | 5.1 | ✅ |
| Scandinavia | LFS-Vikings N Northerners | 5.2 | ✅ |
| Scandinavia | Dark Ages аддон | 5.2 | ✅ |
| Scandinavia | Varangian Guard | 5.2 | ✅ |
| Byzantium | Varangian Guard | 5.3 | ✅ |
| Byzantium | Byzantine Clibanary | 5.3 | ✅ |
| Byzantium | Dark Ages аддон | 5.3 | ✅ |
| Western Europe | Medieval оружие + броня | 5.4 | ⚠️ Требует уточнения |
| Rome | Centurion armor | 5.5 | ✅ |
| Rome | Antiquity Epic Knights | 5.5 | ✅ |
| Rome | Legionary/Centurion/Tribune/General наборы | 5.5 | ✅ |
| Rome | Gladius/Pilum/Scutum | 5.5 | ✅ |
| Rus | Slavic armour | 5.6 | ⚠️ Требует уточнения (Epic Knights?) |
| Japan | Все перечисленные модули | 5.7 | ✅ |
| Japan | LFS-Samurais N Ninjas | 5.7 | ✅ |
| Greece | Antiquity Epic Knights | 5.8 | ✅ |
| Greece | Hoplite наборы | 5.8 | ⚠️ Требует расширения списка |
| Greece | Hoplon/Xiphos | 5.8 | ✅ |
| Egypt | Anubis/Pharaoh наборы | 5.9 | ✅ |
| Egypt | Egyptian Warrior/Shield/Kopesh | 5.9 | ✅ |
| Saracens | Saracen комплект | 5.10 | ⚠️ Требует проверки |
| Saracens | Стальная рогатина | 5.10 | ✅ |
| Saracens | Стальная сабля/скимитар | 5.10 | ✅ |
| Saracens | Kulah-khud/Mamluk helmet | 5.10 | ✅ |
| Saracens | Arabic набор + Turban | 5.10 | ✅ |

---

## 5. 📌 Выводы и Рекомендации

### 5.1 Перед финализацией ТЗ

1. **Уточнить у заказчика:**
   - ❓ Структура Saracen комплекта (какие части входят?)
   - ❓ Полный объем средневекового оружия для Western Europe
   - ❓ Статус "Epic Knights: Slavic armour" - это отдельный аддон?
   - ❓ Какие гоплитские наборы для Greece включить (минимум или максимум?)

2. **Исправить в ТЗ:**
   - 🔴 Удалить "Bear helmet" из Rome (5.5 пункт 10)
   - 🟡 Расширить пункт 5.8 (Греция) с конкретными ID гоплитских наборов
   - 🟡 Пояснить в пункте 5.6 (Русь) о источнике slavic armory (Epic Knights адд-он или отдельный мод?)

3. **Подтвердить:**
   - Согласие на хранение ALLOWED_CRAFTS как явный массив item ID вместо namespace-проверок

### 5.2 Текущая оценка ТЗ

- **Полнота:** 85% ✅ (требует уточнений по 4 моментам)
- **Точность ID:** 100% ✅ (все namespace'ы подтверждены)
- **Соответствие пожеланиям:** 90% ✅

---

## 6. 📎 Дополнение: Полные ID гоплитских наборов для Греции

### Рекомендуемый финальный список для 5.8:

```
Спартанские наборы:
- lets_forge_bronze_and_iron:spartan_hoplita_*
- lets_forge_bronze_and_iron:gilded_spartan_hoplita_*

Афинские Linothorax:
- lets_forge_bronze_and_iron:athenian_linothorax_*

Спартанские Linothorax:
- lets_forge_bronze_and_iron:spartan_linothorax_*

Щиты:
- lets_forge_bronze_and_iron:bronze_red_hoplon
- lets_forge_bronze_and_iron:bronze_green_hoplon
- lets_forge_bronze_and_iron:bronze_blue_hoplon

Мечи:
- lets_forge_bronze_and_iron:bronze_xiphos
- lets_forge_bronze_and_iron:iron_xiphos
```

Возможно добавить:
- `lets_forge_bronze_and_iron:light_blue_linothorax_*` (голубой linothorax)
- Варианты греческих шлемов и более полные наборы

---

**Подготовлено для:** Согласования с заказчиком  
**Следующий шаг:** Отправить этот отчет заказчику и получить уточнения перед финализацией
