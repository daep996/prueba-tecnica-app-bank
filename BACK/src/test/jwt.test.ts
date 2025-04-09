import { JwtService } from '../utils/jwt';

describe('JwtService test', () => {

    const payload = { userId: '1' };

    it('should generate a valid JWT', () => {
        const token = JwtService.sign(payload);
        expect(typeof token).toBe('string');
        expect(token.split('.').length).toBe(3); // debe tener 3 parte
    });

    it('should verify a valid JWT', () => {
        const token = JwtService.sign(payload);
        const decoded = JwtService.verify(token);
        expect(decoded.userId).toBe(payload.userId);
    });

    it('should throw error for invalid JWT', () => {
        const invalidToken = 'abc.def.ghi';
        expect(() => JwtService.verify(invalidToken)).toThrow();
    });
});
