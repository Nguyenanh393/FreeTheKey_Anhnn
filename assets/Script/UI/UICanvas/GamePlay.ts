import { _decorator, Component, find, Label, Node } from 'cc';
import UICanvas from '../UICanvas';
import { UIManager } from '../UIManager';
import { Start } from './Start';
import { BlockManager } from '../../GamePlay/Block/Manager/BlockManager';
import { LevelControl } from '../../LevelControl/LevelControl';
const { ccclass, property } = _decorator;

@ccclass('GamePlay')
export class GamePlay extends UICanvas {
    @property(Label)
    stepLabel: Label = null;

    onEnable() {
        BlockManager.getInstance().stepLabel = this.stepLabel;
    }
    onHomeButtonClick() {
        UIManager.getInstance().openUI(Start);
        LevelControl.getInstance().removeAllMap();
        this.close(0);
    }

    onSoundButtonClick() {
        console.log('Sound button clicked');
    }

    onRestartButtonClick() {
        LevelControl.getInstance().resetLevel();
    }
}


