import { _decorator, Canvas, Component, EventTouch, find, Node, UITransform, Vec2, Vec3 } from 'cc';
import { BlockManager } from './BlockManager';
const { ccclass, property } = _decorator;

const SIZE_BLOCK = 135;
const SIZE_BLOCK_HALF = SIZE_BLOCK / 2;
const SIZE_MAP = SIZE_BLOCK * 3 + SIZE_BLOCK_HALF;
@ccclass('VerticalBlock')
export class VerticalBlock extends Component {
    @property(Canvas)
    canvas: Canvas = null;

    size: Vec2;
    currentPos: Vec3;
    limitPosDown = -SIZE_MAP;
    limitPosUp = SIZE_MAP;
    blockManager: BlockManager = null;

    onEnable() {
        this.canvas = find('Canvas').getComponent(Canvas);
        this.currentPos = this.node.position.clone();
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);    
        this.canvas.node.on(Node.EventType.MOUSE_UP, this.onTouchEnd, this);
        this.size = new Vec2(this.node.getComponent(UITransform).width, this.node.getComponent(UITransform).height);
        this.blockManager = BlockManager.instance.getComponent(BlockManager);
        this.setLocatedPosition();
    }

    onDisable() {
        this.canvas.node.off(Node.EventType.MOUSE_UP, this.onTouchEnd, this);
        this.canvas.node.off(Node.EventType.MOUSE_LEAVE, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        this.currentPos = this.node.position.clone();
        this.findLimit();
    }

    onTouchMove(event: EventTouch) {
        let delta = event.getUIDelta();
        let direction = delta.y > 0 ? 1 : -1;
        let movement = delta.y;
        if ((this.canMoveUp(movement) && direction == 1) ||
            (this.canMoveDown(movement) && direction == -1)) {
            this.node.position = this.node.position.add3f(0, movement, 0);
        } else {
            this.node.position = direction > 0 ? new Vec3(this.node.position.x, this.limitPosUp - this.size.y / 2 - SIZE_BLOCK_HALF, this.node.position.z) :
                                                new Vec3(this.node.position.x, this.limitPosDown + this.size.y / 2 + SIZE_BLOCK_HALF, this.node.position.z);
        }
    }

    onTouchEnd(event: EventTouch) {
        this.move(); 
        //log('V: ',this.node.position,'V: ', this.currentPos);
        // log(BlockManager.instance.getComponent(BlockManager).blockPosition);

        if (Vec3.distance(this.node.position, this.currentPos) > 0.1) {
            this.blockManager.stepCount++;
            this.blockManager.stepLabel.string = '' + this.blockManager.stepCount;
        }
        this.currentPos = this.node.position.clone();
        this.findLimit();
    }

    move() {
        let pos = this.node.position;
        var div = Math.round(this.size.y / SIZE_BLOCK);
        BlockManager.instance.getComponent(BlockManager).indexs = [];
        if (div % 2 == 0) {
            let y = Math.round(pos.y / SIZE_BLOCK) * SIZE_BLOCK;
            this.node.position = new Vec3(pos.x, y, pos.z);
            for (let i = 0; i < div; i++) {
                this.replaceBlockPosition(new Vec3(pos.x, this.currentPos.y - this.size.y / 2 + SIZE_BLOCK_HALF + SIZE_BLOCK * i, pos.z),
                                          new Vec3(pos.x, y - this.size.y / 2 + SIZE_BLOCK_HALF + SIZE_BLOCK * i,  pos.z));
            }
        }
        else {
            let y = Math.round((pos.y - SIZE_BLOCK_HALF) / SIZE_BLOCK) * SIZE_BLOCK + SIZE_BLOCK_HALF;
            this.node.position = new Vec3(pos.x, y, pos.z);

            for (let i = 0; i < div; i++) {
                this.replaceBlockPosition(new Vec3(pos.x, this.currentPos.y - this.size.y / 2 + SIZE_BLOCK_HALF + SIZE_BLOCK * i, pos.z),
                                          new Vec3(pos.x, y - this.size.y / 2 + SIZE_BLOCK_HALF + SIZE_BLOCK * i, pos.z));
            }
        }
    }

    findLimit() {
        // log('Find limit');
        let distance = this.size.y / 2;
        let posConditionUp = new Vec3(this.currentPos.x, this.currentPos.y + distance + SIZE_BLOCK_HALF, 0);
        let posConditionDown = new Vec3(this.currentPos.x, this.currentPos.y - distance - SIZE_BLOCK_HALF, 0);
        // cache the BlockManager instance
        let minUp = SIZE_MAP;
        let maxDown = -SIZE_MAP;

        for (let i = 0; i < this.blockManager.blockPosition.length; i++) {
            let pos = this.blockManager.blockPosition[i];
            if (posConditionUp.x == pos.x && posConditionUp.y <= pos.y) {
                minUp = Math.min(minUp, pos.y);
            }
            if (posConditionDown.x == pos.x && posConditionDown.y >= pos.y) {
                maxDown = Math.max(maxDown, pos.y);
            }
        }

        this.limitPosUp = minUp;
        this.limitPosDown = maxDown;

        // log('Limit right: ', this.limitPosUp);
        // log('Limit left: ', this.limitPosDown);
    }

    canMoveUp(movement: number = 0) {
        let pos = this.node.position;
        let distance = this.size.y / 2 + SIZE_BLOCK_HALF;
        if (pos.y + distance + movement> this.limitPosUp) {
            return false;
        }
        return true;
    }

    canMoveDown(movement: number = 0) {
        let pos = this.node.position;
        let distance = this.size.y / 2 + SIZE_BLOCK_HALF;
        if (pos.y - distance + movement < this.limitPosDown) {
            return false;
        }
        return true;
    }

    setLocatedPosition() {
        let pos = this.node.position;
        let x = pos.x;
        let y = pos.y;

        var div = Math.round(this.size.y / SIZE_BLOCK);
        if (div % 2 == 0) {
            this.addBlockPosition(new Vec3(x, y + SIZE_BLOCK_HALF));
            this.addBlockPosition(new Vec3(x, y - SIZE_BLOCK_HALF));
        }
        else {
            this.addBlockPosition(new Vec3(x, y));
            this.addBlockPosition(new Vec3(x, y - SIZE_BLOCK));
            this.addBlockPosition(new Vec3(x, y + SIZE_BLOCK));
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


