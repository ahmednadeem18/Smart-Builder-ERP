import crypto from 'crypto';

const hash = crypto.createHash('sha256').update('ahmed123').digest('hex');
console.log(hash);
const hash2 = crypto.createHash('sha256').update(hash).digest('hex');
console.log(hash2);

