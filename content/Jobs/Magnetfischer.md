[[Jobs Allgemein]]

## Beschreibung

Angeln von Gegenständen: Was der Fischer fängt, hängt vom Level, von der Angelrute und auch vom Ort ab (RPG-Welt).

## Tools




## Fähigkeiten




## Aufgaben



## Anderes



```java
 ItemStack[] lootTableMisc = new ItemStack[]{new ItemBuilder(Material.LEATHER_BOOTS).build(), (new ItemBuilder(Material.ACACIA_BOAT)).build(), (new ItemBuilder(Material.AMETHYST_SHARD)).setDisplayname("§d§lFÜXIS KRISTALLI").build()};
ItemStack[] lootTableFish = new ItemStack[]{new ItemBuilder(Material.CLAY_BALL).setCustomModelData(10085).setDisplayname("§fRegenbogenbarsch").build(), new ItemBuilder(Material.CLAY_BALL).setCustomModelData(10084).setDisplayname("§fGilguppy").build()};
ItemStack[] lootTableTreasury = new ItemStack[]{(new ItemBuilder(Material.GOLD_NUGGET)).build(), (new ItemBuilder(Material.IRON_NUGGET)).build()};
//
//


package de.phyx.transientrealm.logic;

import java.util.Arrays;
import java.util.Iterator;
import net.kyori.adventure.text.Component;
import org.bukkit.Color;
import org.bukkit.Material;
import org.bukkit.enchantments.Enchantment;
import org.bukkit.inventory.ItemFlag;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;
import org.bukkit.inventory.meta.PotionMeta;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;

public class ItemBuilder {
    private ItemMeta itemMeta;
    private ItemStack itemStack;

    public ItemBuilder(Material mat) {
        this.itemStack = new ItemStack(mat);
        this.itemMeta = this.itemStack.getItemMeta();
    }

    public ItemBuilder setDisplayname(String s) {
        this.itemMeta.setDisplayName(s);
        return this;
    }

    public ItemBuilder setDisplayname(Component s) {
        this.itemMeta.displayName(s);
        return this;
    }

    public ItemBuilder setLocalizedName(String s) {
        this.itemMeta.setLocalizedName(s);
        return this;
    }

    public ItemBuilder setLore(String... s) {
        this.itemMeta.setLore(Arrays.asList(s));
        return this;
    }

    public ItemBuilder setUnbreakable(boolean s) {
        this.itemMeta.setUnbreakable(s);
        return this;
    }

    public ItemBuilder addItemFlags(ItemFlag... s) {
        this.itemMeta.addItemFlags(s);
        return this;
    }

    public ItemBuilder setCustomModelData(int data) {
        this.itemMeta.setCustomModelData(data);
        return this;
    }

    public ItemBuilder setPotionID(int data) {
        if (this.itemStack.getType() == Material.POTION) {
            PotionMeta meta = (PotionMeta)this.itemMeta;
            meta.setCustomModelData(data);
        }

        return this;
    }

    public ItemBuilder setPotionMeta(PotionMeta potionMeta) {
        PotionMeta potionMeta1 = (PotionMeta)this.itemMeta;
        Iterator var3 = potionMeta.getCustomEffects().iterator();

        if (var3.hasNext()) {
            itemStack.setItemMeta(potionMeta);
            PotionEffect effectType = (PotionEffect)var3.next();
            potionMeta1.setColor(potionMeta.getColor());
            potionMeta1.setCustomModelData(potionMeta.getCustomModelData());
            potionMeta1.addCustomEffect(new PotionEffect(effectType.getType(), effectType.getDuration(), effectType.getAmplifier()), true);
            potionMeta1.setBasePotionData(potionMeta.getBasePotionData());
            return this;
        } else {
            itemStack.setItemMeta(potionMeta);
            return this;
        }
    }

    public ItemBuilder setItemMeta(ItemMeta meta){
        itemStack.setItemMeta(meta);
        return this;
    }

    public ItemBuilder setAmount(int amount) {
        this.itemStack.setAmount(amount);
        return this;
    }

    public ItemBuilder addEnchant(Enchantment enchantment, int level) {
        this.itemMeta.addEnchant(enchantment, level, true);
        return this;
    }

    public ItemBuilder setPotionEffect(PotionEffectType effect, Color color, int duration, int amplifier) {
        if (this.itemStack.getType() == Material.POTION) {
            PotionMeta meta = (PotionMeta)this.itemMeta;
            if (effect == null) {
                meta.addCustomEffect(new PotionEffect(PotionEffectType.LUCK, 3600, 0), true);
                meta.removeCustomEffect(PotionEffectType.LUCK);
                meta.setDisplayName("§8Seltsamer Trank");
                meta.setColor(Color.BLUE);
                return this;
            }

            meta.addCustomEffect(new PotionEffect(effect, duration, amplifier), true);
            meta.setColor(color);
        }

        return this;
    }

    public String toString() {
        return "ItemBuilder{itemMeta=" + this.itemMeta + ", itemStack=" + this.itemStack + '}';
    }

    public ItemStack build() {
        this.itemStack.setItemMeta(this.itemMeta);
        return this.itemStack;
    }
}
```