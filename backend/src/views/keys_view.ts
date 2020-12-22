import Key from '../models/Key';

export default {
    render(key: Key) {
        return {
            id: key.id,
            value: key.value,
            present: key.present,
        };
    },

    renderMany(keys: Key[]) {
        return keys.map(key => this.render(key))
    }
}