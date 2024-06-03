import { _decorator, Component, instantiate, Prefab, Sprite, UITransform, Vec3 } from 'cc';
import { BlockManager } from '../Block/Manager/BlockManager';


const { ccclass, property } = _decorator;

@ccclass('Floor')
export class Floor extends Component {

    @property(Prefab)
    blockPrefab: Prefab = null;

    blockWidth: number ;
    onLoad() {
        this.blockWidth = BlockManager.getInstance().blockWidth;
        this.createFloor();
    }

    createFloor() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let block = instantiate(this.blockPrefab);
                this.node.addChild(block);
                block.setPosition(new Vec3(j * this.blockWidth + this.blockWidth/2,
                    i * this.blockWidth + this.blockWidth/2, 0));      

                
                block.getComponent(UITransform).width = this.blockWidth;
                block.getComponent(UITransform).height = this.blockWidth;
            }
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let block = instantiate(this.blockPrefab);
                this.node.addChild(block);
                block.setPosition(new Vec3(j * this.blockWidth + this.blockWidth/2,
                    -i * this.blockWidth - this.blockWidth/2, 0));   
                    
                block.getComponent(UITransform).width = this.blockWidth;
                block.getComponent(UITransform).height = this.blockWidth;
            }
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let block = instantiate(this.blockPrefab);
                this.node.addChild(block);
                block.setPosition(new Vec3(-j * this.blockWidth - this.blockWidth/2,
                    i * this.blockWidth + this.blockWidth/2, 0));    
                    
                block.getComponent(UITransform).width = this.blockWidth;
                block.getComponent(UITransform).height = this.blockWidth;
            }
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let block = instantiate(this.blockPrefab);
                this.node.addChild(block);
                block.setPosition(new Vec3(-j * this.blockWidth - this.blockWidth/2,
                    -i * this.blockWidth - this.blockWidth/2, 0));     
                    
                block.getComponent(UITransform).width = this.blockWidth;
                block.getComponent(UITransform).height = this.blockWidth;
            }
        }
    }
    
}


