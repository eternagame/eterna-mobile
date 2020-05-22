import {Chat} from 'eterna-chat-wrapper';
import {Store} from 'vuex';

export default class ChatManager {
    constructor(chatboxID: string, store: Store<any>) {
        this._chatbox = document.getElementById(chatboxID);
        if (this._chatbox == null) {
            console.warn(`Missing chatbox (id=${chatboxID})`);
        }
        this._store = store;
    }

    public toggleVisibility(): void {
        this._visible = !this._visible;
        this.updateChatVisibility();
    }

    private updateChatVisibility(): void {
        if (this._chatbox == null) {
            return;
        }

        if (this._visible) {
            if (!this._chat) {
                this._chat = new Chat({
                    container: this._chatbox,
                    username: this._store.state.username,
                    uid: `${this._store.state.uid}`,
                    backgroundColor: 'rgba(0, 16, 38, 0.6)',
                });
            } else {
                this._chat.postMessage({type: 'chat-scroll'}, '*');
                this._chat.show();
            }
        } else if (this._chat) {
            this._chat.hide();
        } else {
            this._chatbox.classList.add('hidden');
        }
    }

    private readonly _chatbox: HTMLElement | null;
    private readonly _store: Store<any>;
    private _chat: Chat | undefined;

    private _visible = false;
}
