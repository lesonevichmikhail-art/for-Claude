"""Собрать единую методичку: python3 tools/sobrat_metodichku.py  ->  metodichka/METODICHKA_sobrannaya.md
Порядок: титул, книга принципов, карты игр (по имени файла), журнал обучения."""
import glob, os, datetime
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'metodichka')
def read(p): return open(p, encoding='utf-8').read().strip()
parts = ['# Методичка проекта «Дядя Миша» / «Первый класс без слёз»\n\nАвтор: Михаил Лесоневич. Собрано автоматически %s. Эффект игр не замерен, всё помеченное «гипотеза» требует проверки на детях.' % datetime.date.today().isoformat()]
parts.append(read(os.path.join(root, '00_obshchie_principy.md')))
for p in sorted(glob.glob(os.path.join(root, 'igry', '*.md'))): parts.append(read(p))
parts.append(read(os.path.join(root, 'ZHURNAL_OBUCHENIYA.md')))
out = os.path.join(root, 'METODICHKA_sobrannaya.md')
open(out, 'w', encoding='utf-8').write('\n\n---\n\n'.join(parts) + '\n')
print('ok', os.path.relpath(out), len(parts) - 3, 'карт игр')
