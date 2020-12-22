import AttendanceList from '../models/AttendanceList'
import keysView from './keys_view';

export default {
    render(attendance_list: AttendanceList) {
        return {
            id: attendance_list.id,
            title: attendance_list.title,
            note: attendance_list.note,
            closed: attendance_list.closed,
            keys: keysView.renderMany(attendance_list.keys),
        };
    },

    renderMany(attendance_lists: AttendanceList[]) {
        return attendance_lists.map(attendance_list => this.render(attendance_list))
    }
}