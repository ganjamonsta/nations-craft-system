# Предварительное ТЗ по ограничениям крафта наций

## 1. Цель

Сделать систему ограничений крафта по нациям для Forge 1.20.1 через KubeJS.

Ограничение применяется к крафту на обычном верстаке и должно опираться на реальные item ID из текущей сборки. Документ ниже является предварительным ТЗ для согласования перед заполнением `ALLOWED_CRAFTS` в `kubejs/server_scripts/nations_core.js`.

## 2. Важные технические выводы

1. В сохраненном списке предметов подтверждены реальные namespace и item ID почти по всем пожеланиям заказчика.
2. Аддон "темной эпохи" в сборке идет не как `darkages`, а как `darkagesarmory`.
3. Ottoman/Arabic предметы в сборке есть, но часть из них находится не в Epic Knights, а в `hamzabus_ottoman_mod`.
4. Для Saracens подтверждены реальные ID: `mamluk_helmet`, `turban_helmet`, `steel_scimitar`, `steel_sabre`, `kulah_khud`.
5. Текущее объединение `scandinavia` и `rus` в группу `nordic_slavic` больше не соответствует пожеланиям заказчика.

## 3. Обязательные изменения в логике групп

Текущая структура `CRAFT_GROUPS` должна быть изменена:

1. `scandinavia` вывести в отдельную craft-группу.
2. `rus` оставить отдельной craft-группой.
3. `china`, `korea`, `mongolia` можно оставить общей группой `eastern_asia`.
4. `germany`, `france`, `england` можно оставить общей группой `western_europe`.
5. Остальные нации оставить отдельными группами: `byzantium`, `saracens`, `japan`, `greece`, `rome`, `egypt`.

## 4. Глобальные исключения

Независимо от нации не запрещать базовые детали из `lets_forge_bronze_and_iron`, потому что они используются как промежуточные ингредиенты в крафте наборов:

- `lets_forge_bronze_and_iron:bronze_chainmail_plate`
- `lets_forge_bronze_and_iron:iron_chainmail_plate`
- `lets_forge_bronze_and_iron:bronze_chainmail_helmet`
- `lets_forge_bronze_and_iron:bronze_chainmail_chestplate`
- `lets_forge_bronze_and_iron:bronze_chainmail_leggings`
- `lets_forge_bronze_and_iron:bronze_chainmail_boots`
- `lets_forge_bronze_and_iron:iron_chainmail_helmet`
- `lets_forge_bronze_and_iron:iron_chainmail_chestplate`
- `lets_forge_bronze_and_iron:iron_chainmail_leggings`
- `lets_forge_bronze_and_iron:iron_chainmail_boots`
- `lets_forge_bronze_and_iron:bronze_lamellar_armor_chestplate`
- `lets_forge_bronze_and_iron:bronze_lamellar_armor_leggings`
- `lets_forge_bronze_and_iron:iron_lamellar_armor_chestplate`
- `lets_forge_bronze_and_iron:iron_lamellar_armor_leggings`

## 5. Разрешения по нациям

### 5.1 Китай / Корея / Монголия

Разрешить:

1. `oriental_armoury` war-предметы.
2. `oriental_armoury` peace-предметы, кроме `kanmuri` и `sokutai`.
3. Полный комплект Song Dynasty из `lets_forge_bronze_and_iron`.
4. `lets_forge_bronze_and_iron:bronze_guandao`
5. `lets_forge_bronze_and_iron:iron_guandao`
6. Средневековую стальную саблю: использовать `magistuarmoryaddon:steel_sabre` как основной подтвержденный ID.

Подтвержденные ID Oriental Armoury:

- Военная ветка: `oriental_armoury:dujeonggap_*`, `oriental_armoury:chiarmour_*`, `oriental_armoury:chicommonarmour_*`, `oriental_armoury:chielitearmour_*`, `oriental_armoury:chicav_helmet`, `oriental_armoury:chicavopen_helmet`, `oriental_armoury:chipeasant_helmet`, `oriental_armoury:chipeasant_chestplate`, `oriental_armoury:chishoes_boots`, `oriental_armoury:chiboots_boots`
- Мирная ветка: `oriental_armoury:chigovernment_*`, `oriental_armoury:mianfu_*`, `oriental_armoury:chiarmourclothes_helmet`, `oriental_armoury:nabal`, `oriental_armoury:horagai`
- Исключить: `oriental_armoury:kanmuri_helmet`, `oriental_armoury:sokutai_chestplate`, `oriental_armoury:sokutai_2_chestplate`, `oriental_armoury:sokutai_3_chestplate`

Комплект Song Dynasty:

- `lets_forge_bronze_and_iron:song_dynasty_armor_helmet`
- `lets_forge_bronze_and_iron:song_dynasty_armor_chestplate`
- `lets_forge_bronze_and_iron:song_dynasty_armor_leggings`
- `lets_forge_bronze_and_iron:song_dynasty_armor_boots`

### 5.2 Скандинавия

Разрешить:

1. Все предметы `lfs_vikings_n_northerners`.
2. Все предметы `darkagesarmory`.
3. Комплект Varangian Guard из `lets_forge_bronze_and_iron`.

Комплект Varangian Guard:

- `lets_forge_bronze_and_iron:varangian_guard_helmet`
- `lets_forge_bronze_and_iron:varangian_guard_chestplate`
- `lets_forge_bronze_and_iron:varangian_guard_leggings`
- `lets_forge_bronze_and_iron:varangian_guard_boots`

Примечание: это отдельная группа, не объединять с Русью.

### 5.3 Византия

Разрешить:

1. Комплект Varangian Guard из `lets_forge_bronze_and_iron`.
2. Комплект Byzantine Clibanary из `lets_forge_bronze_and_iron`.
3. Все предметы `darkagesarmory`.

Комплект Byzantine Clibanary:

- `lets_forge_bronze_and_iron:byzantine_clibanary_helmet`
- `lets_forge_bronze_and_iron:byzantine_clibanary_chestplate`
- `lets_forge_bronze_and_iron:byzantine_clibanary_leggings`
- `lets_forge_bronze_and_iron:byzantine_clibanary_boots`

### 5.4 Германия / Франция / Англия

Разрешить:

1. `magistuarmory:*`
2. `magistuarmoryaddon:*`
3. `too_many_swords:*`
4. `lfs_european_medieval_knights:*`
5. `armoroftheages:holy_armor_*`
6. `armoroftheages:iron_plate_armor_*`

Исключить из этой группы:

1. `slavicarmory:*`
2. `antiquelegacy:*`
3. `epic_knights__japanese_armory:*`
4. `darkagesarmory:*`

Примечание: формулировка заказчика "все средневековое оружие" на текущем этапе трактуется как все европейские medieval namespace выше, без региональных аддонов.

### 5.5 Рим

Разрешить:

1. `armoroftheages:centurion_armor_*`
2. Все предметы `antiquelegacy:*`
3. Наборы Legionary, Centurion, Senior Tribune, Roman General из `lets_forge_bronze_and_iron`.
4. `lets_forge_bronze_and_iron:bronze_gladius`
5. `lets_forge_bronze_and_iron:iron_gladius`
6. `lets_forge_bronze_and_iron:bronze_pilum`
7. `lets_forge_bronze_and_iron:iron_pilum`
8. `lets_forge_bronze_and_iron:bronze_scutum`
9. `lets_forge_bronze_and_iron:iron_scutum`

Примечание: для Rome античный Epic Knights в сборке фактически представлен через `antiquelegacy`.

### 5.6 Русь

Разрешить:

1. Все `slavicarmory:*` (славянская броня, оружие и украшения).

Подтверждено, что в моде присутствуют броня, оружие и украшения, включая:

- `slavicarmory:steel_rogatina`
- `slavicarmory:steel_winged_rogatina`
- `slavicarmory:varangian_guard_helmet`
- `slavicarmory:varangian_helmet`
- `slavicarmory:varangian_bra_decoration`

Примечание: в пожеланиях заказчика указано "Epic Knights: Slavic armour (броня, оружие, украшения)". Текущее ТЗ использует модуль `slavicarmory` как реализацию славянской брони. Если это отдельный Epic Knights аддон с иным namespace, требуется уточнение у заказчика.

### 5.7 Япония

Разрешить:

1. Все `samurai_dynasty:*`
2. Все профильные предметы `kingdomsanddynasties2`, относящиеся к armory и японской культуре
3. `armoroftheages:o_yoroi_armor_*`
4. `lets_forge_bronze_and_iron:black_samurai_*`
5. `lets_forge_bronze_and_iron:red_samurai_*`
6. `lets_forge_bronze_and_iron:bronze_tanto`
7. `lets_forge_bronze_and_iron:iron_tanto`
8. `lets_forge_bronze_and_iron:bronze_katana`
9. `lets_forge_bronze_and_iron:iron_katana`
10. `lets_forge_bronze_and_iron:bronze_shoto`
11. `lets_forge_bronze_and_iron:iron_shoto`
12. Все `urushi:*`
13. Все `epic_knights__japanese_armory:*`
14. Все `oyoroi:*`
15. Все `lfs_samurais_n_ninjas:*`

Для `kingdomsanddynasties2` в разрешение включить как минимум:

- `kingdomsanddynasties2:oyoroi_*`
- `kingdomsanddynasties2:do-maru_*`
- `kingdomsanddynasties2:kabuto`
- `kingdomsanddynasties2:hoshi_kabuto`
- `kingdomsanddynasties2:suji_kabuto`
- `kingdomsanddynasties2:toppainari_kabuto`
- `kingdomsanddynasties2:zunari_kabuto`
- `kingdomsanddynasties2:katana`
- `kingdomsanddynasties2:tanto`
- `kingdomsanddynasties2:wakizashi`
- `kingdomsanddynasties2:tachi`
- `kingdomsanddynasties2:odachi`
- `kingdomsanddynasties2:nagamaki`
- `kingdomsanddynasties2:naginata`
- `kingdomsanddynasties2:yari`
- `kingdomsanddynasties2:yumi`

### 5.8 Греция

Разрешить:

1. Все `antiquelegacy:*` (античные предметы и броня).
2. Спартанские гоплитские наборы из `lets_forge_bronze_and_iron`:
   - `lets_forge_bronze_and_iron:spartan_hoplita_helmet`
   - `lets_forge_bronze_and_iron:spartan_hoplita_chestplate`
   - `lets_forge_bronze_and_iron:spartan_hoplita_leggings`
   - `lets_forge_bronze_and_iron:spartan_hoplita_boots`
   - (Золотые варианты) `lets_forge_bronze_and_iron:gilded_spartan_hoplita_helmet`, `_chestplate`, `_leggings`, `_boots`
3. Афинские Linothorax из `lets_forge_bronze_and_iron`:
   - `lets_forge_bronze_and_iron:athenian_linothorax_chestplate`
   - `lets_forge_bronze_and_iron:athenian_linothorax_leggings`
   - `lets_forge_bronze_and_iron:athenian_linothorax_boots`
4. Спартанские Linothorax из `lets_forge_bronze_and_iron`:
   - `lets_forge_bronze_and_iron:spartan_linothorax_chestplate`
   - `lets_forge_bronze_and_iron:spartan_linothorax_leggings`
   - `lets_forge_bronze_and_iron:spartan_linothorax_boots`
5. Греческие щиты (Hoplon) из `lets_forge_bronze_and_iron`:
   - `lets_forge_bronze_and_iron:bronze_red_hoplon`
   - `lets_forge_bronze_and_iron:bronze_green_hoplon`
   - `lets_forge_bronze_and_iron:bronze_blue_hoplon`
6. Греческие мечи (Xiphos) из `lets_forge_bronze_and_iron`:
   - `lets_forge_bronze_and_iron:bronze_xiphos`
   - `lets_forge_bronze_and_iron:iron_xiphos`

Примечание: античный Epic Knights здесь также реализуется через `antiquelegacy`. Полный перечень гоплитских наборов включает спартанские, афинские (linothorax) и их варианты.

### 5.9 Египет

Разрешить:

1. `armoroftheages:anubis_armor_*`
2. `armoroftheages:pharaoh_armor_*`
3. `lets_forge_bronze_and_iron:egyptian_warrior_*`
4. `lets_forge_bronze_and_iron:egyptian_shield`
5. `lets_forge_bronze_and_iron:bronze_kopesh`
6. `lets_forge_bronze_and_iron:iron_kopesh`
7. Все `antiquelegacy:*`

### 5.10 Сарацины

Разрешить:

1. Сарацинский комплект из `magistuarmoryaddon` (броня из трех частей):
   - `magistuarmoryaddon:saracen_helmet`
   - `magistuarmoryaddon:saracen_chestplate`
   - `magistuarmoryaddon:saracen_boots`
2. Славянское оружие (тематическое допущение по пожеланию заказчика):
   - `slavicarmory:steel_rogatina`
3. Сарацинское оружие из `magistuarmoryaddon`:
   - `magistuarmoryaddon:steel_sabre`
   - `magistuarmoryaddon:steel_scimitar`
4. Специальные шлемы из `magistuarmoryaddon`:
   - `magistuarmoryaddon:kulah_khud`
   - `magistuarmoryaddon:mamluk_helmet`
5. Arabic / Ottoman броня и украшения из `old_style_arabic`:
   - `old_style_arabic:arab_armor_armor_helmet`
   - `old_style_arabic:arab_armor_armor_chestplate`
   - `old_style_arabic:arab_armor_armor_leggings`
   - `old_style_arabic:arab_armor_armor_boots`
   - `old_style_arabic:white_arab_armor_helmet`
   - `old_style_arabic:middleeasterncloth`
6. Turkish / Ottoman головные уборы из `hamzabus_ottoman_mod`:
   - `hamzabus_ottoman_mod:turban_helmet`

Примечание: "Bronze arabic набор" подтвержден в сборке через `old_style_arabic` с текущими ID. Полный состав сарацинского комплекта (helmet + chestplate + boots, без отдельных leggings) соответствует pожеланию заказчика "Epic Knight Saracen комплект".

## 6. Предварительные соответствия "все предметы мода"

На этапе реализации для генерации итогового `ALLOWED_CRAFTS` использовать такие namespace-пакеты:

- `lfs_vikings_n_northerners:*`
- `darkagesarmory:*`
- `magistuarmory:*`
- `magistuarmoryaddon:*`
- `too_many_swords:*`
- `lfs_european_medieval_knights:*`
- `antiquelegacy:*`
- `slavicarmory:*`
- `samurai_dynasty:*`
- `urushi:*`
- `epic_knights__japanese_armory:*`
- `oyoroi:*`
- `lfs_samurais_n_ninjas:*`

При этом для продакшн-версии `ALLOWED_CRAFTS` итоговый список лучше хранить как явный массив item ID, а не как namespace-проверку, чтобы избежать побочных допусков.

## 7. Открытые уточнения для согласования с заказчиком

1. **Русь - Slavic Armory vs. Epic Knights аддон:** в пожеланиях упоминается "Epic Knights: Slavic armour". Требуется подтверждение, что `slavicarmory:*` это корректный источник для славянской брони, или это отдельный Epic Knights аддон с иным namespace.

2. **Сарацины - Состав комплекта:** в raw list подтверждены только три части сарацинского комплекта (helmet, chestplate, boots) без отдельных leggings. Нужно подтвердить, что это полный комплект по пожеланию заказчика.

3. **Греция - Объем гоплитских наборов:** ТЗ включает все варианты (обычные, золотые, linothorax разных цветов). Если заказчик хочет минимум - нужно указать какие именно включить.

4. **Западная Европа - Полнота Medieval наборов:** пожелание "все средневековое оружие" реализовано как комбинация magistuarmory, magistuarmoryaddon, too_many_swords, lfs_european_medieval_knights, armoroftheages. Требуется подтверждение, что это полный перечень.

## 8. Следующий шаг после утверждения

### Перед утверждением ТЗ:

1. **Согласовать с заказчиком:**
   - Уточнение по Славянской броне (Epic Knights vs. slavicarmory)
   - Подтверждение полноты Сарацинского комплекта (3 части достаточно?)
   - Выбор объема гоплитских наборов для Греции
   - Подтверждение полноты средневекового оружия для Западной Европы

2. **Технические уточнения:**
   - Согласование формата хранения ALLOWED_CRAFTS (явный массив item ID vs. namespace-проверки)
   - Подтверждение структуры craft_groups (10 отдельных групп как описано)

### После утверждения ТЗ:

1. Перестроить `CRAFT_GROUPS` в `nations_core.js` согласно финальной структуре;
2. Собрать финальный whitelist по группам (явный массив item ID);
3. Заполнить `ALLOWED_CRAFTS`;
4. Включить обработчик `PlayerEvents.crafted` с проверкой разрешенных предметов;
5. Провести тестирование крафта по всем нациям.
