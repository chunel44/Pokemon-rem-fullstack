import bcrypt from 'bcryptjs';

import { db } from '@/database';

import { User } from '@/models';
import { UserRepository } from '@/repository/userRepository';
import { jwt } from '@/utilites';

const userRepository = new UserRepository({ model: User });


export const checkUserEmailPassword = async (email: string, password: string) => {


    await db.connect();
    const user = await userRepository.findByEmail(email);
    await db.disconnect();

    if (!user) {
        return null;
    }

    if (!bcrypt.compareSync(password, user.password!)) {
        return null;
    }

    const { name, _id, imgUrl } = user;
    const token = jwt.signToken(_id, email);

    return {
        _id,
        email: email.toLocaleLowerCase(),
        name,
        imgUrl,
        access_token: token
    }
}


// Esta función crea o verifica el usuario de OAuth
// export const oAUthToDbUser = async (oAuthEmail: string, oAuthName: string) => {

//     await db.connect();
//     const user = await userRepository.findByEmail(oAuthEmail);

//     if (user) {
//         await db.disconnect();
//         const { _id, name, email } = user;
//         return { _id, name, email };
//     }

//     const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'client' });
//     await newUser.save();
//     await db.disconnect();

//     const { _id, name, email } = newUser;
//     return { _id, name, email };

// }

