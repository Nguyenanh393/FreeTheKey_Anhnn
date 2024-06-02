import { _decorator, Component, log, Node, UI } from 'cc';
import { UIManager } from './UI/UIManager';
import { Start } from './UI/UICanvas/Start';
const { ccclass, property } = _decorator;

@ccclass('MainControl')
export class MainControl extends Component {
        
    UIManager: UIManager = null;

    start() {
        // this.startCanvas.active = true;
        // this.levelSelectionCanvas.active = false;
        // this.gamePlayCanvas.active = false;
        // this.node.on(Node.EventType.TOUCH_END, this.startGame, this);
        this.UIManager = UIManager.getInstance();
        this.UIManager.openUI(Start)
        log('MainControl start')
    }

    startGame() {
        // this.startCanvas.active = false;
        // this.levelSelectionCanvas.active = true;
    }

}


