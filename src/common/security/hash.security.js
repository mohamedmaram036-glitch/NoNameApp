import bcrypt from "bcrypt";

export const hash = async(plaintext , rounds=12 , minor ="b")=>{
    const salt = (await bcrypt.genSalt(rounds,minor)).toString()
    return await bcrypt.hash(plaintext , salt)
}

export const compare = async(plaintext , chipherText)=>{
    return await bcrypt.compare(plaintext , chipherText)
}