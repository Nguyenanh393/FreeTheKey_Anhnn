import { _decorator, Button, CCInteger, Component, instantiate, log, Node, Prefab, UI, Vec2, Vec3 } from 'cc';
import { Singleton } from '../Other/Singleton';
import { BlockManager } from '../GamePlay/Block/Manager/BlockManager';
import { ButtonLevel } from './ButtonLevel';
import { LevelData } from './LevelData';
import { UIManager } from '../UI/UIManager';
import { LevelSelection } from '../UI/UICanvas/LevelSelection';
import { GamePlay } from '../UI/UICanvas/GamePlay';


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
    currentLevel: number = 0;
    levelDataList: LevelData[] = [];
    // onLoad() {
    //     this.buttonParent = instantiate(this.buttonParentPrefab);
    //     this.buttonParentLocation.addChild(this.buttonParent);
    //     this.startPos = this.buttonParent.getChildByName('StartPostion').position;
    //     this.createLevelButton();        
    // }

    createLevelButton() {
        log('createLevelButton')
        for (let i = 0; i < this.levelDataList.length; i++) {
            if (i % 18 == 0) {
                log('create new button parent')
                this.buttonParent = instantiate(this.buttonParentPrefab);
                this.buttonParentLocation.addChild(this.buttonParent);
                this.startPos = this.buttonParent.getChildByName('StartPostion').position;
            }
            let button = instantiate(this.buttonLevel);
            button = button.getComponent(ButtonLevel);
            button.node.parent = this.buttonParent;
            button.node.position = new Vec3(this.startPos.x + (i % 3 * 300), this.startPos.y, this.startPos.z);
            button.setInfo(this.levels[i], this.levels[i], this);
            if (i % 3 == 2) {
                this.startPos.y -= 300;
            }
            if (i % 18 == 17) {
                this.startPos.y = 0;
            }
        }
    }

    loadLevel(level: number) {
        // if (level > this.levels.length) {
        //     this.mapParentLocation.active = false;
        //     this.buttonParentLocation.active = true;
        //     return;
        // }
        // if (this.mapParent.children.length > 0) {
        //     this.destroyMap();
        // }
        // BlockManager.instance.getComponent(BlockManager).resetBlockManager();
        // let map = instantiate(this.maps[level-1]);
        // this.mapParent.addChild(map);
        // this.buttonParentLocation.active = false;
        // this.mapParentLocation.active = true;
        if (level > this.levelDataList.length) {
            this.mapParentLocation.active = false;
            UIManager.getInstance().closeUI(GamePlay);
            UIManager.getInstance().openUI(LevelSelection);
            return;
        }
        BlockManager.getInstance().getComponent(BlockManager).resetBlockManager();
        BlockManager.getInstance().getComponent(BlockManager).spawnMap(level);

        UIManager.getInstance().closeUI(LevelSelection);
        UIManager.getInstance().openUI(GamePlay);
        this.mapParentLocation.active = true;
    }

    nextLevel() {
        this.destroyMap();
        this.currentLevel++;
        this.loadLevel(this.currentLevel);
    }

    resetLevel() {
        this.destroyMap();
        this.loadLevel(this.currentLevel);
    }

    destroyMap() {
        BlockManager.getInstance().blockParent.removeAllChildren();
    }

    removeAllMap() {
        this.destroyMap();
        this.mapParentLocation.active = false;
    }
}


