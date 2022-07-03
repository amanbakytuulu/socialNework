import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export function socialResolver() {
    let RegExp = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

    const validationScheme = Yup.object().shape({
        facebook: Yup.string().matches(RegExp, { message: 'Ссылка неверная', excludeEmptyString: true }),
        twitter: Yup.string().matches(RegExp, { message: 'Ссылка неверная', excludeEmptyString: true }),
        linkedIn: Yup.string().matches(RegExp, { message: 'Ссылка неверная', excludeEmptyString: true }),
        instagram: Yup.string().matches(RegExp, { message: 'Ссылка неверная', excludeEmptyString: true }),
        vk: Yup.string().matches(RegExp, { message: 'Ссылка неверная', excludeEmptyString: true }),
        skype: Yup.string().matches(RegExp, { message: 'Ссылка неверная', excludeEmptyString: true }),
        google: Yup.string().matches(RegExp, { message: 'Ссылка неверная', excludeEmptyString: true }),
        github: Yup.string().matches(RegExp, { message: 'Ссылка неверная', excludeEmptyString: true }),
    })

    return {
        formOptions: { resolver: yupResolver(validationScheme) }
    }
}
