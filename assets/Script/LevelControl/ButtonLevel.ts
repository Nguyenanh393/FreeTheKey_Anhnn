import { _decorator, Component, find, Label, log, Node, Prefab } from 'cc';
import { LevelControl } from './LevelControl';
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
        //this.levelControl.loadLevel(this.level);
    }

    setInfo(label: number, level: number, levelControl: LevelControl) {
        this.labelNode.string = label.toString();
        this.level = level;
        this.levelControl = levelControl;
    }

}