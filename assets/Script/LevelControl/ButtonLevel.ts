import { _decorator, Component, find, Label, log, Node, Prefab, UI } from 'cc';
import { LevelControl } from './LevelControl';
import { UIManager } from '../UI/UIManager';
import { LevelSelection } from '../UI/UICanvas/LevelSelection';
const { ccclass, property } = _decorator;

@ccclass('ButtonLevel')
export class ButtonLevel extends Component {
     
    @property(Label)
    labelNode: Label = null;
    level: number;

    levelControl: LevelControl = null;


    onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchEnd() {
        this.levelControl.currentLevel = this.level;
        this.levelControl.loadLevel(this.level);
        //UIManager.getInstance().openUI(GamePlay);
        //UIManager.getInstance().closeUI(LevelSelection);
    }

    setInfo(label: number, level: number, levelControl: LevelControl) {
        this.labelNode.string = label.toString();
        this.level = level;
        this.levelControl = levelControl;
    }

}