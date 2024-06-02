import { _decorator, JsonAsset, resources, Vec3 } from 'cc';
import { BlockManager } from '../Block/Manager/BlockManager';


const { ccclass, property } = _decorator;

@ccclass('ReadMap')
export class ReadMap {

    blockManager: BlockManager = null;
    blockWidth: number = 0;

    loadJson() {
        // Đường dẫn tới tệp JSON trong thư mục "assets/resources"
        const jsonFilePath = 'Data/LevelData';

        resources.load(jsonFilePath, JsonAsset, (err, jsonAsset) => {
            if (err) {
                console.error('Failed to load JSON file:', err);
                return;
            }

            // Lấy dữ liệu từ JsonAsset
            const data = jsonAsset.json;
            console.log('Loaded JSON data:', data);

            // Xử lý mảng 2 chiều 6x6
            const matrix: number[][] = data["1"].map;
            const maxValue: number = data["1"].max_value; 
            this.processMatrix(matrix, maxValue);
        });
    }



    processMatrix(matrix: number[][], maxValue: number) {
        this.blockManager = BlockManager.getInstance();
        this.blockManager.currentMapMatrix = matrix;
        this.blockWidth = this.blockManager.blockWidth;
        for (let i = 1; i <= maxValue; i++) {
            let number = i;
            let numbers = [];
            for (let j = 0; j < matrix.length; j++) {
                for (let k = 0; k < matrix[j].length; k++) {
                    if (matrix[j][k] == number) {
                        numbers.push({x: j, y: k});
                    }
                }
            }

            if (numbers[0].x == numbers[1].x) {
                let posX = 0;
                let posY = 0;
                if (numbers.length % 2 == 0) {
                    posX = (numbers[0].y - 3) * this.blockWidth + this.blockWidth * (numbers.length / 2);
                } else {
                    posX = (numbers[0].y - 3) * this.blockWidth + this.blockWidth * Math.floor(numbers.length / 2) + this.blockWidth / 2;
                }
                posY = -(numbers[0].x - 3) * this.blockWidth - this.blockWidth / 2;
                this.blockManager.spawnBlock(new Vec3(posX, posY, 0), numbers.length, number, true);
            }

            if (numbers[0].y == numbers[1].y) {
                let posX = 0;
                let posY = 0;
                if (numbers.length % 2 == 0) {
                    posY = -(numbers[0].x - 3) * this.blockWidth - this.blockWidth * (numbers.length / 2);
                } else {
                    posY = -(numbers[0].x - 3) * this.blockWidth - this.blockWidth * Math.floor(numbers.length / 2) - this.blockWidth / 2;
                }
                posX = (numbers[0].y - 3) * this.blockWidth + this.blockWidth / 2;
                this.blockManager.spawnBlock(new Vec3(posX, posY, 0), numbers.length, number, false);
            }
        }
    }
}


