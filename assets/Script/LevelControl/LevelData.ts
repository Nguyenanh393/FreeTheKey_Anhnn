import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelData')
export class LevelData {
    private mapName: string = '';
    private map: number[][] = [];
    private max_value: number = 0;

    constructor(mapName: string, map: number[][], max_value: number) {
        this.map = map;
        this.max_value = max_value;
        this.mapName = mapName;
    }

    getMap() {
        return this.map;
    }

    getMaxValue() {
        return this.max_value;
    }

    getMapName() {
        return this.mapName;
    }
}


