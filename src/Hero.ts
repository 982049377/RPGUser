var Cache: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {
    const getter = desc.get;
    desc.get = function () {
        //console.log(target);//引用时的类
        //console.log(propertyName)//接下来的函数
        //console.log(this);
        if (this["fightHeroPowerCache"] != null && !this["flag"]) {
            return this["fightHeroPowerCache"];
        } else {
            this["fightHeroPowerCache"] = getter.apply(this);
            //return getter.apply(this);
        }
        //console.log(this["fightHeroPowerCache"]);
        return this["fightHeroPowerCache"];
    }
    return desc;
}
enum heroQualitySort {
    C,//普通
    B,//稀有
    A,//史诗
    S//传说
}

class Hero extends egret.DisplayObjectContainer {
    configId: string;

    static Id = 0;
    identityID: number = 0;

    exp: Bignumber;

    level: number = 0;

    name: string;

    initialAtk: number = 0;

    physique: number = 0;//体质

    _bitmap: egret.Bitmap;

    get maxHP() {
        var maxhp: number;
        switch (this.quality) {
            case heroQualitySort.A:
                maxhp = this.physique * 0.7;
                break;
            case heroQualitySort.B:
                maxhp = this.physique * 0.6;
                break;
            case heroQualitySort.C:
                maxhp = this.physique * 0.5;
                break;
            case heroQualitySort.S:
                maxhp = this.physique * 0.8;
                break;
        }
        return maxhp;
    }
    get Atk() {
        var atk = 0;
        switch (this.quality) {
            case heroQualitySort.A:
                atk = this.initialAtk + this.level * 0.7;
                break;
            case heroQualitySort.B:
                atk = this.initialAtk + this.level * 0.6;
                break;
            case heroQualitySort.C:
                atk = this.initialAtk + this.level * 0.5;
                break;
            case heroQualitySort.S:
                atk = this.initialAtk + this.level * 0.8;
                break;
        }
        this.equipments.forEach(equipment => atk += equipment.Atk);
        return atk;
    }
    get atkDiscript() {
        return "ATK:   ";
    }

    initialDef: number = 0;

    get Def() {
        var def = 0;
        switch (this.quality) {
            case heroQualitySort.A:
                def = this.initialDef + this.level * 0.7;
                break;
            case heroQualitySort.B:
                def = this.initialDef + this.level * 0.6;
                break;
            case heroQualitySort.C:
                def = this.initialDef + this.level * 0.5;
                break;
            case heroQualitySort.S:
                def = this.initialDef + this.level * 0.8;
                break;
        }
        this.equipments.forEach(equipment => def += equipment.Def);
        return def;
    }
    get defDiscript() {
        return "DEF:   ";
    }
    quality: heroQualitySort;
    static equipmentLimit = 5;
    equipmentCurrent = 0;
    equipments: Equipment[];

    isInTeam: boolean;

    // get Atk() {
    //     var result = 0;
    //     this.equipments.forEach(equipment => result += equipment.Atk)
    //     return result;
    // }
    private _cacheHeroFightPower = 0;
    public flag: boolean = false;
    @Cache
    get fightPower() {
        // if (this._cacheHeroFightPower && !Hero.flag) {
        //     console.log("Hero.flag" + Hero.flag);
        //     return this._cacheHeroFightPower;
        // }
        // if (!this._cacheHeroFightPower) {
        var result = this.Atk * 1.2 + this.Def * 0.8;//攻击防御已经计算到hero中了
        //this.equipments.forEach(equipment => result += equipment.fightPower);
        // this._cacheHeroFightPower = result;
        // }
        //console.log(result);
        return result;
    }
    constructor() {
        super();
        this.configId = "";
        this.name = "";
        this.exp = new Bignumber();
        this.isInTeam = false;
        this.equipments = [];
        Hero.Id++;
        this.identityID = Hero.Id;
        this._bitmap = new egret.Bitmap();
        this._bitmap.scaleX = 1.5;
        this._bitmap.scaleY = 1.5;
        this._bitmap.x = 0;
        this._bitmap.y = 0;
        this.addChild(this._bitmap);
    }

    setinformation(id: string, name: string, atk: number, def: number, quality: heroQualitySort,bitmap: egret.Bitmap) {
        this.configId = id;
        this.name = name;
        this.initialAtk = atk;
        this.initialDef = def;
        this.quality = quality;
        this._bitmap.texture = bitmap.texture;
        tool.anch(this._bitmap);
        this._bitmap.touchEnabled = true;
        var heroBar = new heroStatusBar();
        this._bitmap.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            heroBar.setInformation(this);
            this.addChild(heroBar);
            //this.swapChildren(heroBar,this._bitmap);
        }, this);
    }
    addEquipment(user: User, equipment: Equipment) {
        if (this.equipmentCurrent < Hero.equipmentLimit) {
            this.equipments.push(equipment);
            user.flag = true;
            this.flag = true;
            this.equipmentCurrent++;
        } else {
            console.error("装备超过上限");
        }

    }
    removeEquipment(user: User, equipment: Equipment) {
        if (this.equipmentCurrent <= 0)
            console.error("没有装备可以卸载");
        else {
            var index = this.equipments.indexOf(equipment);
            this.equipments.splice(index);
            user.flag = true;
            this.flag = true;
        }
    }
   
}

