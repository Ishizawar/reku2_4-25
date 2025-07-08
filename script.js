new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
		// POP UPタブ
	colors: [
          '#F0F8FF',
          '#FFF8DC',
          '#E6E6FA',
          '#FFF0F5',
          '#FFFACD',
        ],
   slides: [
          '東京',
          '大阪',
          '名古屋',
          '北海道',
          '福岡',
        ],
		detail:[
			'2025 9/20(土)-23(火)',
			'2025 10/10(金)-13(月)',
			'2025 12/5(金)-7(日)',
			'2026 2/16(木)-19(日)',
			'2026 4/24(金)-26(日)',
		],
		adddata:[
			'開場 8:00  開演10:00',
			'開場 9:00  開演10:30',
			'開場 9:00  開演10:00',
			'開場 10:00  開演11:00',
			'開場 10:00  開演11:00',
		],
		artists: [],
    loading: false,
		showModal: false,
    modalTitle: '',
		ticketTable: [
      {
        category: '会員先行',
        seats: [
          { type: 'アリーナ席', price: 6000 },
          { type: 'スタンド席', price: 5000 },
          { type: '親子席', price: 4000 }
        ]
      },
      {
        category: 'オフィシャル先行',
        seats: [
          { type: 'アリーナ席', price: 7000 },
          { type: 'スタンド席', price: 6000 },
          { type: '親子席', price: 5000 }
        ]
      },
      {
        category: '一般',
        seats: [
          { type: 'アリーナ席', price: 8000 },
          { type: 'スタンド席', price: 7000 },
          { type: '親子席', price: 6000 }
        ]
      }
    ],
    tab: 0, // タブの初期値
    Name: '',
    PhoneNumber: '',
    MailAddress: '',
    Number_of_Tickets: '',
	  Days:'',
    SeatType: '',
    UpdateId: '',
    dataList: [],
    reservationMessage: '',
    // チケット枚数の選択肢
    ticketOptions: [
      { text: '1枚', value: '1' },
      { text: '2枚', value: '2' },
      { text: '3枚', value: '3' },
      { text: '4枚', value: '4' },
    ],
		
		// 日付の選択肢
		DaysOptions: [
      { text: '7/19', value: '2025-07-19' },
      { text: '7/20', value: '2025-07-20' },
			{ text: '7/21', value: '2025-07-21' },
    ],
		
    // 席種番号の選択肢
    seatOptions: [
      { text: 'アリーナ席', value: 'アリーナ席' },
      { text: 'スタンド席', value: 'スタンド席' },
			{ text: '親子席', value: '親子席' },
    ]

  },
	
	
	

  mounted() {
    this.loadData('2025-07-19');
  },
	
	
  methods: {
		openModal(seatType, category, price) {
      this.modalTitle = `${category} - ${seatType}（${price}円）申し込み`;
      this.showModal = true;
			this.SeatType = seatType;
    },
		
		loadData(date) {
      this.loading = true;
      const url = `https://m3h-ishizawa-reku3-05-08.azurewebsites.net/api/GETARTIST?Date=${date}`;
      axios.get(url)
        .then(res => {
          this.artists = Array.isArray(res.data.List) ? res.data.List : [];
        })
        .catch(err => {
          console.error("APIエラー:", err);
          this.artists = [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
		
    formatPhoneNumber() {
      // ハイフンや全角文字を削除し、半角数字のみを残す
      this.PhoneNumber = this.PhoneNumber.replace(/[^0-9]/g, '');
    },
    phoneNumberRules(value) {
      // 空の入力に対するエラーメッセージ
      if (!value) return '電話番号を入力してください';
      // 半角数字のみのチェック
      const regex = /^[0-9]+$/;
      if (!regex.test(value)) return '半角数字のみで入力してください';
      return true; // 検証通過
    },

    addData: async function() {
      
      //POSTメソッドで送るパラメーターを作成
      const param = {
        Name : this.Name,
        PhoneNumber : this.PhoneNumber,
        MailAddress : this.MailAddress,
        Number_of_Tickets: this.Number_of_Tickets,
				Days:this.Days,
        SeatType: this.SeatType,
      };
      
      try {
    const response = await axios.post('https://m3h-ishizawa-reku3-05-08.azurewebsites.net/api/INSERT', param);
    console.log('API Response:', response.data); // APIレスポンスの内容を確認

    // ここでAPIのレスポンス内容に基づいてメッセージを設定
    this.reservationMessage ='申し込みが完了いたしました。 ';
  } 
			catch (error) {
    console.error('Error reserving tickets:', error);
    this.reservationMessage = 'Failed to reserve tickets. Please try again.';
  }

    },
      
    // データベースからデータを取得する関数
    readData: async function() {
      // 電話番号が入力されている場合のみAPIを呼び出す
      if (this.PhoneNumber) {
     try {
      //SELECT用のAPIを呼び出し、電話番号をパラメータとして渡す      
      const response = await axios.get('https://m3h-ishizawa-reku3-05-08.azurewebsites.net/api/SELECT',{
            params: {
              PhoneNumber: this.PhoneNumber
            }
          });
      
      //結果リストを表示用配列に代入
      this.dataList = response.data.List;
			
    } 
				catch (error) {
          console.error('Error reading data:', error);
        }
      } else {
        alert('予約時の電話番号を入力してください');
     }
   },

    
    // データベースのデータを更新する関数
    async updateData() {
      const param = {
        Id: this.UpdateId,
        Name: this.Name,
        PhoneNumber: this.PhoneNumber,
        MailAddress: this.MailAddress,
        Number_of_Tickets: this.Number_of_Tickets,
				Days:this.Days,
        SeatType: this.SeatType,
      };
      try {
        const response = await axios.put('https://m3h-ishizawa-reku3-05-08.azurewebsites.net/api/UPDATE', param);
        console.log(response.data);
      } catch (error) {
        console.error('Error updating data:', error);
      }
    },
    
    // 予約データの削除
  async deleteData() {
     if (this.PhoneNumber) {

    // 確認ダイアログの表示
    const confirmCancel = confirm("予約をキャンセルしますか？");
    
    // ユーザーが確認した場合のみ削除処理を実行
    if (confirmCancel) {
     try {
          const response = await axios.post('https://m3h-ishizawa-reku3-05-08.azurewebsites.net/api/DELETE', {
              PhoneNumber: this.PhoneNumber
          });
          console.log('API Response:', response.data);
          alert('予約がキャンセルされました');
          this.readData(); // データ再取得で画面更新
        } catch (error) {
          console.error('Error deleting data:', error);
          alert('予約のキャンセルに失敗しました。もう一度やり直してください。');

     
      }
    }
  
  }else {
        alert('Please enter a phone number to cancel the reservation.');
  }
  }
  },
    
});