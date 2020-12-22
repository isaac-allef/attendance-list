// import bcrypt from 'bcrypt';
import crypto from 'crypto';

const generateId = async (text: string): Promise<string> => {
    // const hash: string = await bcrypt.hash(`${Date.now()}${text}`, 10);
    // const id = Buffer.from(hash).toString('base64')
    //                             .replace('+', '-')
    //                             .replace('/', '_');
    const id = crypto.createHash('sha1').update(`${Date.now()}${text}`).digest('hex')
    return id;
}

export default generateId;