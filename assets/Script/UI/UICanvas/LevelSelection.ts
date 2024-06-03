import { _decorator, Component, log, Node } from 'cc';
import UICanvas from '../UICanvas';
import { LevelControl } from '../../LevelControl/LevelControl';
const { ccclass, property } = _decorator;

@ccclass('LevelSelection')
export class LevelSelection extends UICanvas {
    onLoad() {
        LevelControl.getInstance().buttonParentLocation = this.node;
        LevelControl.getInstance().createLevelButton();
    }
}
