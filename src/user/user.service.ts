import { BadRequestException, Injectable } from '@nestjs/common';
import { DataKeeperService } from '../data-keeper/data-keeper.service';
import { DataTypesEnum } from '../data-keeper/data-keeper.service';
import { UserLoginDTO } from './models/user-login.dto';
import { UserRegisterDTO } from './models/user-register.dto';
import { User } from './models/user.model';
import { sign } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class UserService {

    usersList: User[] = [];

    constructor(private readonly dataKeeper: DataKeeperService, private readonly jwtService: JwtService) {
        this.init();
    }

    private init() {
        this.usersList = this.dataKeeper.getData(DataTypesEnum.User);

        // Interval set to backup data locally every 5 mins (300000ms)
        setInterval(() => {
            this.dataKeeper.setData(DataTypesEnum.User, this.usersList);
        }, 300000);
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

    register(userData: UserRegisterDTO) {
        // Validate unique username
        if(this.getByUsername(userData.username)) {
            throw new BadRequestException('Username already exists.');
        };

        // Validate unique wallet
        if(this.getByWallet(userData.username)) {
            throw new BadRequestException('Wallet already in use.');
        };

        // Create User and save
        const newUser = User.create(userData);
        this.usersList.push(newUser);
        
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
}
