import { _decorator, Component, EventTouch, log, Node, Vec2, Vec3 } from 'cc';
import { HorizontalBlock } from './HorizontalBlock';
import { LevelControl } from '../../../LevelControl/LevelControl';

const { ccclass, property } = _decorator;

@ccclass('KeyBlock')
export class KeyBlock extends HorizontalBlock {

    // @property(Node)
    // winPos: Node = null;

   checkWin() {
        // let pos = this.node.position;
        // let winPos = this.winPos.position;
        // if (Vec3.distance(pos, winPos) < 10) {
        //     return true;
        // }
        // return false;
        let checkPos = this.mapSize + this.blockSize/2;
        if (Math.abs(this.node.position.x - checkPos) < 10) {
            return true;
        }
   } 

   findLimit(): void {
       super.findLimit();
       this.limitPosRight = this.limitPosRight < this.mapSize ? this.limitPosRight : this.mapSize + this.blockSize * 2;
   }

   onTouchEnd(event: EventTouch): void {
        super.onTouchEnd(event);
        if (this.checkWin()) {
            LevelControl.getInstance().nextLevel();
        }
   }
}


