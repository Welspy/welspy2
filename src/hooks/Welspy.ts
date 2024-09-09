import useCreateHook from './useCreateHook.ts';

const Welspy = {
    auth: {
        signIn: ({email,password}:{email: string, password: string}) => {
            useCreateHook('auth/sign-in', 'POST', {email, password}, false);
        },
        signUp: ({email, name, phoneNumber, password} : {email: string, name: string, phoneNumber: string, password: string}) => {
            useCreateHook('auth/sign-in', 'POST', {email, name, phoneNumber, password}, false);
        },
        emailSend: (email: string) => {
            useCreateHook('email/send', 'POST', {email}, false);
        },
        emailCheck: (email: string, authNum: string) => {
            useCreateHook('email/check', 'POST', {email, authNum}, false);
        },
    },
    challenge: {
        getMyChallenge: () => {
            useCreateHook('room/list/my', 'GET', {}, true);
        },
        getChallengeList: (page: number, size: number) => {
            useCreateHook('room/list', 'GET', {page, size}, true);
        },
        searchChallenge: (page: number, size: number, title: string) => {
            useCreateHook('room/list/search', 'POST', {page, size, title}, true);
        }
    },
    user: {
        getProfile: () => {
            useCreateHook('user', 'GET', {}, true);
        },
        patchUserName: (name: string) => {
            useCreateHook('user', 'PATCH', {name}, true);
        },
        patchUserEmail: (email: string) => {
            useCreateHook('user', 'PATCH', {email}, true);
        },
        patchUserBalance: (money: number) => {
            useCreateHook('user', 'PATCH', {money}, true);
        },
    },
    bank: {
        getMyBank: () => {
            useCreateHook('bank', 'GET', {}, true);
        },
        getBalance: (accountNumber : string) => {
            useCreateHook('bank/balance', 'GET', {accountNumber}, true);
        },
        sendMoney: (targetAccountNumber: string, money: number) => {
            useCreateHook('bank', 'POST', {targetAccountNumber, money}, false);
        }
    }
};

export default Welspy;