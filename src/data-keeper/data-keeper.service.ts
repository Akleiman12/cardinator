import { Injectable } from '@nestjs/common';

import * as fs from 'fs';

export enum DataTypes {
    User = 'USER',
    Card = 'CARD',
    Offer = 'OFFER',
}

@Injectable()
export class DataKeeperService {

    async setData(type: string, data: unknown) {
        const dataString = JSON.stringify(data);
        fs.writeFile(`tmp/${type}`, dataString, (err) => {
            if (err) {
                console.log(err);
                throw new Error(`Error setting: ${type} => ${dataString}`);
            }
        })
    }

    getData(type: string) {
        try {
            const dataBuffer = fs.readFileSync(`tmp/${type}`);
            return JSON.stringify(dataBuffer.toString());
        } catch (err) {
            console.log(err);
            throw new Error(`Error getting: ${type}`);
        }
    }
}
