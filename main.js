var dataset = {};
/*
Applicant or Qualifier Person Title: "APPLICANT"
Applicant or Qualifier of Person: "PITCOCK, THERESA"
Business Mailing Address Line 01: "AATN: THERESE PITCOCK, GEN ACC"
Business Mailing Address Line 02: "6600 AAA DRIVE"
Business Mailing City: "CHARLOTTE"
Business Mailing State: "NC"
Business Mailing Zip Code: "28212"
Business Name Short: "A A A CAR CARE CENTERS LLC"
Business Opened Date: "09/08/2007"
License Classification Description: "AUTO GARAGE"
License Fiscal Year: "2016"
License Number: "26678"
License Status: "AC"
Location Address: "924 N  PLEASANTBURG DR"
*/

window.onload = function() {
  document.getElementById('loader').style.display = 'block';

  /* set up XMLHttpRequest */
  var url = "2016ResidentBusinessLicenseList_201612201241106417.xlsx";
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url, true);
  oReq.responseType = "arraybuffer";

  oReq.onload = function(e) {
    var arraybuffer = oReq.response;

    /* convert data to binary string */
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");

    /* Call XLSX */
    var workbook = XLSX.read(bstr, {type:"binary"});

    /* DO SOMETHING WITH workbook HERE */
    var sheet = workbook.Sheets[workbook.SheetNames[0]];
    /* trim spaces */
    Object.keys(sheet).forEach( function(key) {
      if(sheet[key].w) {
        sheet[key].w = sheet[key].w.trim();
      }
    });
    /* convert to JSON */
    dataset = XLSX.utils.sheet_to_json(sheet, {range: 1});

    document.getElementById('loader').style.display = 'none';
  }

  oReq.send();

  document.getElementById('search').onclick = function() {
    document.getElementById('loader').style.display = 'block';
  
    var businessName = document.getElementById('business-name').value.toUpperCase();
    var personName = document.getElementById('person-name').value.toUpperCase();
    var address = document.getElementById('address').value.toUpperCase();
    var category = document.getElementById('category').value.toUpperCase();
    
    var results = [];
    for (var i = 0; i < dataset.length; i++) {
      var row = dataset[i];
      var fullmatch = true;
      var matches = 0;
      if(businessName && row['Business Name Short']) {
        if(row['Business Name Short'].indexOf(businessName) > -1) {
          matches += 1;
        } else {
          fullmatch = false;          
        }
      }
      if(personName && row['Applicant or Qualifier of Person']) {
        if(row['Applicant or Qualifier of Person'].indexOf(personName) > -1) {
          matches += 1;
        } else {
          fullmatch = false;
        }
      }
      if(address && row['Location Address']) {
        if(row['Location Address'].indexOf(address) > -1) {
          matches += 1;
        } else if(row['Business Mailing Address Line 01'] && row['Business Mailing Address Line 01'].indexOf(address) > -1) {
          matches += 1;
        } else {
          fullmatch = false;
        }
      }
      if(category && row['License Classification Description']) {
        if(category && row['License Classification Description'] && row['License Classification Description'].indexOf(category) > -1) {
          matches += 1;
        } else {
          fullmatch = false;
        }
      }

      if(fullmatch && matches > 0) {
        resuts.push(row);
      }
    }

    /* format results */
    var resultHtml = '';
    results.forEach(function(result) {
      resultHtml += '<div class="business">';
      Object.keys(result).forEach( function(key) {
        resultHtml += '<div class="row"><div class="title">' + key + '</div><div class="decription">' + result[key] + '</div></div>';
      });
      resultHtml += '</div>';
    })

    document.getElementById('result').innerHTML = resultHtml;

    document.getElementById('loader').style.display = 'none';    
  }
};
