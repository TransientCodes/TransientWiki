[[Jobs Allgemein]]

## Beschreibung

Verantwortlich für das Töten der Tiere (auch Material für den Gastronom), der Metzger verarbeitet das Fleisch aber auch für den Gastronom.

## Tools




## Fähigkeiten




## Aufgaben



## Anderes


````Java
@EventHandler public void onEntityDeath(EntityDeathEvent event){ //Fleischer jobXP(event.getEntity().getKiller(), 4, 3, 13, EntityType.CHICKEN, event.getEntityType(), "§c§l\uD83E\uDD69"); jobXP(event.getEntity().getKiller(), 6, 4, 13, EntityType.COW, event.getEntityType(), "§c§l\uD83E\uDD69"); jobXP(event.getEntity().getKiller(), 12, 8, 13, EntityType.MOOSHROOM, event.getEntityType(), "§c§l\uD83E\uDD69"); jobXP(event.getEntity().getKiller(), 5, 3.8, 13, EntityType.PIG, event.getEntityType(), "§c§l\uD83E\uDD69"); jobXP(event.getEntity().getKiller(), 6, 4.3, 13, EntityType.RABBIT, event.getEntityType(), "§c§l\uD83E\uDD69"); jobXP(event.getEntity().getKiller(), 5.5, 4, 13, EntityType.SHEEP, event.getEntityType(), "§c§l\uD83E\uDD69"); jobXP(event.getEntity().getKiller(), 3, 3, 13, EntityType.COD, event.getEntityType(), "§c§l\uD83E\uDD69"); jobXP(event.getEntity().getKiller(), 3, 4, 13, EntityType.SALMON, event.getEntityType(), "§c§l\uD83E\uDD69"); jobXP(event.getEntity().getKiller(), 6, 7, 13, EntityType.TROPICAL_FISH, event.getEntityType(), "§c§l\uD83E\uDD69"); jobXP(event.getEntity().getKiller(), 8, 8, 13, EntityType.GOAT, event.getEntityType(), "§c§l\uD83E\uDD69");



public void jobXP(Player player, double xp, double pfundXp, int jobID, EntityType type, EntityType actualType, String icon){ if (type.equals(actualType)) { playerDB.addJobXP(xp * getJobEPFormel(jobID, player.getUniqueId()), player.getUniqueId(), jobID); playerDB.addJobPfund(pfundXp * pfundMultiplier[playerDB.getJobLvl(player.getUniqueId(), jobID)], player.getUniqueId(), jobID); checkEPforLevelUp(player.getUniqueId(), jobID); if (checkEPforLevelUp(player.getUniqueId(), jobID)) { player.sendActionBar(icon + " §8| §7Du hast §6" + Maths.formatedDouble(xp * getJobEPFormel(jobID, player.getUniqueId())) + " JOB-EP §7gesammelt! §8(§7" + Maths.formatedDouble(playerDB.getJobXP(player.getUniqueId(), jobID)) + "§6/§7" + getJobRequirement(jobID, player.getUniqueId()) + "§8) §e" + Maths.formatedDouble(playerDB.getJobPfund(player.getUniqueId(), jobID)) + "§8/§7100§6\ueff1 §8| " + icon); } } }
```