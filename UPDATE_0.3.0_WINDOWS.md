# QuestFrame 0.3.0 — обновление с 0.2.0 (Windows)

## 1. Заменить файлы

Распакуй архив и скопируй содержимое папки `questframe` поверх текущей папки проекта:

```text
P:\Projects\QuestFrame\questframe
```

При запросе Windows выбери **«Заменить файлы в папке назначения»**. Файл `.env.local` в архив не входит, поэтому твои ключи не перезаписываются.

## 2. Supabase

Для версии 0.3.0 **никакой новый SQL запускать не нужно**. Используется тот же один проект Supabase.

## 3. Установить зависимости

```powershell
cd P:\Projects\QuestFrame\questframe
npm install
```

Не запускай `npm audit fix --force`: npm предлагает для части dev-зависимостей breaking downgrade/замены, которые нам здесь не нужны.

## 4. Проверить проект

```powershell
npm run typecheck
npm run lint
npm run build
```

Все три команды должны завершиться без ошибок.

## 5. Локальный запуск

```powershell
npm run dev
```

Открой:

```text
http://localhost:3000
```

Проверь:

1. В поле даты введи `11102026` — должно автоматически стать `11.10.2026`.
2. В русском интерфейсе подписи над разделами должны быть на русском.
3. Вкладка «Серии» должна показывать повторяемые действия компактными строками с историей за 7 дней.
4. На главной больше нет информационных карточек «Система XP» и «Без наказания за пропуск».
5. Во вкладке «Справка» должны быть правила XP, серии, босс недели, награды и контакты.
6. Заголовок вкладки браузера должен начинаться с `QuestFrame`, а не `Shelf Seasons`.

## 6. Git

После успешной проверки:

```powershell
Ctrl + C
git status
git add .
git commit -m "feat: refine streaks help and date input"
git push
```

## 7. Vercel

Так как GitHub auto-deploy у тебя пока не подключился, после push выполни:

```powershell
npx vercel --prod
```

Текущий production alias можно продолжать использовать:

```text
https://questframe.vercel.app
```

Отдельный Supabase beta/dev-проект не нужен.
