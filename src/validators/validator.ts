import { checkSchema } from "express-validator";

export const validator = {
    signup: checkSchema({
        name: {
            trim: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'O nome precisa ter pelo menos 2 caracteres!'
        },
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'Email inválido!'
        },
        password: {
            isLength: {
                options: { min: 2 },
            },
            errorMessage: 'A senha precisa ter pelo menos 2 caracteres!'
        },
        state: {
            notEmpty: true,
            errorMessage: 'Estado precisa ser preenchido!'
        }
    }),
    signin: checkSchema({
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'Email inválido!'
        },
        password: {
            isLength: {
                options: { min: 2 },
            },
            errorMessage: 'A senha precisa ter pelo menos 2 caracteres!'
        }
    }),
    editUser: checkSchema({
        name: {
            optional: true,
            trim: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'O nome precisa ter pelo menos 2 caracteres!'
        },
        email: {
            optional: true,
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'Email inválido!'
        },
        password: {
            optional: true,
            isLength: {
                options: { min: 2 },
            },
            errorMessage: 'A senha precisa ter pelo menos 2 caracteres!'
        },
        state: {
            optional: true,
            notEmpty: true,
            errorMessage: 'Estado precisa ser preenchido!'
        }
    })
}