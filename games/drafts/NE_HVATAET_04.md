# Не хватает · «Найди пару» (04)

Библиотека PNG_LIBRARY не подключена — **сверь с библиотекой**, что уже есть (слонёнок, носки, иконки паузы/уха могут быть).

## Картинки
Уже вставлены (2026-09-30): predmet_dom, predmet_kot, predmet_delfin (вместо рыбы), predmet_myach, predmet_banan, predmet_zont, predmet_sova, predmet_yabloko, predmet_luna, predmet_grib, predmet_lodka, predmet_dva_noska (шахматку убрал `tools/ubrat_shahmatku.py`), predmet_ryba (рыба вернулась, дельфин остался 13-м предметом). Лежат в `assets/images/`.

Хвост стиля (добавлять к каждому промпту):
> flat warm vector illustration, thick dark-brown outline, earthy warm palette (terracotta, ochre, olive green, cream, soft brown), rounded simple shapes, friendly calm expression, children's educational game asset, centered, full figure, transparent background, PNG, no text, no letters unless specified, no drop shadow, very round shapes, big eyes, chubby proportions, cute

| Файл | Размер | Промпт (начало, потом хвост) |
|---|---|---|
| geroy_slonenok_topa_privet.png | 1024×1024 | a small friendly baby elephant named Topa waving hello with trunk raised, |
| geroy_slonenok_topa_smotrit.png | 1024×1024 | the same baby elephant looking attentively forward, curious, sitting, |
| geroy_slonenok_topa_raduetsya.png | 1024×1024 | the same baby elephant happy, trunk up, gentle smile, |
| geroy_slonenok_topa_dyshit.png | 1024×1024 | the same baby elephant sitting calmly with eyes half closed, breathing in, peaceful, |
| geroy_slonenok_topa_mashet.png | 1024×1024 | the same baby elephant waving goodbye with its ear and trunk, |
| predmet_shapka.png | 512×512 | a knitted winter hat, |
| ikonka_rubashka_karty.png | 512×512 | card back pattern, a simple ochre square with a small elephant footprint in the center, no character, |
| ikonka_tropa_rovnaya.png | 512×512 | a flat easy meadow path with grass, |
| ikonka_tropa_gornaya.png | 512×512 | a winding path going up a gentle mountain, |
| ikonka_pauza.png | 512×512 | pause icon, two rounded vertical bars in a circle, |
| ikonka_uho.png | 512×512 | a friendly ear icon, |
| ikonka_dalshe.png | 512×512 | a rounded arrow pointing right, play icon, |
| ikonka_esche_raz.png | 512×512 | a rounded circular arrow, repeat icon, |
| ikonka_domoy.png | 512×512 | a small house icon for home button, |

Важно: все 12 предметов — **разные по силуэту и цвету**, чтобы ребёнок не путал (кот и сова не одного цвета). Одинаковый масштаб, объект во весь кадр.

## Голос
**Записан и вшит 2026-09-30** (все 16 фраз, нарезка по паузам, исходник `assets/audio/zapis_04_vse_frazy.m4a`). Послушай в игре: если какая-то фраза обрезана или не та — скажи номер.

Памятка: Windows «Звукозапись», не Телеграм. Один раздел — один файл. Между строками пауза 2 секунды. Ошибся — скажи «брак» и прочитай заново. Нарезка — `narezka-ozvuchki-golosom`. Говорить медленно, тепло.

**Раздел «начало»**
- 04_nachalo_1.mp3 — Привет! Я слонёнок Топа. Поищем пары?
- 04_nachalo_2.mp3 — Подыши со мной. Вдох… и выдох.

**Раздел «игра»**
- 04_igra_1.mp3 — Посмотри и запомни.
- 04_igra_2.mp3 — Найди две одинаковые.
- 04_igra_3.mp3 — Найди картинку и слово к ней.
- 04_igra_4.mp3 — Пара!
- 04_igra_5.mp3 — Не пара. Ищем дальше.
- 04_igra_6.mp3 — Посмотри, где светится.

**Раздел «тропа»**
- 04_tropa_1.mp3 — Какую тропу выберешь?
- 04_tropa_2.mp3 — Горная тропа! Смотри внимательно.
- 04_tropa_3.mp3 — Идём по нашей тропе.

**Раздел «конец» и «мостик»**
- 04_konec_1.mp3 — Все пары нашлись. Подышим спокойно.
- 04_most_1.mp3 — Отнеси телефон маме, папе или бабушке. Покажи, что получилось.
- 04_most_2.mp3 — Найдите дома две одинаковые вещи: два носка или две ложки.
- 04_most_3.mp3 — Покажи маме, какую тропу ты выбрал.
- 04_most_4.mp3 — Если все заняты — покажи игрушке. А взрослым — вечером.

Опционально позже: названия предметов (slovo_kot.mp3 … slovo_zont.mp3), чтобы Топа называл открытую картинку.
