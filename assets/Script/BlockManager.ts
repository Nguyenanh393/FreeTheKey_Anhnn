import { _decorator, Component, Label, log, Node, Vec2, Vec3 } from 'cc';
import { Singleton } from './Other/Singleton';
import { LevelControl } from './LevelControl';
const { ccclass, property } = _decorator;

@ccclass('BlockManager')
export class BlockManager extends Singleton<BlockManager> {
    blockPosition: Vec3[] = [];
    indexs: number[] = [];
    stepCount: number = 0;

    @property(LevelControl)
    levelControl: LevelControl = null;

    @property(Label)
    stepLabel: Label = null;

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
}


