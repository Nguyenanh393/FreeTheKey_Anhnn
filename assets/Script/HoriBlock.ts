import { _decorator, Canvas, Component, EventTouch, find, log, Node, UITransform, Vec2, Vec3 } from 'cc';
import { BlockManager } from './BlockManager';
import { KeyBlock } from './KeyBlock';
const { ccclass, property } = _decorator;

const SIZE_MAP = 350;
@ccclass('HoriBlock')
export class HoriBlock extends Component {
    @property(Canvas)
    canvas: Canvas = null;

    size: Vec2;
    currentPos: Vec3;
    limitPosLeft = -SIZE_MAP;
    limitPosRight = SIZE_MAP;
    blockManager: BlockManager = null;

    start() {
        this.canvas = find('Canvas').getComponent(Canvas);
        this.currentPos = this.node.position.clone();
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);    
        this.canvas.node.on(Node.EventType.MOUSE_UP, this.onTouchEnd, this);
        this.size = new Vec2(this.node.getComponent(UITransform).width, this.node.getComponent(UITransform).height);
        this.blockManager = BlockManager.instance.getComponent(BlockManager);
        this.setLocatedPosition();
    }

    onTouchStart(event: EventTouch) {
        this.currentPos = this.node.position.clone();
        this.findLimit();
    }

    onTouchMove(event: EventTouch) {
        let delta = event.getDelta();
        if (this.canMoveLeft() && this.canMoveRight()){
            this.node.position = this.node.position.add3f(delta.x * 1.5, 0, 0);
        }

        if (this.node.getComponent(KeyBlock)) {
            this.node.getComponent(KeyBlock).checkWin();
        }
    }

    onTouchEnd(event: EventTouch) {
        this.move(); 
        //log('V: ',this.node.position,'V: ', this.currentPos);
        //log(BlockManager.instance.getComponent(BlockManager).blockPosition);
        this.currentPos = this.node.position.clone();
        this.findLimit();
    }

    move() {
        let pos = this.node.position;
        var div = Math.round(this.size.x / 100);
        BlockManager.instance.getComponent(BlockManager).indexs = [];
        if (div % 2 == 0) {
            let x = Math.round(pos.x / 100) * 100;
            this.node.position = new Vec3(x, pos.y, pos.z);
            for (let i = 0; i < div; i++) {
                this.replaceBlockPosition(new Vec3(this.currentPos.x - this.size.x / 2 + 50 + 100 * i, pos.y, pos.z),
                                          new Vec3(x - this.size.x / 2 + 50 + 100 * i, pos.y, pos.z));
            }
        }
        else {
            let x = Math.round((pos.x - 50) / 100) * 100 + 50;
            this.node.position = new Vec3(x, pos.y, pos.z);

            for (let i = 0; i < div; i++) {
                this.replaceBlockPosition(new Vec3(this.currentPos.x - this.size.x / 2 + 50 + 100 * i, pos.y, pos.z),
                                          new Vec3(x - this.size.x / 2 + 50 + 100 * i, pos.y, pos.z));
            }
        }
    }

    findLimit() {
        //log('Find limit');
        let distance = this.size.x / 2;
        let posConditionRight = new Vec3(this.currentPos.x + distance + 50, this.currentPos.y, 0);
        let posConditionLeft = new Vec3(this.currentPos.x - distance - 50, this.currentPos.y, 0);
        // cache the BlockManager instance
        let minRight = SIZE_MAP;
        let maxLeft = -SIZE_MAP;

        for (let i = 0; i < this.blockManager.blockPosition.length; i++) {
            let pos = this.blockManager.blockPosition[i];
            if (posConditionRight.y == pos.y && posConditionRight.x <= pos.x) {
                minRight = Math.min(minRight, pos.x);
            }
            if (posConditionLeft.y == pos.y && posConditionLeft.x >= pos.x) {
                maxLeft = Math.max(maxLeft, pos.x);
            }
        }

        this.limitPosRight = minRight;
        this.limitPosLeft = maxLeft;

        // log('Limit right: ', this.limitPosRight);
        // log('Limit left: ', this.limitPosLeft);
    }

    canMoveRight() {
        let pos = this.node.position;
        let distance = this.size.x / 2 + 50;
        if (pos.x + distance > this.limitPosRight) {
            return false;
        }
        return true;
    }

    canMoveLeft() {
        let pos = this.node.position;
        let distance = this.size.x / 2 + 50;
        if (pos.x - distance < this.limitPosLeft) {
            return false;
        }
        return true;
    }

    canMoveOnMap() {
        let pos = this.node.position;
        let distance = this.size.x / 2;
        if (pos.x - distance < - SIZE_MAP || pos.x + distance > SIZE_MAP)
        {
            return false;
        }
        return true;
    }

    

    setLocatedPosition() {
        let pos = this.node.position;
        let x = pos.x;
        let y = pos.y;

        var div = Math.round(this.size.x / 100);
        if (div % 2 == 0) {
            this.addBlockPosition(new Vec3(x + 50, y));
            this.addBlockPosition(new Vec3(x - 50, y));
        }
        else {
            this.addBlockPosition(new Vec3(x, y));
            this.addBlockPosition(new Vec3(x - 100, y));
            this.addBlockPosition(new Vec3(x + 100, y));
        }
    }

    addBlockPosition(pos: Vec3) {
        this.blockManager.addBlockPosition(pos);
    }

    replaceBlockPosition(pos: Vec3, newPos: Vec3) {
        this.blockManager.replaceBlockPosition(pos, newPos);
    }

    getBlockPosition(pos: Vec3) {
        return this.blockManager.blockPosition.indexOf(pos);
    }
    

}


