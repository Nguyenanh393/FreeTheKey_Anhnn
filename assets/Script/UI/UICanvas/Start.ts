import { _decorator, Component, EventTouch, find, log, Node, UI } from 'cc';
import UICanvas from '../UICanvas';
import { UIManager } from '../UIManager';

const { ccclass, property } = _decorator;

@ccclass('Start')
export class Start extends UICanvas {
    // properties
    UIManager: UIManager = null;
    canvas: Node = null;

    onLoad() {
        this.canvas = find('Canvas');
        this.canvas.on(Node.EventType.TOUCH_END, this.onStartButtonClick, this);
        this.UIManager = UIManager.getInstance();
    }

    onStartButtonClick() {
        log('Start button clicked');
        this.close(0);
        //this.UIManager.openUI(LevelSelection);
    }
}


