import jwt from 'jsonwebtoken';
import ms from "../../node_modules/@types/ms"

import { config } from '../config/config';

interface JWTPayload {
    userId: string;
}

export class JwtService {
    static sign(payload: JWTPayload): string {
        return jwt.sign(payload, config.jwt.secret as jwt.Secret, {
            expiresIn: config.jwt.expiresIn as ms.StringValue
        });
    }

    static verify(token: string): JWTPayload {
        return jwt.verify(token, config.jwt.secret) as JWTPayload;
    }
}
