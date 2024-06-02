import { _decorator, Button, Component, Node } from 'cc';
import { LevelControl } from '../LevelControl/LevelControl';

const { ccclass, property } = _decorator;

@ccclass('GamePlayUI')
export class GamePlayUI extends Component {
    @property(Button)
    btnHome: Button = null;

    @property(Button)
    btnSound: Button = null;

    @property(Button)
    btnReplay: Button = null;

    @property(Node)
    levelSelectionCanvas: Node = null;
    @property(Node)
    gamePlayCanvas: Node = null;
    @property(LevelControl)
    levelControl: LevelControl = null;

    onEnable() {
        this.btnHome.node.on(Node.EventType.TOUCH_END, this.onHome, this);
        this.btnSound.node.on(Node.EventType.TOUCH_END, this.onSound, this);
        this.btnReplay.node.on(Node.EventType.TOUCH_END, this.onReplay, this);
    }

    onHome() {
        this.levelSelectionCanvas.active = true;
        this.gamePlayCanvas.active = false;
    }

    onSound() {
        
    }

    onReplay() {
        let level = this.levelControl.currentLevel;
        //this.levelControl.loadLevel(level);
    }
}


