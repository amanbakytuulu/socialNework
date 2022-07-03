import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';


export function passwordResolver() {

    const validationScheme = Yup.object().shape({
        currentPassword: Yup.string().required('Введите текущий пароль!'),
        password: Yup.string().min(8, 'Не менее 8 символов'),
        rePassword: Yup.string().oneOf([Yup.ref('password'), null], 'Пароли не совпадают')
    })

    return {
        formOptions: { resolver: yupResolver(validationScheme) }
    }
}
