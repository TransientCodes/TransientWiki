\## Unser ContainerShop-System



\### Anleitung: Einen Shop per Schild erstellen



Um einen ContainerShop anzulegen, platzierst du ein Schild an einem Container (z. B. Chest, Barrel, Shulker).  

Das Schild muss in einem ganz bestimmten Format geschrieben sein, damit das System es korrekt erkennt.



\### Aufbau des Schildes



Das Schild besteht aus \*\*vier Zeilen\*\*, die jeweils eine spezielle Bedeutung haben:



1\. \*\*Erste Zeile:\*\*  

&nbsp;  `--`  

&nbsp;  Diese Zeile dient als Erkennungsmarker. Sie signalisiert dem System, dass dieses Schild als Shop interpretiert werden soll.



2\. \*\*Zweite Zeile:\*\*  

&nbsp;  \*\*Menge des Items\*\*, das gehandelt wird.  

&nbsp;  Hier gibst du die Anzahl der Items an, die pro Transaktion gekauft oder verkauft werden sollen.  

&nbsp;  Beispiele: `1`, `16`, `64`



3\. \*\*Dritte Zeile:\*\*  

&nbsp;  \*\*Handelsart\*\*, also ob der Shop ankauft oder verkauft.  

&nbsp;  Es gibt zwei Optionen:  

&nbsp;  - `B` → \*\*Verkaufsshop\*\* (der Shop verkauft Items an Spieler)  

&nbsp;  - `S` → \*\*Ankaufsshop\*\* (der Shop kauft Items vom Spieler an)  

&nbsp;  Das System entscheidet anhand dieses Buchstabens, wie der Handel abläuft.



4\. \*\*Vierte Zeile:\*\*  

&nbsp;  `?`  

&nbsp;  Dies ist ein Platzhalter. Das System ersetzt ihn automatisch durch den passenden Preis, sobald der Shop erstellt wurde oder zeigt ihn später aktualisiert an.  

&nbsp;  Der `?` zeigt also: \*Hier wird der Preis vom Plugin gesetzt.\*



---



\### Valide Container:



\- Kiste

\- Trapped-Kiste

\- Barrel

