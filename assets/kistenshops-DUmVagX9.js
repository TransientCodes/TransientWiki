const e=`## Unser ContainerShop-System

### Anleitung: Einen Shop per Schild erstellen

Um einen ContainerShop anzulegen, platzierst du ein Schild an einem gültigen Container.  
Das Schild muss exakt in einem bestimmten Format beschrieben sein, damit das System es als Shop erkennt.

### Aufbau des Schildes

Ein Shop-Schild besteht aus **vier Zeilen**, die jeweils eine bestimmte Funktion haben:

1. **Erste Zeile:**  
   \`Leere Zeile\`  
   Sobald du den Shop bestätigst (also das Schild schließt), ersetzt das System diese Zeile durch deinen Spielernamen.  
   Dadurch ist sichtbar, wem der Shop gehört.

2. **Zweite Zeile:**  
   Die **Menge** des Items, das pro Transaktion gehandelt werden soll.  
   Beispiele: \`1\`, \`16\`, \`64\`

3. **Dritte Zeile:**  
   Die **Handelsart inklusive Preis**.  
   Das System kombiniert dafür einen Buchstaben mit einer Zahl:  
   - \`B\` → **Verkaufsshop** (Shop verkauft Items an Spieler)  
   - \`S\` → **Ankaufsshop** (Shop kauft Items vom Spieler)  

   Direkt dahinter schreibst du den **Preis**, ohne Leerzeichen.  
   Beispiele:  
   - \`B250\` → Shop **verkauft** Items für **250**  
   - \`S120\` → Shop **kauft** Items für **120**

4. **Vierte Zeile:**  
   \`?\`  
   Ein Platzhalter, der vom System später zu dem Item, das sich in dem Container befindet gemacht wird.

---

### Valide Container

Ein ContainerShop kann an folgenden Blöcken erstellt werden:

- Kiste  
- Trapped-Kiste  
- Barrel  

Andere Container werden nicht unterstützt.`;export{e as default};
