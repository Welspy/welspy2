import useCreateHook from './useCreateHook.ts';

const Welspy = {
    auth: {
        signIn: ({email, password}: {email: string; password: string}) => {
            useCreateHook('auth/sign-in', 'POST', {email, password}, false);
        },
        signUp: ({
                     email,
                     name,
                     phoneNumber,
                     password,
                 }: {
            email: string;
            name: string;
            phoneNumber: string;
            password: string;
        }) => {
            useCreateHook(
                'auth/sign-in',
                'POST',
                {email, name, phoneNumber, password},
                false,
            );
        },
        emailSend: (email: string) => {
            useCreateHook('email/send', 'POST', {email}, false);
        },
        emailCheck: (email: string, authNum: string) => {
            useCreateHook('email/check', 'POST', {email, authNum}, false);
        },
    },
    challenge: {
        getMyChallenge: (page: number, size = 99) => {
            useCreateHook('room/list/my', 'GET', {page, size}, true);
        },
        getChallengeList: (page: number, size: number) => {
            useCreateHook('room/list', 'GET', {page, size}, true);
        },
        searchChallenge: (page: number, size: number, title: string) => {
            useCreateHook('room/list/search', 'GET', {page, size, title}, true);
        },
        createChallenge: ({title, description, goalAmount, imageUrl, category}: {title: string, description: string, goalAmount: number, imageUrl: string, category: string}) => {
            useCreateHook(
                'room',
                'POST',
                {title, description, goalAmount, imageUrl, category},
                true,
            );
        },
        getChallengeUserList: (page: number, size: number, roomId: number) => {
            useCreateHook('room/user-list', 'GET', {page, size, roomId}, true);
        },
        joinChallenge: (roomId : number) => {
            useCreateHook('room/join', 'POST', {roomId}, true);
        },
        getChallengeById: (roomId : number) => {
            useCreateHook('room', 'GET', {roomId}, true);
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
        getBalance: (accountNumber: string) => {
            useCreateHook('bank/balance', 'GET', {accountNumber}, true);
        },
        sendMoney: (targetAccountNumber: string, money: number) => {
            useCreateHook('bank', 'POST', {targetAccountNumber, money}, true);
        },
        sendToBankMoney: (roomId: number, money: number) => {
            useCreateHook('bank/to-room', 'PATCH', {roomId, money}, true);
        },
        sendBankLog: (money : number, bankType: string, name: string) => {
            useCreateHook('bank/log', 'POST', {money, bankType, name}, true);
        },
        getBankLog: () => {
            useCreateHook('bank/log', 'GET', {size: 99, page: 1}, true);
        }
    },
};

export default Welspy;