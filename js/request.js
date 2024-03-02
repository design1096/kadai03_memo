$(document).ready(function(){
  localStorage.clear();
  document.getElementById('type_text_area').style.display = 'none';
  // 経費種別プルダウン選択
  $('#expense_type').change(function(){
    let selected = $(this).val();
    // 「その他」が選択された場合
    if (selected == '2') {
      document.getElementById('type_text_area').style.display = 'block';
    } else {
      document.getElementById('type_text_area').style.display = 'none';
    }
  });
});

// 未入力チェック
function CheckForm(day, selected, other, price){
  // 日付テキストボックス
  if (day == '') {
    return false;
  }
  // 経費プルダウン
  if (selected == '') {
    return false;
  } else if (selected == '2' && other == '') {
    return false;
  }
  // 金額テキストボックス
  if (price == '') {
    return false;
  }
  return true;
}

// 申請ボタン押下時処理
$('#application_btn').on('click', function() {
  let day = document.getElementById('expense_day').value;
  let selected = document.getElementById('expense_type').value;
  let other = document.getElementById('type_text').value;
  let price = document.getElementById('price_number').value;

  if (CheckForm(day, selected, other, price)) {
    // 経費種別取得
  let type = GetExpenseType(selected, other);
  // 金額取得
  let price_total = GetExpenseTotalPrice(price);
  // 申請ボタン押下回数取得
  let num = GetClickExpenseBtnNum();
  // 経費テーブルのtbodyを作成
  CreateExpenseTbody(day, type, price, num);
  // 合計金額テーブルのtbodyを作成
  CreateTotalTbody(price_total);
  }
});

// クリアボタン押下時処理
$('#clear_btn').on('click', function() {
  localStorage.clear();
  let expense_table = document.getElementById("expense_table");
  expense_table.innerHTML = "";
  let total_table = document.getElementById("total_table");
  total_table.innerHTML = "";
  let expense_day = document.getElementById("expense_day");
  expense_day.value = "";
  let expense_type = document.getElementById("expense_type");
  expense_type.value = "";
  let type_text = document.getElementById("type_text");
  type_text.value = "";
  document.getElementById('type_text_area').style.display = 'none';
  let price_number = document.getElementById("price_number");
  price_number.value = "";
});

// 申請ボタン押下回数取得処理
function GetClickExpenseBtnNum(){
  let num = Number(localStorage.getItem('申請ボタン押下回数'));
  localStorage.setItem('申請ボタン押下回数', String(num + 1));
  return localStorage.getItem('申請ボタン押下回数');
}

// 経費種別処理
function GetExpenseType(selected, other){
  if (selected == '1') {
    localStorage.setItem('経費種別', '交通費');
    return localStorage.getItem('経費種別');
  } else if (selected == '2') {
    localStorage.setItem('経費種別', other);
    return localStorage.getItem('経費種別');
  } else {
    return "";
  }
}

// 合計金額取得処理
function GetExpenseTotalPrice(price){
  let num = Number(localStorage.getItem('金額'));
  localStorage.setItem('金額', String(num + Number(price)));
  return localStorage.getItem('金額');
}

// 経費テーブルのtbodyを作成
function CreateExpenseTbody(day, type, price, num){
  $('#expense_table').append('<tr id="tr_' +  num + '"><th scope="row">' + num + '</th><td>' + day + '</td><td>' + type + '</td><td>' + price + '円</td></tr>');
}

// 合計金額テーブルのtbodyを作成
function CreateTotalTbody(price_total){
  $('#total_table').html('<tr><th scope="row"></th><td>' + price_total + '円</td></tr>');
}