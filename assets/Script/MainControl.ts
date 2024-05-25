import { _decorator, Component, Node } from 'cc';
import { LevelControl } from './LevelControl';
const { ccclass, property } = _decorator;

@ccclass('MainControl')
export class MainControl extends Component {
    
    @property(Node)
    startCanvas: Node = null;
    @property(Node)
    gamePlayCanvas: Node = null;
    @property(Node)
    levelSelectionCanvas: Node = null;

    start() {
        this.startCanvas.active = true;
        this.levelSelectionCanvas.active = false;
        this.gamePlayCanvas.active = false;
        this.node.on(Node.EventType.TOUCH_END, this.startGame, this);
    }

    startGame() {
        this.startCanvas.active = false;
        this.levelSelectionCanvas.active = true;
    }

}


