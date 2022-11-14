import * as crypto from "crypto";
const IV_LENGTH = 16;
const algorithm = "aes-256-ctr";

export const encrypt = (text: string, pass: string) => {
  if (pass.length > 32) {
    pass = pass.substr(0, 32);
  }
  while (pass.length < 32) {
    pass += "0";
  }

  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(pass), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + encrypted.toString("hex");
};
export const decrypt = (text: string, pass: string) => {
  if (pass.length > 32) {
    pass = pass.substr(0, 32);
  }
  while (pass.length < 32) {
    pass += "0";
  }
  let iv = Buffer.from(text.substr(0, 32), "hex");
  let encryptedText = Buffer.from(text.substr(32), "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(pass), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};
