import { createModule, action } from 'vuex-class-component';
import { AxiosInstance } from 'axios';

const VuexModule = createModule({
    strict: false,
});

export default function createUserStore(http: AxiosInstance) {
    class UserStore extends VuexModule {
        @action() async login({ username, password }: { username: string, password: string }) {
            const { data } = (await http.post('/login/')).data;
            return data;
        }
    }

    return UserStore;
}
