import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, UITransform, Vec2, Vec3 } from 'cc';
import { ReadMap } from '../../Map/ReadMap';
import { Singleton } from '../../../Other/Singleton';
import { HorizontalBlock } from '../Block/HorizontalBlock';
import { VerticalBlock } from '../Block/VerticalBlock';
const { ccclass, property } = _decorator;

@ccclass('BlockManager')
export class BlockManager extends Singleton<BlockManager> {
    blockPosition: Vec3[] = [];
    indexs: number[] = [];
    stepCount: number = 0;

    @property
    blockWidth: number = 0;

    // @property(LevelControl)
    // levelControl: LevelControl = null;

    @property(Label)
    stepLabel: Label = null;

    @property(Prefab)
    horizontalBlockPrefab: Prefab = null;

    @property(Prefab)
    verticalBlockPrefab: Prefab = null;

    @property(Prefab)
    keyBlockPrefab: Prefab = null;

    @property(Node)
    blockParent: Node = null;

    readMap: ReadMap = null;
    currentMapMatrix: number[][] = [];
    start() {
        this.loadMap();
    }
    loadMap() {
        this.readMap = new ReadMap();
        this.readMap.loadJson();
    }

    addBlockPosition(pos: Vec3) {
        this.blockPosition.push(pos);
    }

    replaceBlockPosition(pos: Vec3, newPos: Vec3) {
        
        for (let i = 0; i < this.blockPosition.length; i++) {
            if (Vec3.distance(new Vec3(this.blockPosition[i].x, this.blockPosition[i].y, 0), pos) < 0.1 
                && this.indexs.indexOf(i) == -1) {
                this.blockPosition[i] = new Vec3(newPos.x, newPos.y, 0);
                this.indexs.push(i);
            }
        }
    }


    resetBlockManager() {
        this.blockPosition = [];
        this.indexs = [];
        this.stepCount = 0;
        this.stepLabel.string = '0';
    }

    spawnBlock(pos: Vec3, numSize: number, blockNumber: number, isHorizontal: boolean) {
        let block = blockNumber == 1 ? instantiate(this.keyBlockPrefab) 
                                        : (isHorizontal ? instantiate(this.horizontalBlockPrefab) 
                                                        : instantiate(this.verticalBlockPrefab));
        this.blockParent.addChild(block);
        block.setPosition(pos);
        let sprite = block.getComponent(Sprite);
        if (isHorizontal) {
            sprite.node.getComponent(UITransform).width = this.blockWidth * numSize;
            sprite.node.getComponent(UITransform).height = this.blockWidth;
            let size = new Vec2(this.blockWidth * numSize, this.blockWidth);
            block.getComponent(HorizontalBlock).OnInit(size, pos, blockNumber);
        } else {
            sprite.node.getComponent(UITransform).width = this.blockWidth;
            sprite.node.getComponent(UITransform).height = this.blockWidth * numSize;
            let size = new Vec2(this.blockWidth, this.blockWidth * numSize);
            block.getComponent(VerticalBlock).OnInit(size, pos, blockNumber);
        }
    }
}


