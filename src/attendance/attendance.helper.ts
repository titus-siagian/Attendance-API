export default class AttendanceHelper {
  static convertProblem(data: string): string {
    const problems = [
      {
        state: 'A1',
        text: 'Handphone Bermasalah',
      },
      {
        state: 'A2',
        text: 'Tidak bisa login',
      },
      {
        state: 'A3',
        text: 'Aplikasi Bermasalah',
      },
      {
        state: 'A4',
        text: 'Lupa Clock In/Out',
      },
      {
        state: 'A5',
        text: 'Hari Libur/Cuti/Sakit',
      },
      {
        state: 'A6',
        text: 'Ganti Jadwal',
      },
    ];

    const find = problems.find((x) => x.state == data);

    return find ? find.text : '';
  }
}
