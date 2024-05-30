import { _decorator, Button, CCInteger, Component, instantiate, log, Node, Prefab, Vec2, Vec3 } from 'cc';
import { Singleton } from '../Other/Singleton';
import { BlockManager } from '../GamePlay/Block/Manager/BlockManager';
import { ButtonLevel } from './ButtonLevel';


const { ccclass, property } = _decorator;

@ccclass('LevelControl')
export class LevelControl extends Singleton<LevelControl> {
    // properties a list of number levels
    @property([CCInteger])
    levels: number[] = [];

    @property([Prefab])
    maps: Prefab[] = [];

    @property(Prefab)
    buttonLevel: ButtonLevel = null;

    @property(Prefab)
    buttonParentPrefab: Node = null;

    @property(Node)
    mapParent: Node = null;

    @property(Node)
    buttonParentLocation: Node = null;

    @property(Node)
    mapParentLocation: Node = null;

    buttonParent: Node = null;
    startPos: Vec3 = new Vec3(0, 0, 0);
    currentLevel: number;

    onLoad() {
        this.buttonParent = instantiate(this.buttonParentPrefab);
        this.buttonParentLocation.addChild(this.buttonParent);
        this.startPos = this.buttonParent.getChildByName('StartPostion').position;
        this.createLevelButton();        
    }

    createLevelButton() {
        for (let i = 0; i < this.levels.length; i++) {
            let button = instantiate(this.buttonLevel);
            button = button.getComponent(ButtonLevel);
            button.node.parent = this.buttonParent;
            button.node.position = new Vec3(this.startPos.x + (i % 3 * 300), this.startPos.y, this.startPos.z);
            button.setInfo(this.levels[i], this.levels[i], this);
            if (i % 3 == 2) {
                this.startPos.y -= 300;
            }
        }
    }

    loadLevel(level: number) {
        log(this.currentLevel)
        if (level > this.levels.length) {
            this.mapParentLocation.active = false;
            this.buttonParentLocation.active = true;
            return;
        }
        if (this.mapParent.children.length > 0) {
            this.destroyMap();
        }
        BlockManager.instance.getComponent(BlockManager).resetBlockManager();
        let map = instantiate(this.maps[level-1]);
        this.mapParent.addChild(map);
        this.buttonParentLocation.active = false;
        this.mapParentLocation.active = true;
    }

    nextLevel() {
        this.destroyMap();
        this.currentLevel++;
        this.loadLevel(this.currentLevel);
    }

    destroyMap() {
        this.mapParent.removeAllChildren();
    }
}


