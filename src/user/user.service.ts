import { BadRequestException, Injectable, InternalServerErrorException, OnApplicationShutdown } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError, map } from 'rxjs'
import { DataKeeperService } from '../data-keeper/data-keeper.service';
import { DataTypesEnum } from '../data-keeper/data-keeper.service';
import { UserLoginDTO } from './models/user-login.dto';
import { UserRegisterDTO } from './models/user-register.dto';
import { User } from './models/user.model';
import { dataKeeperConfig } from '../../config/data-keeper.config';
import { polygonscanConfig } from '../../config/polygonscan.config';
import { CardService } from '../card/card.service';
import * as faker from 'faker';


@Injectable()
export class UserService {

    usersList: User[] = [];

    constructor(
        private readonly dataKeeper: DataKeeperService,
        private readonly cardService: CardService,
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService
    ) {
        this.init();
    }

    private init() {
        this.usersList = this.dataKeeper.getData(DataTypesEnum.User);

        // Interval set to backup data locally every 5 mins (300000ms)
        setInterval(() => {
            this.dataKeeper.setData(DataTypesEnum.User, this.usersList);
        }, dataKeeperConfig.saveInterval);
    }

    private sanitizeUser(user: User) {
        // Copy and Sanitize user
        const cleanUser = Object.assign({}, user);
        delete cleanUser.password;

        return cleanUser;
    }

    getById(id: string): Partial<User> | undefined {
        const user: User = this.usersList.find((user: User) => user.id === id);

        // Return if undefined
        if (!user) return;

        return this.sanitizeUser(user);
    }

    getByUsername(username: string): Partial<User> | undefined {
        const user: User = this.usersList.find((user: User) => user.username === username);
        
        // Return if undefined
        if (!user) return;

        return this.sanitizeUser(user);
    }

    getByWallet(wallet: string): Partial<User> | undefined {
        const user: User = this.usersList.find((user: User) => user.wallet === wallet);

        // Return if undefined
        if (!user) return;

        return this.sanitizeUser(user);
    }

    async register(userData: UserRegisterDTO) {
        // Validate unique username
        if(this.getByUsername(userData.username)) {
            throw new BadRequestException('Username already exists.');
        };

        // Validate unique wallet
        if(this.getByWallet(userData.wallet)) {
            throw new BadRequestException('Wallet already in use.');
        };

        // Create User and save
        const newUser = User.create(userData);
        this.usersList.push(newUser);

        // Register Cards (Tokens) from polygonscan
        const tokens = await this.requestPolygonscan(newUser.wallet);
        tokens.forEach((token) => {
            if (token) {
                this.cardService.create({
                    name: faker.random.alphaNumeric() as string,
                    value: JSON.stringify(token),
                    owner: newUser.id,
                });
            }
        })
        
        return this.sanitizeUser(newUser);
    }

    login(creds: UserLoginDTO): string {
        const user: User = this.usersList.find((user: User) => user.username === creds.username);
        if (!user || user.password !== creds.password) {
            throw new BadRequestException('Wrong credentials')
        }

        // Generate auth JWT
        const jwt = this.jwtService.sign({
            id: user.id,
            username: user.username,
            wallet: user.wallet
        })

        return jwt;
    }

    updateBalance(id: string, ammount: number) {
        const user: User = this.usersList.find((user: User) => user.id === id);

        user.balance += ammount;

        return user.balance;
    }

    async requestPolygonscan(wallet: string) {
        const erc721 = await firstValueFrom(this.httpService.get(polygonscanConfig.url,{
                params: {
                    module: "account",
                    action: "tokennfttx",
                    address: wallet,
                    startBlock: 0,
                    endBlock: 99999999,
                    apikey: polygonscanConfig.apiKey
                } 
            }).pipe(
                map((resp) => {
                    return resp.data?.result;
                }),
                catchError((err) => { 
                    console.log('Error getting ERC721', err)
                    return undefined;
                })
            )
        );
        const erc1155 = await firstValueFrom(this.httpService.get(polygonscanConfig.url,{
                params: {
                    module: "account",
                    action: "token1155tx",
                    address: wallet,
                    startBlock: 0,
                    endBlock: 99999999,
                    apikey: polygonscanConfig.apiKey
                } 
            }).pipe(
                map((resp) => {
                    return resp.data?.result;
                }),
                catchError((err) => { 
                    console.log('Error getting ERC1155', err)
                    return undefined;
                })
            )
        );
        return [...erc721, ...erc1155];
    }

    clearData() {
        this.usersList = [];
        this.dataKeeper.setData(DataTypesEnum.User, this.usersList);
    }
}
