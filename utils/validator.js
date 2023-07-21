export function checkConfirmPassword(password, confirmPassword) {
    if (password === confirmPassword && confirmPassword !== '') {
        return {
            message: "",
            error: false
        }
    } else {
        return {
            message: "Passwords don't match.",
            error: true
        }
    }
}

export function checkEmail(email) {
    if (email.length === 0) {
        return {
            message: "Email is required.",
            error: true
        }
    }

    const e = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

    if (e.test(email)) {
        return {
            message: "",
            error: false
        }
    } else {
        return {
            message: "Invalid email address.",
            error: true
        }
    }
}

export function checkPassword(password, strongPasswordCheck) {
    if (password.length === 0) {
        return {
            message: "Password is required.",
            error: true
        }
    }

    if (password.length < 8 || password.length > 32) {
        return {
            message: "Password must be between 8 to 32 characters.",
            error: true
        }
    }

    if (strongPasswordCheck) {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!strongPasswordRegex.test(password)) {
            return {
                message: "Create strong password.",
                error: true
            }
        }
    }

    return {
        message: "",
        error: false
    }
}

export function checkText(fieldName = '', str, min, max, spaces) {
    if (str.length === 0) {
        return {
            message: `${fieldName} is required.`,
            error: true
        }
    }

    if (spaces) {
        if (str.split(' ').length !== 1) {
            return {
                message: `${fieldName} should have without any spaces.`,
                error: true
            }
        }
    }

    if (str.length >= min && str.length <= max) {
        return {
            message: "",
            error: false
        }
    } else {
        return {
            message: fieldName + " must be between " + min + " and " + max + " characters.",
            error: true
        }
    }
}

export function checkPincode(str) {
    if (str && str.toString().length === 6 && typeof Number(str) === "number") {
        return {
            message: "",
            error: false
        }
    } else {
        return {
            message: "Pincode must be 6 number.",
            error: true
        }
    }
}

export function checkReferralCode(str) {
    if (str.length === 6) {
        return {
            message: "",
            error: false
        }
    } else {
        return {
            message: "Referral code must be 6 characters.",
            error: true
        }
    }
}

export function checkImage(fieldName, file) {
    if (!file) {
        return {
            message: `${fieldName} is required.`,
            error: true
        }
    }

    if (['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg', 'image/bmp'].includes(file.type)) {
        return {
            message: "",
            error: false
        }
    } else {
        return {
            message: "Invalid file type.",
            error: true
        }
    }
}

export function checkImages(fieldName, files) {
    let error = false;

    if (!files) {
        return {
            message: `${fieldName} is required.`,
            error: true
        }
    }

    files.forEach((file) => {
        if (['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg', 'image/bmp'].includes(file.type)) {
            error = false;
        } else {
            error = true;
        }
    })

    if (error) {
        return {
            message: "Invalid files type.",
            error: true
        }
    } else {
        return {
            message: "",
            error: false
        }
    }
}

export function checkPrice(fieldName, num) {
    if (num && num.toString().split('').includes('e')) {
        return {
            message: `${fieldName} is not valid.`,
            error: true
        }
    }

    if (Number(num) > 0) {
        return {
            message: "",
            error: false
        }
    } else {
        return {
            message: `Invalid ${fieldName} field.`,
            error: true
        }
    }
}

export function checkWeight(fieldName, num) {
    if (num && num.toString().split('').includes('e')) {
        return {
            message: `${fieldName} is not valid.`,
            error: true
        }
    }

    if (Number(num) > 0) {
        return {
            message: "",
            error: false
        }
    } else {
        return {
            message: `Invalid ${fieldName} field.`,
            error: true
        }
    }
}

export function checkDiscount(fieldName, num) {
    if (num && num.toString().split('').includes('e')) {
        return {
            message: `${fieldName} is not valid.`,
            error: true
        }
    }

    if (Number(num) >= 0 && Number(num) <= 100) {
        return {
            message: "",
            error: false
        }
    } else {
        return {
            message: `Invalid ${fieldName} field.`,
            error: true
        }
    }
}

export function checkAvatar(fieldName, str) {
    if (str === '') {
        return {
            message: `${fieldName} is empty.`,
            error: true
        }
    }

    if (typeof str === 'string') {
        return {
            message: "",
            error: false
        }
    } else {
        return {
            message: `${fieldName} is not valid.`,
            error: true
        }
    }
}

export function checkImagesFileNames(fieldName, filesName) {
    let error = false;

    filesName.forEach((file) => {
        if (file === "") {
            error = true;
        }
    })

    if (error) {
        return {
            message: `${fieldName} is not valid.`,
            error: true
        }
    } else {
        return {
            message: "",
            error: false
        }
    }
}