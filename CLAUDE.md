# Verdikt

Verdikt este o aplicație web care evaluează mașini pentru revânzare: cât să dai pe o mașină, cât să ceri la vânzare și ce profit poți scoate.

Acest fișier stabilește regulile proiectului. Respectă-le pentru orice cod scris aici.

## Stack tehnologic

- **Framework:** Next.js (App Router).
- **Limbaj:** TypeScript.
- **Stilizare:** Tailwind CSS.
- **Bază de date:** Supabase.
- **Deploy:** Vercel.

## Structura de foldere

- `app/` — pagini și rute (App Router).
- `app/api/` — logica de server și rutele API.
- `components/` — componente de interfață.
- `types/` — tipuri TypeScript partajate.

Ține fiecare lucru la locul lui: o pagină nu conține logică de server care ar trebui să stea într-o rută API, iar o componentă rămâne despre interfață.

## Reguli de cod

- TypeScript în mod strict. Fără `any` acolo unde există un tip corect. Tipurile partajate stau în `types/`.
- Componente mici și clare, cu o singură responsabilitate. Dacă o componentă crește prea mult, sparge-o.
- Fără cod duplicat. Extrage logica repetată în funcții sau componente reutilizabile.
- Comentarii doar unde chiar ajută (de ce, nu ce). Codul evident nu are nevoie de comentarii.

## Securitate

- Cheile de API și secretele stau **NUMAI pe server**, în variabile de mediu (env vars). **NICIODATĂ** în codul care ajunge la client.
- Apelurile către servicii externe se fac **din rutele API** (`app/api/`), nu direct din componentele client.
- Variabilele expuse clientului (prefix `NEXT_PUBLIC_`) nu conțin niciodată secrete.

## Calitate

- Fiecare ecran are stări clare: **loading**, **gol** (fără date) și **eroare**. Nu lăsa niciodată utilizatorul în fața unui ecran mut.
- Validează inputurile — și pe client (pentru feedback rapid), și pe server (pentru siguranță).
- Fără crash-uri necontrolate. Folosește **error boundaries** ca o eroare într-o parte a interfeței să nu dărâme tot ecranul.

## UX

- **Mobile-first.** Aplicația se folosește în principal pe telefon; proiectează întâi pentru ecran mic, apoi extinde.
- **Accesibil:** focus vizibil pe navigarea din taste, contrast bun al textului, respectă `prefers-reduced-motion` (fără animații agresive pentru cine le-a dezactivat).
- **Textele din interfață sunt în română**, la persoana simplă și directă. Fără limbaj tehnic inutil.
