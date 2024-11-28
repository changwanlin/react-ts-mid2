export interface Student {
    _id: string;

    /**
     * 帳號
     */
    userName: string;

    /**
     * 座號
     */
    sid: string;

    /**
     * 姓名
     */
    name: string;

    /**
     * 院系
     */
    department: string;

    /**
     * 年級
     */
    grade: string;

    /**
     * 班級
     */
    class: string;

    /**
     * Email
     */
    Email: string;

    /**
     * 缺席次數
     */
    absences?: number | undefined;
}