# Установка / Деплой

## Требования

Следующие моды должны быть установлены в сборке Forge 1.20.1:

| Мод | Назначение |
|-----|------------|
| **KubeJS** (Forge) | Скрипты, регистрация предметов, data/assets pack |
| **Origins** (Forge) | Система выбора origin (используется как GUI наций) |
| **Apoli** (Forge) | Движок powers для Origins |
| **GameStages** | Система стадий для отслеживания нации игрока |
| **RecipeStages** | Ограничение рецептов по стадиям (перспектива) |

## Деплой

Содержимое папки `kubejs/` копируется **целиком** в `.minecraft/kubejs/`:

```
nations-craft-system/kubejs/  →  .minecraft/kubejs/
```

Файлы НЕ конфликтуют со стандартной структурой KubeJS — используется отдельный namespace `nations`.

### Команды для деплоя (Windows)

```cmd
:: Из корня репозитория:
xcopy /E /Y kubejs "%APPDATA%\.minecraft\kubejs\"
```

Или для PrismLauncher:

```cmd
xcopy /E /Y kubejs "D:\Games\PrismLauncher\instances\1.20.1\minecraft\kubejs\"
```

## Проверка после деплоя

1. Запустить клиент/сервер
2. В логах должно появиться: `[Nations] Initialized 14 nation teams with i18n prefixes`
3. При первом входе игрок видит экран выбора нации
4. После выбора в чате отображается цветной префикс `[SCAN]`, `[BYZ]` и т.д.
5. Проверить стадию: `/gamestage info <player>` → должна быть `nation_<id>`

## Обновление файлов

При изменении файлов в репозитории:
1. Скопировать обновлённые файлы в `.minecraft/kubejs/`
2. В игре: `/kubejs reload server_scripts` (для серверных скриптов)
3. Для data/assets: требуется перезапуск клиента/сервера
