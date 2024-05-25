import { _decorator, Component, log, Node, Vec2, Vec3 } from 'cc';
import { HorizontalBlock } from './HorizontalBlock';
const { ccclass, property } = _decorator;

@ccclass('KeyBlock')
export class KeyBlock extends HorizontalBlock {

    @property(Node)
    winPos: Node = null;

   checkWin() {
        let pos = this.node.position;
        let winPos = this.winPos.position;
        if (Vec3.distance(pos, winPos) < 10) {
            return true;
        }
        return false;
   } 
}


