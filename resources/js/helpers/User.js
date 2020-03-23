import Token from './Token'
import AppStorage from './AppStorage'

class User {
    login(formData, router) {
        axios.post('/api/auth/login', formData)
        .then(res=> {
            this.responseAfterLogin(res.data, router);
        })
        .catch(error=> console.log(error.response.data));
    }

    responseAfterLogin(data, router){
        const {user, access_token } = data;
        if(Token.isValid(access_token)){
            AppStorage.store(user, access_token);
            router.push({name: 'forum'});
        }
    }

    hasToken(){
        const storedToken = AppStorage.getToken();
        if(storedToken){
            return Token.isValid(storedToken) ?  true : false;
        }
        return false;
    }

    loggedIn(){
        return this.hasToken();
    }

    logout(){
        AppStorage.clear();
    }

    getName(){
        if(this.loggedIn()){
            return AppStorage.getUser();
        }
    }

    getId(){
        if(this.loggedIn()){
            const payload = Token.payload(AppStorage.getToken());
            return payload.sub;
        }
    }
}

export default new User();