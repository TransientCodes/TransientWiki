const e=`<div class="md-banner" style="border-left: 4px solid #ffaa00;">
    <h1 style="margin: 0;">Kulte & Verwaltung</h1>
</div>

Hier erfährst du, wie du einen Kult gründest und verwaltest.

## Einen Kult gründen

Jeder Spieler kann einen eigenen Kult gründen. Dies ist der erste Schritt, um Zugriff auf Bank, Levelsystem und Fraktionen zu erhalten.

**Befehl:** \`/kult create <Name> <Tag>\`
* **Name:** Der vollständige Name deines Kults (z.B. "DieWächter").
* **Tag:** Ein kurzes Kürzel (3-4 Zeichen), das im Chat angezeigt wird (z.B. "WACH").

## Wichtige Befehle

| Befehl | Beschreibung |
| :--- | :--- |
| \`/kult info\` | Zeigt Informationen über deinen oder einen anderen Kult an. |
| \`/kult invite <Spieler>\` | Lädt einen Spieler in deinen Kult ein. |
| \`/kult accept\` | Nimmt eine Kult-Einladung an. |
| \`/kult kick <Spieler>\` | Entfernt einen Spieler aus dem Kult. |
| \`/kult leave\` | Verlässt den aktuellen Kult. |
| \`/kult chat <Nachricht>\` | Sendet eine Nachricht nur an Kult-Mitglieder. |
| \`/kult setmotd <Nachricht>\` | Setzt die "Nachricht des Tages", die beim Login angezeigt wird. |
| \`/kult donate <Betrag>\` | Spendet Pfund in die Kult-Kasse, die sich in Rubine für Level-Aufstiege umwandeln. |
| \`/kult menu\` | Öffnet das Hauptmenü des Kults. |

## Einstellungen

Im Kult-Menü (\`/kult\`) kannst du verschiedene Einstellungen vornehmen:
* **Beschreibung:** Ändere die öffentliche Beschreibung deines Kults.
* **Tag-Farbe:** Wähle eine Farbe für deinen Kult-Tag (wird durch Level freigeschaltet).
* **Sichtbarkeit:** Stelle ein, ob dein Kult öffentlich gelistet werden soll.

<div class="md-note">
    <strong>Tipp:</strong> Nutze <code>@kult</code> oder <code>@clan</code> vor deiner Chatnachricht, um schnell in den Kult-Chat zu schreiben! (wird ab Level 4 freigeschaltet)
</div>
`;export{e as default};
