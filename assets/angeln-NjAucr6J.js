const e=`<div class="md-banner" style="border-left: 4px solid #00aaaa;">
    <h1 style="margin: 0;">Angeln</h1>
</div>

Das Gewässer birgt viele Geheimnisse — von gewöhnlichen Fischen bis hin zu seltenen Schätzen.

## Das Angelminispiel

Angeln auf dem Server ist kein einfaches Warten: Wenn ein Fisch anbeißt, startet automatisch ein **Minigame**.

Im Titel wird ein Fortschrittsbalken mit einer **grünen Zielzone** angezeigt. Ein Marker bewegt sich automatisch nach rechts. Deine Aufgabe:

- **Rechtsklick** drücken, um den Marker in Richtung der Zielzone zu ziehen
- Den Marker **in der Zielzone halten**, bis der Halte-Timer abläuft
- Du hast insgesamt ca. **20 Sekunden** Zeit — danach entkömmt der Fisch

Die Action-Bar zeigt dir dabei: Haltezeit, Fortschritt in %, und die verbleibende Gesamtzeit.

## Schwierigkeitsgrade

Jeder Fang hat eine zufällig bestimmte Schwierigkeit. Seltenere Fische sind schwerer zu fangen:

| Schwierigkeit | Chance | Zielzone | Abdrift |
|---|---|---|---|
| Sehr Leicht | ~20% | Groß | Gering |
| Leicht | ~40% | Mittel | Gering |
| Mittel | ~30% | Mittel | Mittel |
| Schwer | ~8% | Klein | Hoch |
| Sehr Schwer | ~2% | Sehr klein | Sehr hoch |

## Fischqualität & Gewicht

Jeder gefangene Fisch hat zwei zufällige Attribute:

**Qualität** (beeinflusst den Verkaufswert):
| Qualität | Häufigkeit |
|---|---|
| Zäh | ~30% |
| Essbar | ~26% |
| Schmackhaft | ~22% |
| Delikat | ~13% |
| Gourmet | ~9% |

**Gewicht** (in kg) — beeinflusst ebenfalls den Verkaufswert stark. Je schwerer, desto mehr Pfund.

## Biome & Regionen

Verschiedene Fische können nur in bestimmten **Biomen** oder Regionen gefangen werden. Im Citybuild-Bereich gibt es andere Fische als in der Farmwelt. Manche seltenen Fische benötigen zusätzlich eine Angel mit der **Rodpower**-Verzauberung.

Die genauen Fundorte der Fische sind **absichtlich nicht dokumentiert** — das Entdecken gehört zum Spielerlebnis. Nutze das \`/anglerbuch\`, um zu sehen, welche Arten du noch nicht gefangen hast.

## Der Angelbeutel

Der **Angelbeutel** ist eine spezielle Tasche für deine Fische:

- Rechtsklick mit dem Beutel in der Hand zum Öffnen
- Fasst bis zu **45 Fische**
- Zeigt Gesamtgewicht, Anzahl und Durchschnittsqualität an
- Fische die du aufhebst landen **automatisch im Beutel**, sofern er in deinem Inventar ist
- Du kannst Fische aus dem Beutel herausnehmen und wieder hineinlegen

## Angel-Trader

Beim **Angel-Trader** kannst du deine Fische für Pfund verkaufen:

1. Öffne den Angeltrader (NPC am Spawn)
2. Lege deine Fische oder deinen Angelbeutel in das GUI
3. Klicke auf **„Alles anbieten"**, um alle Fische aus deinem Inventar anzubieten
4. Klicke auf **„Verkaufen"**, um alles auf einmal zu verkaufen

Der Preis richtet sich nach **Gewicht** und **Qualität** des Fischs. Gourmet-Fische mit hohem Gewicht erzielen die besten Preise.

## Anglerbuch

Das **Anglerbuch** ist deine persönliche Fisch-Enzyklopädie:

- Öffnen mit \`/anglerbuch\`
- Zeigt alle Fischarten auf dem Server
- Entdeckt (✓) vs. noch nicht gefangen (✗)
- Beim **Erstfang** einer neuen Fischart ertönt ein besonderer Sound

Das Anglerbuch ist auch über den Angel-Trader zugänglich (Buch-Symbol im GUI).

## Angeln-Verzauberungen

Spezielle Verzauberungen für deine Angelrute:

| Verzauberung | Effekt |
|---|---|
| **Rodpower** | Ermöglicht das Fangen von Fischen mit höherer Anforderung (seltenere Arten). Wird durch das Kombinieren des richtigen Siegels am **Amboss** erhalten. |
| **Qualitätssteigerung** | Erhöht die Wahrscheinlichkeit auf bessere Fischqualität |
| **Gewichtssteigerung** | Fische werden schwerer → höherer Verkaufswert |

## Befehle

| Befehl | Funktion |
|---|---|
| \`/anglerbuch\` | Öffnet das Anglerbuch (Fisch-Enzyklopädie) |
`;export{e as default};
