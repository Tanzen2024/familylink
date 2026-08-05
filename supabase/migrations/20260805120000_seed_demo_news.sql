/*
# Seed demo news articles

Adds a handful of fictional news articles to the `news` table so the
"Actualités" page has representative content to design/preview against.

## Notes

- Purely content seeding — no schema or policy changes.
- Text-only entries (no photo_url/video_url) to avoid depending on
  external hotlinked media.
- Safe to re-run: guarded by a check on `title` so it won't duplicate
  rows if the migration is applied more than once.
*/

INSERT INTO news (title, content, published_at)
SELECT * FROM (VALUES
  (
    'Le forum « Les Petits-Fils Menthong » est officiellement lancé',
    E'C''est officiel : notre espace d''échange commun est en ligne.\n\nAprès plusieurs semaines de préparation, le forum « Les Petits-Fils Menthong » ouvre ses portes à tous les cousins, proches et lointains, qui souhaitent reprendre contact avec la grande famille.\n\nChacun est invité à s''inscrire, à se présenter, et surtout à transmettre les noms et coordonnées des cousins qui ne sont pas encore parmi nous. Plus nous serons nombreux, plus notre mémoire commune sera riche.',
    '2026-07-28 09:00:00+00'
  ),
  (
    'Appel à contribution : aidez-nous à recenser tous nos cousins',
    E'Vous connaissez un cousin, une tante ou un grand-oncle qui n''a pas encore rejoint l''aventure ? Écrivez-nous son nom et, si possible, un moyen de le contacter.\n\nCe recensement est la première brique de notre association : sans lui, nous risquons de laisser des branches entières de la famille en dehors de ce grand rassemblement.\n\nUn formulaire simplifié sera bientôt disponible ; en attendant, un message à un membre du bureau suffit.',
    '2026-07-15 10:30:00+00'
  ),
  (
    'La cellule de réflexion est constituée',
    E'Comme annoncé dans notre manifeste, une petite cellule de réflexion vient de se former. Sa mission n''est pas de décider à la place de tous, mais de préparer, organiser et donner une première direction claire à nos actions communes.\n\nElle travaillera notamment sur l''ordre du jour de notre première rencontre virtuelle et sur les grandes lignes du futur règlement de l''association.',
    '2026-06-30 14:00:00+00'
  ),
  (
    'Première rencontre virtuelle : notez la date dans vos agendas',
    E'Notre toute première rencontre en visioconférence se prépare. Ce sera l''occasion de nous voir, de nous découvrir et de poser ensemble les bases de l''association.\n\nLe lien de connexion et l''ordre du jour détaillé seront publiés prochainement dans une nouvelle actualité et partagés sur le forum.',
    '2026-06-10 08:15:00+00'
  ),
  (
    'Un mot de nos aînés pour encourager l''initiative',
    E'Plusieurs de nos parents ont tenu à saluer cette initiative née parmi les petits-fils Menthong. Leur message est simple : « Ce que vous entreprenez aujourd''hui, c''est ce que nous avons toujours espéré voir naître. »\n\nLeur soutien et leurs bénédictions sont pour nous le plus bel encouragement à continuer.',
    '2026-05-20 16:45:00+00'
  )
) AS seed(title, content, published_at)
WHERE NOT EXISTS (
  SELECT 1 FROM news WHERE news.title = seed.title
);
