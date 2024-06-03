import { _decorator, Component, EventTouch, find, log, Node, UI } from 'cc';
import UICanvas from '../UICanvas';
import { UIManager } from '../UIManager';
import { LevelControl } from '../../LevelControl/LevelControl';
import { LevelSelection } from './LevelSelection';

const { ccclass, property } = _decorator;

@ccclass('Start')
export class Start extends UICanvas {
    // properties
    canvas: Node = null;
    mapParent: Node = null;

    onLoad() {
        this.canvas = find('Canvas');
    }

    onEnable() {
        LevelControl.getInstance().mapParentLocation.active = false;
        this.canvas.on(Node.EventType.TOUCH_END, this.onStartButtonClick, this);
    }

    onStartButtonClick() {
        log('Start button clicked');
        // this.mapParent.active = true;
        this.canvas.off(Node.EventType.TOUCH_END, this.onStartButtonClick, this);
        this.close(0);
        UIManager.getInstance().openUI(LevelSelection);
    }
}


