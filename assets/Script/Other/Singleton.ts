import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Singleton')
export class Singleton<T> extends Component {
    private static _instance: Singleton<any> = null;

    public static get instance() {
        if (this._instance == null) {
            this._instance = new Singleton();
        }
        return this._instance;
    }

    onLoad() {
        if (Singleton._instance == null) {
            Singleton._instance = this;
        } else {
            this.node.destroy();
        }
    }
}