[[Jobs Allgemein]]

## Beschreibung


Der Forscherjob wird ausgelöst, wenn du mit einem Geschichtsstudenten namens Sebastian [[Charactere Der Stadt]] in einer Quest sprichst, in der er dich um Hilfe bei der Suche nach Artefakten bittet Wenn diese Quest angenommen wird, kann der Forscherjob benutzt werden Wenn du ein Artefakt gefunden hast, wird neue Lore freigeschaltet, die dir Sebastian erzählt.

Farm Welt: Baut mit einem bestimmten Werkzeug Sand und Kies ab (nur dann XP) und kann bestimmte Artefakte sammeln, die man einmalig zu einem Geschichtsstudenten (vielleicht auch Museum oder der macht später ein Museum) bringen und zu Geld machen kann. Es gibt verschiedene Artefakt Sets, und wenn diese vollständig sind, wird der Forscher Geheimnisse dieser Welt aufdecken und sie dir mitteilen. Gibt auch Items Außerhalb von Sets die mehrfach verkauft werden können, aber auch Materialien können droppen

RPG-Welt: Hier können einzigartige Gegenstände gefunden werden, manchmal in einer Höhle auf dem Boden, aber auch in einem verlassenen Haus auf dem Schreibtisch; diese können Quest Lines auslösen (meist beim Typ Student).

Beruf erst nach einer bestimmten Quest verfügbar!!!



## Tools

[[Forschertool]]



## Fähigkeiten

2% Chance mit [[Forschertool]] Artefakte Bekommen dann aus 5 listen Ausgewählt


 Siehe [[STARTSEITE]]
1. 40% - 
2. 30% - 
3. 20% - 
4. 9% - 
5. 1% - 




## Aufgaben



## Anderes



```java
    @EventHandler
    public void ArchaeologyBlockBreak(BlockBreakEvent event) {
        // Only for debugging
        if (event.getBlock().getType().equals(Material.WET_SPONGE)) {
            playerDB.setActivatedStatusByUUIDAndJobID(event.getPlayer().getUniqueId().toString(), 4, true);
        }

        if (!playerDB.getActivatedStatusByUUIDAndJobID(event.getPlayer().getUniqueId().toString(), 4)) {
            return;
        }

        double[] chances = new double[]{
                1, 241, 888, 12, 13, 87, 990, 9, 889, 890, 891, 892, 893, 904, 921, 231, 522, 991, 9994
        };
        
        double[] dropChances = new double[]{
                30.0,
                70.0
        };

        ItemStack[] gravelDrops = new ItemStack[]{
                new ItemBuilder(Material.BRUSH).build(),
                new ItemBuilder(Material.DIAMOND).build()
        };
        
        double randomValue = new Random().nextDouble() * 100;
        
        ItemStack selectedDrop = null;
        double cumulativeChance = 0.0;
        for (int i = 0; i < dropChances.length; i++) {
            cumulativeChance += dropChances[i];
            if (randomValue <= cumulativeChance) {
                selectedDrop = gravelDrops[i];
                break;
            }
        }
        
        int chance = new Random().nextInt(chances.length);

        if (chances[chance] >= 992) {
            if (event.getBlock().getType() == Material.GRAVEL) {
                jobXP(event.getPlayer(), 6, 5, 4, "§8§l\uD83C\uDFDB");
                if (selectedDrop != null) {
                    event.getPlayer().getWorld().dropItemNaturally(event.getBlock().getLocation(), selectedDrop);
                }
            }
        } else {
            jobXP(event.getPlayer(), 8, 7, 4, Material.GRAVEL, event.getBlock().getType(), "§8§l\uD83C\uDFDB");
        }
    }
```