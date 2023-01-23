import { Injectable, InternalServerErrorException } from '@nestjs/common';

import * as fs from 'fs';

export enum DataTypesEnum {
    User = 'USER',
    Card = 'CARD',
    Offer = 'OFFER',
}

@Injectable()
export class DataKeeperService {

    /**
     * @description Save Data of 'type' in local file system 
     */
    async setData(type: string, data: unknown) {
        const dataString = JSON.stringify(data);
        console.log(`Setting local data for: ${type} => ${dataString}`);
        fs.writeFile(`./data/${type}`, dataString, (err) => {
            if (err) {
                console.log(err);
                throw new InternalServerErrorException(`Error setting: ${type} => ${dataString}`);
            }
        })
    }

    /**
     * @description Recover Data of 'type' from local file system 
     */
    getData(type: string) {
        try {
            const dataBuffer = fs.readFileSync(`./data/${type}`);
            const data = dataBuffer.toString();
            console.log(`Getting local data for: ${type} => ${data}`);
            return JSON.parse(data);
        } catch (err) {
            console.log(err);
            throw new InternalServerErrorException(`Error getting: ${type}`);
        }
    }
}
