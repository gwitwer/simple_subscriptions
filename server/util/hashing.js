import crypto from 'crypto';

const secret = 'kynect-admin';

const checkHash = key => hash => {
  const ourHash = crypto.createHmac('sha256', secret)
                     .update(key)
                     .digest('hex');
  return ourHash === hash;
};

const makeHash = key => crypto.createHmac('sha256', secret)
                          .update(key)
                          .digest('hex');

export {
  makeHash,
  checkHash,
};
