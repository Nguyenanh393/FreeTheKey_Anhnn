import { _decorator, Canvas, Component, EventTouch, find, log, Node, UITransform, Vec2, Vec3 } from 'cc';
import { BlockManager } from '../Manager/BlockManager';

const { ccclass, property } = _decorator;

@ccclass('VerticalBlock')
export class VerticalBlock extends Component {
    @property(Canvas)
    canvas: Canvas = null;

    blockSize : number;
    halfBlockSize : number;
    mapSize : number;
    size: Vec2;
    currentPos: Vec3;
    limitPosDown : number;
    limitPosUp : number;
    blockManager: BlockManager = null;
    number: number = 0;

    OnInit(size: Vec2, pos: Vec3, blockNumber: number) {
        this.canvas = find('Canvas').getComponent(Canvas);
        this.currentPos = pos.clone();
        this.size = size;
        this.number = blockNumber;
        
        this.blockManager = BlockManager.instance.getComponent(BlockManager);
        this.blockSize = this.blockManager.blockWidth;
        this.halfBlockSize = this.blockSize / 2;
        this.mapSize = this.blockSize * 3 + this.halfBlockSize;
        this.limitPosDown = -this.mapSize;
        this.limitPosUp = this.mapSize;

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);    
        this.canvas.node.on(Node.EventType.MOUSE_UP, this.onTouchEnd, this);
        this.canvas.node.on(Node.EventType.MOUSE_LEAVE, this.onTouchEnd, this);
        
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
            this.node.position = direction > 0 ? new Vec3(this.node.position.x, this.limitPosUp - this.size.y / 2 - this.halfBlockSize, this.node.position.z) :
                                                new Vec3(this.node.position.x, this.limitPosDown + this.size.y / 2 + this.halfBlockSize, this.node.position.z);
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
        var div = Math.round(this.size.y / this.blockSize);
        BlockManager.instance.getComponent(BlockManager).indexs = [];
        if (div % 2 == 0) {
            let y = Math.round(pos.y / this.blockSize) * this.blockSize;
            this.node.position = new Vec3(pos.x, y, pos.z);
            for (let i = 0; i < div; i++) {
                this.replaceBlockPosition(new Vec3(pos.x, this.currentPos.y - this.size.y / 2 + this.halfBlockSize + this.blockSize * i, pos.z),
                                          new Vec3(pos.x, y - this.size.y / 2 + this.halfBlockSize + this.blockSize * i,  pos.z));
            }
        }
        else {
            let y = Math.round((pos.y - this.halfBlockSize) / this.blockSize) * this.blockSize + this.halfBlockSize;
            this.node.position = new Vec3(pos.x, y, pos.z);

            for (let i = 0; i < div; i++) {
                this.replaceBlockPosition(new Vec3(pos.x, this.currentPos.y - this.size.y / 2 + this.halfBlockSize + this.blockSize * i, pos.z),
                                          new Vec3(pos.x, y - this.size.y / 2 + this.halfBlockSize + this.blockSize * i, pos.z));
            }
        }
    }

    findLimit() {
        // log('Find limit');
        let distance = this.size.y / 2;
        let posConditionUp = new Vec3(this.currentPos.x, this.currentPos.y + distance + this.halfBlockSize, 0);
        let posConditionDown = new Vec3(this.currentPos.x, this.currentPos.y - distance - this.halfBlockSize, 0);
        // cache the BlockManager instance
        let minUp = this.mapSize;
        let maxDown = -this.mapSize;

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
        let distance = this.size.y / 2 + this.halfBlockSize;
        if (pos.y + distance + movement> this.limitPosUp) {
            return false;
        }
        return true;
    }

    canMoveDown(movement: number = 0) {
        let pos = this.node.position;
        let distance = this.size.y / 2 + this.halfBlockSize;
        if (pos.y - distance + movement < this.limitPosDown) {
            return false;
        }
        return true;
    }

    setLocatedPosition() {
        let pos = this.node.position;
        let x = pos.x;
        let y = pos.y;

        var div = Math.round(this.size.y / this.blockSize);
        if (div % 2 == 0) {
            this.addBlockPosition(new Vec3(x, y + this.halfBlockSize));
            this.addBlockPosition(new Vec3(x, y - this.halfBlockSize));
        }
        else {
            this.addBlockPosition(new Vec3(x, y));
            this.addBlockPosition(new Vec3(x, y - this.blockSize));
            this.addBlockPosition(new Vec3(x, y + this.blockSize));
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


