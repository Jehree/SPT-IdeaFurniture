import { DependencyContainer } from "tsyringe";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { PreSptModLoader } from "@spt/loaders/PreSptModLoader";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { ITraderConfig } from "@spt/models/spt/config/ITraderConfig";
import { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig";
import { Traders } from "@spt/models/enums/Traders";
import { TraderHelper } from "../src/trader_helper";
import traderJson = require("../db/trader.json");
import assortJson = require("../db/assort.json");
import { CurrencyId, FileUtils, InitStage, ModHelper } from "../src/mod_helper";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { SimpleItem } from "./types";
import { IItem } from "@spt/models/eft/common/tables/IItem";
import items from "../db/items.json";
import { IBarterScheme } from "@spt/models/eft/common/tables/ITrader";
const customItems = items as SimpleItem[];
const itemData: string[] = [];

class Mod implements IPreSptLoadMod, IPostDBLoadMod {
    public TraderHelper: TraderHelper;
    public Helper = new ModHelper();

    public preSptLoad(container: DependencyContainer): void {
        this.Helper.init(container, InitStage.PRE_SPT_LOAD);

        const preSptModLoader: PreSptModLoader = container.resolve<PreSptModLoader>("PreSptModLoader");
        const traderConfig: ITraderConfig = this.Helper.configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const ragfairConfig = this.Helper.configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

        this.TraderHelper = new TraderHelper();
        //this.TraderHelper.registerProfileImage(traderJson, ModHelper.modName, preSptModLoader, this.Helper.imageRouter, "ideafurniture.png");
        this.Helper.imageRouter.addRoute(traderJson.avatar.replace(".png", ""), "user/mods/IdeaFurniture/res/ideafurniture.png");
        this.TraderHelper.setTraderUpdateTime(traderConfig, traderJson, 3600, 4000);

        ragfairConfig.traders[traderJson._id] = false;
    }

    public postDBLoad(container: DependencyContainer): void {
        this.Helper.init(container, InitStage.POST_DB_LOAD);

        this.TraderHelper.addTraderToDb(traderJson, this.Helper.dbTables, this.Helper.jsonUtil);
        this.Helper.dbTraders[traderJson._id].assort.loyal_level_items = {};
        this.TraderHelper.addTraderToLocales(
            traderJson,
            this.Helper.dbTables,
            traderJson.name,
            traderJson.nickname,
            traderJson.nickname,
            traderJson.location,
            "Your favorite local furniture store."
        );
        for (const item of customItems) {
            itemData.push(item.id);
        }
        for (const item of customItems) {
            this.addSimpleItemToDb(item);
            this.addSimpleItemToTraderAssort(item);
        }
    }

    private addSimpleItemToDb(itemTemplate: SimpleItem): void {
        const itemClone: ITemplateItem = FileUtils.jsonClone<ITemplateItem>(this.Helper.dbItems[itemTemplate.itemType]);

        itemClone._id = itemTemplate.id;
        itemClone._name = itemTemplate.name;
        itemClone._props.Name = itemTemplate.name;
        itemClone._props.ShortName = itemTemplate.name;
        itemClone._props.Description = itemTemplate.description;
        itemClone._props.Width = itemTemplate.width;
        itemClone._props.Height = itemTemplate.height;
        itemClone._props.Weight = itemTemplate.weight;
        itemClone._props.Prefab.path = itemTemplate.bundlePath;

        if (itemTemplate.itemType === "5df8a4d786f77412672a1e3b") {
            // Builders Backpack
            itemClone._props.Grids[0]._props.cellsH = 6;
            itemClone._props.Grids[0]._props.cellsV = 40;
            itemClone._props.Grids[0]._props.filters[0].Filter = itemData;
            itemClone._props.Grids[0]._props.filters[0].Filter.push("67893431dcad180324ddcc1d", "67893bbeafe8250ed0fe6770");
        }
        if (itemTemplate.itemType === "5c0a840b86f7742ffa4f2482") {
            // Container Items
            if (itemTemplate.id === "678ff6a08def9feca215636e") {
                //Large Ammo Box
                itemClone._props.Grids[0]._props.cellsH = 7;
                itemClone._props.Grids[0]._props.cellsV = 5;
                itemClone._props.Grids[0]._props.filters[0].Filter = [];
                itemClone._props.Grids[0]._props.filters[0].Filter.push(
                    "5485a8684bdc2da71d8b4567",
                    "543be5cb4bdc2deb348b4568",
                    "5448bc234bdc2d3c308b4569"
                );
            }
            if (itemTemplate.id === "678ff754fa2aee130bf269da") {
                //Stubby Ammo Box
                itemClone._props.Grids[0]._props.cellsH = 6;
                itemClone._props.Grids[0]._props.cellsV = 6;
                itemClone._props.Grids[0]._props.filters[0].Filter = [];
                itemClone._props.Grids[0]._props.filters[0].Filter.push(
                    "5485a8684bdc2da71d8b4567",
                    "543be5cb4bdc2deb348b4568",
                    "5448bc234bdc2d3c308b4569"
                );
            }
            if (itemTemplate.id === "678ff749a1b18d76f8bb08d0") {
                //Small Ammo Box
                itemClone._props.Grids[0]._props.cellsH = 5;
                itemClone._props.Grids[0]._props.cellsV = 4;
                itemClone._props.Grids[0]._props.filters[0].Filter = [];
                itemClone._props.Grids[0]._props.filters[0].Filter.push(
                    "5485a8684bdc2da71d8b4567",
                    "543be5cb4bdc2deb348b4568",
                    "5448bc234bdc2d3c308b4569"
                );
            }
            if (itemTemplate.id === "678ff7ec91e978af07400932") {
                //Massive Supply Case
                itemClone._props.Grids[0]._props.cellsH = 10;
                itemClone._props.Grids[0]._props.cellsV = 20;
                itemClone._props.Grids[0]._props.filters[0].Filter = [];
                itemClone._props.Grids[0]._props.filters[0].Filter.push(
                    "5448fe124bdc2da5018b4567",
                    "5422acb9af1c889c16000029",
                    "5485a8684bdc2da71d8b4567",
                    "543be5cb4bdc2deb348b4568",
                    "5448bc234bdc2d3c308b4569",
                    "5448eb774bdc2d0a728b4567"
                );
            }
            if (itemTemplate.id === "678ff970bbb8bdc6515a87b2") {
                //Fridge
                itemClone._props.Grids[0]._props.cellsH = 7;
                itemClone._props.Grids[0]._props.cellsV = 9;
                itemClone._props.Grids[0]._props.filters[0].Filter = [];
                itemClone._props.Grids[0]._props.filters[0].Filter.push("5448e8d04bdc2ddf718b4569", "5448e8d64bdc2dce718b4568");
            }
        }

        this.Helper.dbItems[itemTemplate.id] = itemClone;

        this.Helper.dbHandbook.Items.push({
            Id: itemTemplate.id,
            ParentId: "5b47574386f77428ca22b2ee",
            Price: itemTemplate.fleaPrice,
        });

        for (const langKey in this.Helper.dbLocales.global) {
            const locale = this.Helper.dbLocales.global[langKey];
            locale[`${itemTemplate.id} Name`] = itemTemplate.name;
            locale[`${itemTemplate.id} ShortName`] = itemTemplate.name;
            locale[`${itemTemplate.id} Description`] = itemTemplate.description;
        }
    }

    private addSimpleItemToTraderAssort(itemTemplate: SimpleItem): void {
        const trader = this.Helper.dbTraders[traderJson._id];

        const barter: IBarterScheme = {
            count: itemTemplate.cost,
            _tpl: CurrencyId.RUB,
        };

        const item: IItem = {
            _id: itemTemplate.assortId,
            _tpl: itemTemplate.id,
            parentId: "hideout",
            slotId: "hideout",
            upd: {
                UnlimitedCount: true,
                StackObjectsCount: 999999,
                BuyRestrictionMax: 999999,
                BuyRestrictionCurrent: 0,
            },
        };

        trader.assort.items.push(item);
        trader.assort.barter_scheme[itemTemplate.assortId] = [[barter]];
        trader.assort.loyal_level_items[itemTemplate.assortId] = itemTemplate.loyaltyLevel;
    }
}

export const mod = new Mod();
