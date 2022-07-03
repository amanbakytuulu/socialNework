import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";


export function signUpResolver() {
    const validationScheme = Yup.object().shape({
        email: Yup.string().email('Некорректный email!').required('Поле не может быть пустым!'),
        userName: Yup.string().required('Поле не может быть пустым!'),
        password: Yup.string().min(8, 'Не менее 8 символов').required('Поле не может быть пустым!'),
        rePassword: Yup.string().oneOf([Yup.ref('password'), null], 'Пароли не совпадают!').required('Поле не может быть пустым!')
    })

    return {
        formOptions: { resolver: yupResolver(validationScheme) }
    }
}