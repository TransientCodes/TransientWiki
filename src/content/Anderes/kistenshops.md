<div class="md-banner">
    <h1 style="margin: 0;">Kistenshops</h1>
</div>

Verkaufe Items direkt von einer Kiste, einem Barrel oder einer Trapped-Kiste — mit einem einfachen Schild.

## Shop erstellen

Platziere ein **Schild** direkt neben, über oder unter einem Container und beschrifte es in diesem Format:

```
[leer lassen]
[Menge]
[Preis]
?
```

| Zeile | Inhalt | Beispiel |
|---|---|---|
| 1 | Leer lassen — wird automatisch zu deinem Namen | — |
| 2 | Menge pro Transaktion | `16` |
| 3 | Handelsart + Preis | `B250` |
| 4 | `?` — wird automatisch zum Item im Container | `?` |

Das Schild schließen bestätigt die Erstellung. Du erhältst eine Bestätigung im Chat.

## Handelsarten

Die dritte Zeile bestimmt, ob du **verkaufst** oder **ankaufst**:

| Präfix | Bedeutung |
|---|---|
| `B` | **Verkaufsshop** — Shop verkauft Items an Spieler |
| `S` | **Ankaufsshop** — Shop kauft Items von Spielern |

Du kannst **beide Modi gleichzeitig** auf einem Schild einrichten:

```
[Name]
16
B250/S120
?
```

Hier verkauft der Shop für 250 Pfund, und kauft für 120 Pfund an — alles auf einem Schild.

## Mit einem Shop handeln

- **Rechtsklick** auf das Schild → Items **kaufen**
- **Linksklick** auf das Schild → Items **verkaufen**
- **Shift + Klick** → gesamten Stack auf einmal kaufen/verkaufen

## Shop entfernen

Um deinen Shop zu entfernen:

1. **Schleiche** (Shift gedrückt halten)
2. **Brich das Schild** ab

Der Container selbst kann **nicht** abgebaut werden, solange ein Shop daran befestigt ist.

<div class="md-note">
Bestehende Shops können nicht bearbeitet werden. Um Preis oder Menge zu ändern, entferne das Schild und erstelle den Shop neu.
</div>

## Vertrauensspieler

Mit `/trustshop <Spieler>` gibst du einem anderen Spieler Zugriff auf deinen Shop-Container. Nochmals ausführen entfernt den Zugriff wieder.

## Einnahmen teilen

Mit `/shareincome <Spieler> <Prozent>` kannst du einen Anteil deiner Shop-Einnahmen automatisch an einen anderen Spieler weitergeben. Praktisch für gemeinsam betriebene Shops.

## Valide Container

Kistenshops funktionieren mit:
- Kiste
- Trapped-Kiste
- Barrel

## Befehle

| Befehl | Funktion |
|---|---|
| `/trustshop <Spieler>` | Spieler Zugriff auf den Shop-Container geben/entziehen |
| `/shareincome <Spieler> <Prozent>` | Einnahmen prozentual teilen |
| `/shopinfo` | Informationen über einen Shop anzeigen |
