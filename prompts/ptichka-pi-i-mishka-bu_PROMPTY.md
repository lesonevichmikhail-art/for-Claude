# «Птичка Пи и Мишка Бу» — промпты картинок и фразы для голоса

Эталоны стиля уже есть: `bird_pi.png` и `bear_bu.png` (лежат в `assets/images/`).
Прикрепляйте к каждому промпту одну из них как референс: для Птички `bird_pi.png`, для Мишки `bear_bu.png`, для остальных любую.
Готовые PNG кладите в `assets/images/` с именем ровно как в заголовке. Я сам вошью их в игру.

---

## Картинки (9 штук)

### 1. `bird_pi_sing.png`
```
Same style as reference image. Same bird, same proportions, same color.

The same small yellow-brown bird sitting on the same branch, beak wide open, singing happily, head slightly raised, eyes half-closed with joy.
Transparent background. No text, no shadows.
```

### 2. `bird_pi_sleep.png`
```
Same style as reference image. Same bird, same proportions, same color.

The same small yellow-brown bird sitting on the same branch, dozing calmly: eyes closed as soft curved lines, beak closed, feathers slightly fluffed, peaceful.
Transparent background. No text, no shadows.
```

### 3. `bird_pi_bye.png`
```
Same style as reference image. Same bird, same proportions, same color.

The same small yellow-brown bird standing on the same branch, one wing raised and waving goodbye, friendly smile in the eyes.
Transparent background. No text, no shadows.
```

### 4. `bear_bu_growl.png`
```
Same style as reference image. Same bear, same proportions, same color.

The same brown bear cub standing, mouth open wide in a deep friendly growl, kind eyes, paws relaxed at his sides. Not scary, playful.
Transparent background. No text, no shadows.
```

### 5. `bear_bu_sleep.png`
```
Same style as reference image. Same bear, same proportions, same color.

The same brown bear cub sitting and dozing calmly: eyes closed as soft curved lines, paws resting on his belly, peaceful.
Transparent background. No text, no shadows.
```

### 6. `bear_bu_bye.png`
```
Same style as reference image. Same bear, same proportions, same color.

The same brown bear cub standing, one paw raised and waving goodbye, warm smile.
Transparent background. No text, no shadows.
```

### 7. `breath_bird_bear.png`
```
Same style as reference image.

The same small yellow-brown bird sitting on the head of the same brown bear cub. Both have eyes closed and calm faces, the bear's belly slightly rounded as if breathing in slowly. Peaceful, quiet mood.
Transparent background. No text, no shadows.
```

### 8. `ear_listen.png`
```
Same style as reference image.

One large friendly cartoon ear (simple rounded shape, warm skin tone) with three soft curved sound-wave lines next to it in sage green. Centered.
Transparent background. No text, no shadows.
```

### 9. `trail_same.png`
```
Same style as reference image.

A short flat sandy path winding through soft green grass with two small round bushes on the sides. Calm and inviting. Square composition.
Transparent background. No text, no shadows.
```

### 10. `trail_mountain.png`
```
Same style as reference image.

A narrow path climbing up a gentle rounded mountain with a small orange flag on the top, a few stones along the way. Inviting, not scary. Square composition.
Transparent background. No text, no shadows.
```

---

## Ваш голос (12 коротких фраз)

Запишите каждую фразу отдельным файлом (mp3 или m4a) с именем как в первом столбце, положите в `assets/audio/ptichka/`.
Можно одной длинной записью: я нарежу её по этому списку.
Говорить спокойно, тепло, не торопясь. Между фразами в длинной записи — пауза 2 секунды.

| Файл | Фраза | Когда звучит |
|---|---|---|
| `hello` | Привет! Это Птичка Пи и Мишка Бу. | заставка, после «Играть» |
| `breath` | Подышим вместе. | перед дыханием |
| `learn` | Нажми на героя и послушай. | знакомство |
| `learn_bird` | Птичка поёт высоко. | первый раз нажали на Птичку |
| `learn_bear` | Мишка рычит низко. | первый раз нажали на Мишку |
| `listen` | Слушай до конца. | начало загадки |
| `answer` | Кто пел? | герои проснулись |
| `again` | Послушай ещё раз. | после промаха |
| `invite` | Какую тропу выберешь? | приглашение на тропу |
| `finish` | Спой тонко, как Пи. А теперь низко, как Бу. | финал |
| `bridge` | Покажи маме, какую тропу ты выбрал. | финал, если выбирал тропу |
| `bye` | Пока! До встречи! | прощание |

Похвалу голосом не записываем: после верного ответа звучит сам герой и колокольчик.
