import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";


export function signInResolver() {
    const validationScheme = Yup.object().shape({
        email: Yup.string().email('Некорректный email!').required('Поле не может быть пустым!'),
        password: Yup.string().required('Поле не может быть пустым!')
    })

    return {
        formOptions: { resolver: yupResolver(validationScheme) }
    }
}