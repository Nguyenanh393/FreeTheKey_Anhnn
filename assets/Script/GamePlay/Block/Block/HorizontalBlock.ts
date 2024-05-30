import { _decorator, Canvas, Component, EventTouch, find, log, Node, UITransform, Vec2, Vec3 } from 'cc';
import { BlockManager } from '../Manager/BlockManager';
const { ccclass, property } = _decorator;


@ccclass('HorizontalBlock')
export class HorizontalBlock extends Component {
    @property(Canvas)
    canvas: Canvas = null;

    blockSize : number;
    halfBlockSize : number;
    mapSize : number; // = SIZE_BLOCK * 3 + SIZE_BLOCK_HALF;
    size: Vec2;
    currentPos: Vec3;
    limitPosLeft : number; //= -SIZE_MAP;
    limitPosRight : number; //= SIZE_MAP;
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
        this.limitPosLeft = -this.mapSize;
        this.limitPosRight = this.mapSize;

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
        let direction = delta.x > 0 ? 1 : -1;
        let movement = delta.x;

        if ((this.canMoveLeft(movement) && direction == -1) ||
            (this.canMoveRight(movement) && direction == 1)) {
            this.node.position = this.node.position.add3f(movement, 0, 0);
        }
        else {
            this.node.position = direction > 0 ? new Vec3(this.limitPosRight - this.size.x / 2 - this.halfBlockSize, this.node.position.y, this.node.position.z) :
                                                new Vec3(this.limitPosLeft + this.size.x / 2 + this.halfBlockSize, this.node.position.y, this.node.position.z);
        }
        
    }

    onTouchEnd(event: EventTouch) {
        // log('Touch end');
        this.move(); 
        if (Vec3.distance(this.node.position, this.currentPos) > 0.1) {
            this.blockManager.stepCount++;
            this.blockManager.stepLabel.string = '' + this.blockManager.stepCount;
        }
        this.currentPos = this.node.position.clone();
        this.findLimit();

        // if (this.node.getComponent(KeyBlock)) {
        //     if (this.node.getComponent(KeyBlock).checkWin()) {
        //         this.blockManager.levelControl.nextLevel();
        //     }
        // }
    }

    move() {
        let pos = this.node.position;
        var div = Math.round(this.size.x / this.blockSize);
        this.blockManager.indexs = [];
        if (div % 2 == 0) {
            let x = Math.round(pos.x / this.blockSize) * this.blockSize;
            this.node.position = new Vec3(x, pos.y, pos.z);
            for (let i = 0; i < div; i++) {
                this.replaceBlockPosition(new Vec3(this.currentPos.x - this.size.x / 2 + this.halfBlockSize + this.blockSize * i, pos.y, pos.z),
                                          new Vec3(x - this.size.x / 2 + this.halfBlockSize + this.blockSize * i, pos.y, pos.z));
            }
        }
        else {
            let x = Math.round((pos.x - this.halfBlockSize) / this.blockSize) * this.blockSize + this.halfBlockSize;
            this.node.position = new Vec3(x, pos.y, pos.z);

            for (let i = 0; i < div; i++) {
                this.replaceBlockPosition(new Vec3(this.currentPos.x - this.size.x / 2 + this.halfBlockSize + this.blockSize * i, pos.y, pos.z),
                                          new Vec3(x - this.size.x / 2 + this.halfBlockSize + this.blockSize * i, pos.y, pos.z));
            }
        }
    }

    findLimit() {
        // log('Find limit');
        let distance = this.size.x / 2;
        let posConditionRight = new Vec3(this.currentPos.x + distance + this.halfBlockSize, this.currentPos.y, 0);
        let posConditionLeft = new Vec3(this.currentPos.x - distance - this.halfBlockSize, this.currentPos.y, 0);
        // cache the BlockManager instance
        let minRight = this.mapSize;
        let maxLeft = -this.mapSize;

        for (let i = 0; i < this.blockManager.blockPosition.length; i++) {
            let pos = this.blockManager.blockPosition[i];
            if (posConditionRight.y == pos.y && posConditionRight.x <= pos.x) {
                minRight = Math.min(minRight, pos.x);
            }
            if (posConditionLeft.y == pos.y && posConditionLeft.x >= pos.x) {
                maxLeft = Math.max(maxLeft, pos.x);
            }
        }

        
        this.limitPosLeft = maxLeft;
        this.limitPosRight = minRight;

        // if (this.node.getComponent(KeyBlock)) {
        //         this.limitPosRight = this.limitPosRight < SIZE_MAP ? this.limitPosRight : SIZE_MAP + SIZE_BLOCK * 2;
        // }
    }

    canMoveRight(movement: number = 0) {
        let pos = this.node.position;
        let distance = this.size.x / 2 + this.halfBlockSize;
        // log('Pos: ', pos.x + distance + movement, ' Limit right: ', this.limitPosRight);
        if (pos.x + distance + movement > this.limitPosRight) {
            return false;
        }
        return true;
    }

    canMoveLeft(movement: number = 0) {
        let pos = this.node.position;
        let distance = this.size.x / 2 + this.halfBlockSize;
        if (pos.x - distance + movement < this.limitPosLeft) {
            return false;
        }
        return true;
    }

    canMoveOnMap() {
        let pos = this.node.position;
        let distance = this.size.x / 2;
        if (pos.x - distance < - this.mapSize || pos.x + distance > this.mapSize)
        {
            return false;
        }
        return true;
    }

    

    setLocatedPosition() {
        let pos = this.node.position;
        let x = pos.x;
        let y = pos.y;

        var div = Math.round(this.size.x / this.blockSize);
        if (div % 2 == 0) {
            this.addBlockPosition(new Vec3(x + this.halfBlockSize, y));
            this.addBlockPosition(new Vec3(x - this.halfBlockSize, y));
        }
        else {
            this.addBlockPosition(new Vec3(x, y));
            this.addBlockPosition(new Vec3(x - this.blockSize, y));
            this.addBlockPosition(new Vec3(x + this.blockSize, y));
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