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
  // 申請ボタン押下回数取得
  let num = GetClickExpenseBtnNum();
  // 合計JSON取得
  let total_json = JSON.parse(GetTotal(type, price));
  // 経費テーブルのtbodyを作成
  CreateExpenseTbody(day, type, price, num);
  // 合計テーブルのtbodyを作成
  CreateTotalTbody(total_json);
  }
});

// クリアボタン押下時処理
$('#clear_btn').on('click', function() {
  localStorage.clear();
  let expense_table = document.getElementById("expense_table");
  expense_table.innerHTML = "";
  let trans_price = document.getElementById("trans_price");
  trans_price.innerText = "";
  let other_price = document.getElementById("other_price");
  other_price.innerText = "";
  let total_price = document.getElementById("total_price");
  total_price.innerText = "";
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
    return '交通費';
  } else if (selected == '2') {
    return other;
  } else {
    return "";
  }
}

// 合計取得処理
function GetTotal(type, price){
  let json_str = '{"交通費":"","その他":"","合計金額":""}';
  let total_str = localStorage.getItem('合計');
  if (total_str == null) {
    let obj = JSON.parse(json_str);
    if (type == '交通費') {
      obj.交通費 = price;
    } else {
      obj.その他 = price;
    }
    obj.合計金額 = price;
    localStorage.setItem('合計', JSON.stringify(obj));
  } else {
    let total_obj = JSON.parse(total_str);
    if (type == '交通費') {
      let trans_price = Number(total_obj.交通費);
      total_obj.交通費 = String(trans_price + Number(price));
    } else {
      let other_price = Number(total_obj.その他);
      total_obj.その他 = String(other_price + Number(price));
    }
    let total_price = Number(total_obj.合計金額);
    total_obj.合計金額 = String(total_price + Number(price));
    localStorage.setItem('合計', JSON.stringify(total_obj));
  }
  return localStorage.getItem('合計');
}

// 経費テーブルのtbodyを作成
function CreateExpenseTbody(day, type, price, num){
  $('#expense_table').append('<tr id="tr_' +  num + '"><th scope="row">' + num + '</th><td>' + day + '</td><td>' + type + '</td><td>' + price + '円</td></tr>');
}

// 合計テーブルのtbodyを作成
function CreateTotalTbody(total_json){
  if (total_json.交通費 != "") {
    $('#trans_price').text(total_json.交通費 + '円');
  }
  if (total_json.その他 != "") {
    $('#other_price').text(total_json.その他 + '円');
  }
  if (total_json.合計金額 != "") {
    $('#total_price').text(total_json.合計金額 + '円');
  }
}